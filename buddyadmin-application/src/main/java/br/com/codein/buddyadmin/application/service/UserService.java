package br.com.codein.buddyadmin.application.service;

import br.com.codein.buddyadmin.integration.client.SecurityClient;
import br.com.gumga.security.domain.model.institutional.Organization;
import br.com.gumga.security.domain.model.institutional.User;
import gumga.framework.core.GumgaThreadScope;
import gumga.framework.domain.domains.GumgaBoolean;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserService {

    @Autowired
    private SecurityClient securityClient;

    @Autowired
    private CompanyService companyService;

    public List<User> getUsersFromOrganization(Long orgId){
        Long oldId = GumgaThreadScope.organizationId.get();
        securityClient.changeOrganization(orgId);
        List <User> result = securityClient.getUsersFromOrganization();
        securityClient.changeOrganization(oldId);
        return result;
    }

    public User createUser(String login, String name){
        User user = new User();
        user.setLogin(login);
        user.setName(name);
        user.setStatus(new GumgaBoolean(true));
        user.setPassword("qwe123");
        user = securityClient.saveUser(user);
        this.addUserInOrganization(user);
        return user;

    }

    public User addUserInOrganization(User user){
        Organization org = companyService.getOrganization(GumgaThreadScope.organizationId.get());
        return addUserInOrganization(user,org);
    }

    public User addUserInOrganization(User user, Long organizationId){
        Organization org = companyService.getOrganization(organizationId);
        return addUserInOrganization(user,org);
    }


    public User addUserInOrganization(User user, Organization org){
        securityClient.addUserInOrganization(user,org);
        return securityClient.getUserByEmail(user.getLogin());
    }

    public User removeUserFromOrganization(User user, Long organizationId){
        Organization org = companyService.getOrganization(organizationId);
        return removeUserFromOrganization(user,org);
    }


    public User removeUserFromOrganization(User user, Organization org){
        securityClient.removeUserFromOrganization(user,org);
        return securityClient.getUserByEmail(user.getLogin());
    }







}
