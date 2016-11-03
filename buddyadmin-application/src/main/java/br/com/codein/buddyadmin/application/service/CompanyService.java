package br.com.codein.buddyadmin.application.service;


import br.com.codein.buddyadmin.integration.client.SecurityClient;
import br.com.codein.buddyperson.application.service.person.PersonService;
import br.com.codein.buddyperson.domain.person.Person;
import br.com.codein.buddyperson.domain.person.enums.RoleCategory;
import br.com.gumga.security.domain.model.institutional.Organization;
import br.com.gumga.security.domain.model.institutional.User;
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

/**
 * Created by luizaugusto on 27/10/16.
 */
@Service
public class CompanyService {

    @Autowired
    private SecurityClient securityClient;

    @Autowired
    private PersonService personService;

    @Transactional
    public Organization newOrganization(Person obj){
        Organization x = new Organization();

        x.setName(obj.getName());
        x.setIsSoftwareHouse(false);
        x.setSecurityManager(false);
        x.setMainOrganization(new GumgaBoolean(false));
        x.setSubOrganizations(new HashSet<>());
        x.setInternalCode(obj.getHierarchy());
        User main =securityClient.getUserByEmail(GumgaThreadScope.login.get());
        x.setMainUser(main);

        Organization result;
        Person j = personService.loadFatWithFather(obj);
        if (needToCreateSubOrganization(j)){
            result = createSubOrganization(j, x);
        } else {
            result =securityClient.saveOrganization(x);
        }


        personService.changeOrganization(j,result.getHierarchyCode());

        return result;
    }

    @Transactional(readOnly = true, propagation = Propagation.REQUIRES_NEW)
    public Boolean needToCreateSubOrganization(Person p){

        Boolean isRepresentative = p.containRoleWithCategory(RoleCategory.REPRESENTATIVE);
        Boolean isSubCompany = Boolean.FALSE;
        if (p.getFather() != null){
            Hibernate.initialize(p.getFather().getRoles());
            isSubCompany = p.containRoleWithCategory(RoleCategory.COMPANY) &&
                    p.getFather().containRoleWithCategory(RoleCategory.COMPANY);
        }
       return isRepresentative || isSubCompany;
    }

    public Organization createSubOrganization(Person p, Organization org){
        LinkedList<String> splicedFatherOi = new LinkedList<>(Arrays.asList(p.getFather().getOi().getValue().split("\\.")));
        String rootFatherSecurityId = splicedFatherOi.removeFirst();
        Organization root = securityClient.getOrganization(Long.valueOf(rootFatherSecurityId));
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
}
