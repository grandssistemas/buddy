package br.com.codein.buddyadmin.application.service;


import br.com.codein.buddyadmin.infrastructure.config.ApplicationConstants;
import br.com.codein.buddyadmin.integration.client.SecurityBuddyClient;
import br.com.codein.buddyadmin.integration.client.fashionmanager.DepartmentClient;
import br.com.codein.buddyadmin.integration.client.fashionmanager.JuridicaClient;
import br.com.mobiage.mobiage.application.service.department.DepartmentService;
import br.com.mobiage.mobiage.application.service.person.PersonService;
import br.com.mobiage.mobiage.application.service.person.RoleService;
import br.com.mobiage.mobiage.domain.model.department.Department;
import br.com.gumga.security.domain.model.institutional.Organization;
import br.com.mobiage.mobiage.domain.model.person.Person;
import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;
import io.gumga.core.GumgaValues;
import io.gumga.domain.GumgaTenancyUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.IOException;
import java.util.*;


@Service
public class CompanyBuddyService {

    @Autowired
    private SecurityBuddyClient securityBuddyClient;
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
    @Autowired
    private RoleService roleService;
    @Autowired
    private static GumgaValues gumgaValues;

    private static Properties properties;

    private static Properties getProperties() {
        if(gumgaValues == null)
            gumgaValues = new ApplicationConstants();

        if(properties == null)
            properties = gumgaValues.getCustomFileProperties();

        return properties;
    }

    @Transactional
    public Organization newOrganization(Person person){
        throw new RuntimeException("Esse metodo necesita de atualização");
// Organization newOrganization = new Organization();
//
//        newOrganization.setName(person.getName());
//        newOrganization.setIsSoftwareHouse(false);
//        newOrganization.setSecurityManager(false);
//        newOrganization.setMainOrganization(new GumgaBoolean(false));
//        newOrganization.setSubOrganizations(new HashSet<>());
//        newOrganization.setInternalCode(person.getHierarchy());
//        newOrganization.setMainUser(securityClient.getUserByEmail(GumgaThreadScope.login.get()));
//
//        Organization result;
//        person = personService.loadFatWithFather(person);
//        person.getRoles().forEach(roles -> {
//            roles.getRole().getGroupAttributes().forEach(groupRoleAttribute -> {
//                if (groupRoleAttribute.getAttributes() == null) {
//                    groupRoleAttribute.setAttributes(new ArrayList<>());
//                }
//            });
//        });
//        result = securityClient.saveOrganization(newOrganization);
//
//        GumgaTenancyUtils.changeOi(result.getHierarchyCode(), person);
//        personService.save(person);
//        instanceService.createInstance(result);
//
//        if (person.containRoleWithCategory(RoleCategory.COMPANY)){
//            List<Department> list = exportDepartment(person);
//            exportPerson(person, list);
//        }
//        return result;
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
        if (!person.getDepartments().isEmpty()) {
            List<Department> departments = departmentService.getFatArray(person.getDepartments());
            changeDepartmentOi(departments, person.getOi().getValue());
            ObjectMapper mapper = new ObjectMapper();
            mapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
            List<Department> departmentList = new ArrayList<>();
            for (Department department : departments) {
                try {
                    String departmentWithoutId = mapper.writeValueAsString(department).replaceAll("(\"id\":null|\"id\":[0-9]*)[,]*", "");
                    departmentList.add(mapper.readValue(departmentWithoutId, Department.class));
                } catch (IOException e) {
                    e.printStackTrace();
                }
            }
            return departmentClient.save(departmentList);
        } else {
            return null;
        }
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
        return securityBuddyClient.changeOrganization(id);
    }

    public Organization getOrganization(Long id){
        return securityBuddyClient.getOrganization(id);
    }


    public void exportPerson(Person p, List<Department> departments){
        throw new RuntimeException("Esse metodo necesita de atualização");
//        ObjectMapper mapper = new ObjectMapper();
//        mapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
//        Juridica juridica = null;
//        try {
//            String personWithoutId = mapper.writeValueAsString(p).replaceAll("(\"id\":null|\"id\":[0-9]*)[,]*","");
//            juridica = mapper.readValue(personWithoutId,Juridica.class);
//        } catch (IOException e) {
//            e.printStackTrace();
//        }
//        juridica.setDepartments(departments);
//        juridica.setOrganizationCode(juridica.getOi().getValue());
//        Juridica s = juridicaClient.save(juridica);
    }

    @Transactional
    public void verifyExistSH() {
        System.out.println("verifyexistsh: Esse metodo necesita de atualização");
//        throw new RuntimeException("Esse metodo necesita de atualização");
// List<Person> persons = personService.findByRoleCategory(RoleCategory.OWNER);
//        if (persons.isEmpty()) {
//            Juridica person = new Juridica();
//            person.setName(getProperties().getProperty("sh.name"));
//            person.setActive(new GumgaBoolean(true));
//            person.setNickname(person.getName());
//            person.setAttributeValues(new ArrayList<>());
//            person.setBranches(new ArrayList<>());
//            person.setRelationships(new ArrayList<>());
//            person.setSocialNetworks(new ArrayList<>());
//            person.setCnaes(new ArrayList<>());
//            List<Address> addresses = new ArrayList<>();
//            Address address = new Address();
//            address.setPrimary(true);
//            address.setAddress(new GumgaAddress("", "", "", "", "", "", "", "", "", new Double(0), new Double(0), ""));
//            addresses.add(address);
//            person.setAddressList(addresses);
//            List<Phone> phones = new ArrayList<>();
//            Phone phone = new Phone();
//            phone.setPrimary(true);
//            phone.setCarrier(null);
//            phone.setDescription(PhoneType.COMERCIAL);
//            phone.setInformation(null);
//            phone.setPhone(new GumgaPhoneNumber(""));
//            phones.add(phone);
//            person.setPhones(phones);
//            List<Email> emails = new ArrayList<>();
//            Email email = new Email();
//            email.setPrimary(true);
//            email.setEmail(new GumgaEMail(getProperties().getProperty("sh.email")));
//            emails.add(email);
//            person.setEmails(emails);
//            Set<AssociativeRole> associativeRoles = new HashSet<>();
//            AssociativeRole associativeRole = new AssociativeRole();
//            associativeRole.setActive(true);
//            associativeRole.setRole(roleService.recoverByCategory(RoleCategory.OWNER).get(0));
//            associativeRoles.add(associativeRole);
//            person.setRoles(associativeRoles);
//            personService.save(person);
//        }
    }
}
