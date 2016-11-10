package br.com.codein.buddyadmin.application.service;


import br.com.codein.buddyadmin.integration.client.SecurityClient;
import br.com.codein.buddyperson.application.service.person.PersonService;
import br.com.codein.buddyperson.domain.person.Person;
import br.com.codein.buddyperson.domain.person.enums.RoleCategory;
import br.com.gumga.security.domain.model.institutional.Organization;
import gumga.framework.core.GumgaThreadScope;
import gumga.framework.domain.domains.GumgaBoolean;
import org.hibernate.Hibernate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import java.util.Arrays;
import java.util.HashSet;
import java.util.LinkedList;
import java.util.List;


@Service
public class CompanyService {

    @Autowired
    private SecurityClient securityClient;

    @Autowired
    private PersonService personService;

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

        personService.changeOrganization(personWithFather,result.getHierarchyCode());
        return result;
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
}
