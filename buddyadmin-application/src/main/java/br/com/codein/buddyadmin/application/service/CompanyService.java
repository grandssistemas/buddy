package br.com.codein.buddyadmin.application.service;


import br.com.codein.buddyadmin.integration.client.SecurityClient;
import br.com.codein.buddyadmin.integration.client.fashionmanager.DepartmentClient;
import br.com.codein.buddyadmin.integration.client.fashionmanager.JuridicaClient;
import br.com.codein.buddyperson.application.service.person.PersonService;
import br.com.codein.buddyperson.domain.person.Juridica;
import br.com.codein.buddyperson.domain.person.Person;
import br.com.codein.buddyperson.domain.person.enums.RoleCategory;
import br.com.codein.department.application.service.DepartmentService;
import br.com.codein.department.domain.model.department.Department;
import br.com.gumga.security.domain.model.institutional.Organization;
import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;
import io.gumga.core.GumgaThreadScope;
import io.gumga.domain.GumgaMultitenancy;
import io.gumga.domain.GumgaTenancyUtils;
import io.gumga.domain.domains.GumgaBoolean;
import io.gumga.domain.repository.GumgaMultitenancyUtil;
import org.hibernate.Hibernate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import java.io.IOException;
import java.util.*;


@Service
public class CompanyService {

    @Autowired
    private SecurityClient securityClient;

    @Autowired
    private PersonService personService;
    @Autowired
    private DepartmentService departmentService;

    @Autowired
    private JuridicaClient juridicaClient;
    @Autowired
    private DepartmentClient departmentClient;
    @Autowired
    private InstanceService instanceService;

    @Transactional
    public Organization newOrganization(Person person){
        Organization newOrganization = new Organization();

        newOrganization.setName(person.getName());
        newOrganization.setIsSoftwareHouse(false);
        newOrganization.setSecurityManager(false);
        newOrganization.setMainOrganization(new GumgaBoolean(false));
        newOrganization.setSubOrganizations(new HashSet<>());
        newOrganization.setInternalCode(person.getHierarchy());
        newOrganization.setMainUser(securityClient.getUserByEmail(GumgaThreadScope.login.get()));

        Organization result;
        Person personWithFather = personService.loadFatWithFather(person);
        if (needToCreateSubOrganization(personWithFather)){
            result = createSubOrganization(personWithFather, newOrganization);
        } else {
            result =securityClient.saveOrganization(newOrganization);
        }

        GumgaTenancyUtils.changeOi(result.getHierarchyCode(), personWithFather);
        personService.save(personWithFather);

        instanceService.createInstance(result);

        if (person.containRoleWithCategory(RoleCategory.COMPANY)){
            List<Department> list = exportDepartment(person);
            exportPerson(person, list);
        }
        return result;
    }

    private void changeDepartmentOi(List<Department> departments, String oi) {
        departments.forEach(department -> {
            GumgaTenancyUtils.changeOi(oi, department);
            if (department.getCharacteristics() != null) {
                department.getCharacteristics().forEach(characteristic -> {
                    GumgaTenancyUtils.changeOi(oi, characteristic);
                });
            }
            if (department.getCategories() != null) {
                department.getCategories().forEach(category -> {
                    GumgaTenancyUtils.changeOi(oi, category);
                    if (category.getCharacteristics() != null) {
                        category.getCharacteristics().forEach(characteristic -> {
                            GumgaTenancyUtils.changeOi(oi, characteristic);
                        });
                    }
                    if (category.getProductTypes() != null) {
                        category.getProductTypes().forEach(pt -> {
                            GumgaTenancyUtils.changeOi(oi, pt);
                            if (pt.getCharacteristics() != null) {
                                pt.getCharacteristics().forEach(associativeCharacteristic -> {
                                    GumgaTenancyUtils.changeOi(oi, associativeCharacteristic);
                                    GumgaTenancyUtils.changeOi(oi, associativeCharacteristic.getCharacteristic());
                                });
                            }
                        });
                    }
                });
            }
        });
    }

    private List<Department> exportDepartment(Person person) {
        List<Department> departments = departmentService.getFatArray(person.getDepartments());
        changeDepartmentOi(departments, person.getOi().getValue());
        ObjectMapper mapper = new ObjectMapper();
        mapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
        List<Department> departmentList = new ArrayList<>();
        for (Department department : departments) {
            try {
                String departmentWithoutId = mapper.writeValueAsString(department).replaceAll("(\"id\":null|\"id\":[0-9]*)[,]*","");
                departmentList.add(mapper.readValue(departmentWithoutId,Department.class));
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
        return departmentClient.save(departmentList);
    }

    @Transactional(readOnly = true, propagation = Propagation.REQUIRES_NEW)
    public Boolean needToCreateSubOrganization(Person p){

        Boolean isRepresentative = p.containRoleWithCategory(RoleCategory.REPRESENTATIVE);
        Boolean isSubCompany = Boolean.FALSE;
        Boolean hasAggregatorFather = Boolean.FALSE;
        if (p.getFather() != null){
            Hibernate.initialize(p.getFather().getRoles());
            isSubCompany = p.containRoleWithCategory(RoleCategory.COMPANY) &&
                    p.getFather().containRoleWithCategory(RoleCategory.COMPANY);
            hasAggregatorFather = p.getFather().containRoleWithCategory(RoleCategory.AGGREGATOR);
        }
       return isRepresentative || isSubCompany || hasAggregatorFather;
    }

    public Organization createSubOrganization(Person p, Organization org){
        LinkedList<String> splicedFatherOi = new LinkedList<>(Arrays.asList(p.getFather().getOi().getValue().split("\\.")));
        String rootFatherSecurityId = splicedFatherOi.removeFirst();
        Organization root = this.getOrganization(Long.valueOf(rootFatherSecurityId));
        Organization father = getChildRecursive(splicedFatherOi,root);
        org.setMainUser(null);
        father.getSubOrganizations().add(org);
        securityClient.saveOrganization(root);
        List<Organization> search = securityClient.getByInternalCode(org.getInternalCode());
        return search.isEmpty()? null : search.get(0);

    }

    private Organization getChildRecursive(LinkedList<String>  splicedFatherOi, Organization org){
        Organization result = org;
        if (!splicedFatherOi.isEmpty()){
            String oi = splicedFatherOi.removeFirst();
            Organization child = org.getSubOrganizations().stream()
                    .filter(o -> oi.equals(o.getId().toString()))
                    .findAny().orElse(null);
            return getChildRecursive(splicedFatherOi,child);
        }
        return result;
    }

    public Organization changeOrganization(Long id){
        return securityClient.changeOrganization(id);
    }

    public Organization getOrganization(Long id){
        return securityClient.getOrganization(id);
    }


    public void exportPerson(Person p, List<Department> departments){

        ObjectMapper mapper = new ObjectMapper();
        mapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
        Juridica juridica = null;
        try {
            String personWithoutId = mapper.writeValueAsString(p).replaceAll("(\"id\":null|\"id\":[0-9]*)[,]*","");
            juridica = mapper.readValue(personWithoutId,Juridica.class);
        } catch (IOException e) {
            e.printStackTrace();
        }
        juridica.setDepartments(departments);
        Juridica s = juridicaClient.save(juridica);
    }
}
