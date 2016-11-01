package br.com.codein.buddyadmin.application.service;


import br.com.codein.buddyadmin.integration.client.SecurityClient;
import br.com.codein.buddyperson.application.service.person.PersonService;
import br.com.codein.buddyperson.domain.person.Person;
import br.com.codein.buddyperson.domain.person.enums.RoleCategory;
import br.com.gumga.security.domain.model.institutional.Organization;
import br.com.gumga.security.domain.model.institutional.User;
import gumga.framework.core.GumgaThreadScope;
import gumga.framework.domain.domains.GumgaBoolean;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;

/**
 * Created by luizaugusto on 27/10/16.
 */
@Service
public class CompanyService {

    @Autowired
    private SecurityClient securityClient;

    @Autowired
    private PersonService personService;

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
            result =securityClient.newOrganization(x);
        }


        personService.changeOrganization(j,result.getHierarchyCode());

        return result;
    }


    public Boolean needToCreateSubOrganization(Person p){
       return (p.getRoles().stream().filter(associativeRole ->
                associativeRole.getActive() &&  RoleCategory.REPRESENTATIVE.equals(associativeRole.getRole().getCategory())).count() > 0);
    }

    public Organization createSubOrganization(Person p, Organization org){
        LinkedList<String> splicedFatherOi = new LinkedList<>(Arrays.asList(p.getFather().getOi().getValue().split("\\.")));
        String rootFatherSecurityId = splicedFatherOi.removeFirst();
        Organization root = securityClient.getOrganization(Long.valueOf(rootFatherSecurityId));
        Organization father = getChildRecursive(splicedFatherOi,root);
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
