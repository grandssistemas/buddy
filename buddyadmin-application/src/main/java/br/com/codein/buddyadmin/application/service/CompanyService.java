package br.com.codein.buddyadmin.application.service;


import br.com.codein.buddyadmin.integration.client.SecurityClient;
import br.com.codein.buddyperson.domain.person.Person;
import br.com.gumga.security.domain.model.institutional.Organization;
import gumga.framework.core.GumgaThreadScope;
import gumga.framework.domain.domains.GumgaBoolean;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashSet;

/**
 * Created by luizaugusto on 27/10/16.
 */
@Service
public class CompanyService {

    @Autowired
    private SecurityClient securityClient;

    public Organization newOrganization(Person obj){
        Organization x = new Organization();

        x.setName(obj.getName());
        x.setIsSoftwareHouse(false);
        x.setSecurityManager(false);
        x.setMainOrganization(new GumgaBoolean(false));
        x.setSubOrganizations(new HashSet<>());
        x.setMainUser(securityClient.getUserByEmail(GumgaThreadScope.login.get()));


        return securityClient.newOrganization(x);
    }


    public Organization changeOrganization(Long id){
        return securityClient.changeOrganization(id);
    }
}
