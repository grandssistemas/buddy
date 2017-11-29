package br.com.codein.buddyadmin.application.service;

import br.com.codein.buddyadmin.application.utils.StringUtils;
import br.com.codein.buddyadmin.integration.client.SecurityBuddyClient;
import br.com.gumga.security.domain.model.instance.Role;
import br.com.gumga.security.domain.model.institutional.Organization;
import br.com.gumga.security.domain.model.institutional.User;
import io.gumga.core.GumgaThreadScope;
import io.gumga.domain.domains.GumgaBoolean;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserService {

    @Autowired
    private SecurityBuddyClient securityBuddyClient;

    @Autowired
    private CompanyBuddyService companyBuddyService;

    @Autowired
    private StringUtils stringUtils;

    @Autowired
    private SecurityRoleService securityRoleService;

    public List<User> getUsersFromOrganization(Long orgId) {
        Long oldId = GumgaThreadScope.organizationId.get();
        securityBuddyClient.changeOrganization(orgId);
        List<User> result = securityBuddyClient.getUsersFromOrganization();
        securityBuddyClient.changeOrganization(oldId);
        return result;
    }

    public User createUser(String name, String login, String organizationOi, Role role) {
        User user = new User();
        user.setLogin(login);
        user.setName(name);
        user.setStatus(new GumgaBoolean(true));
        user.setPassword("qwe123");
        user = securityBuddyClient.saveUser(user);
        String id = stringUtils.extractOrgIdFromOi(organizationOi);
        this.addUserInOrganization(user, Long.valueOf(id));
        if (role != null ){
            this.addUserInRole(user,role);
        }
        return user;
    }


    public User addUserInRole(User user, Role role) {
        securityBuddyClient.addUserInRole(user, role);
        return securityBuddyClient.getUserByEmail(user.getLogin());
    }

    public User addUserInOrganization(User user, Organization org) {
        securityBuddyClient.addUserInOrganization(user, org);
        return securityBuddyClient.getUserByEmail(user.getLogin());
    }

    public User removeUserFromRole(User user, Role role) {
        securityBuddyClient.removeUserFromRole(user, role);
        return securityBuddyClient.getUserByEmail(user.getLogin());
    }

    public User removeUserFromOrganization(User user, Organization org) {
        securityBuddyClient.removeUserFromOrganization(user, org);
        return securityBuddyClient.getUserByEmail(user.getLogin());
    }

    public User addUserInRole(String userEmail, Long roleId) {
        User user = securityBuddyClient.getUserByEmail(userEmail);
        return this.addUserInRole(user,roleId);
    }

    public User addUserInOrganization(String userEmail, Long organizationId) {
        User user = securityBuddyClient.getUserByEmail(userEmail);
        return addUserInOrganization(user, organizationId);
    }

    public User removeUserFromRole(String userEmail, Long roleId) {
        User user = securityBuddyClient.getUserByEmail(userEmail);
        return removeUserFromRole(user, roleId);
    }

    public User removeUserFromOrganization(String userEmail, Long organizationId) {
        User user = securityBuddyClient.getUserByEmail(userEmail);
        return removeUserFromOrganization(user, organizationId);
    }

    public User addUserInRole(User user, Long roleId) {
        Role role = securityRoleService.getRole(roleId);
        return this.addUserInRole(user,role);
    }

    public User addUserInOrganization(User user, Long organizationId) {
        Organization org = companyBuddyService.getOrganization(organizationId);
        return addUserInOrganization(user, org);
    }

    public User removeUserFromOrganization(User user, Long organizationId) {
        Organization org = companyBuddyService.getOrganization(organizationId);
        return removeUserFromOrganization(user, org);
    }

    public User removeUserFromRole(User user, Long roleId) {
        Role role = securityRoleService.getRole(roleId);
        return removeUserFromRole(user, role);
    }


}
