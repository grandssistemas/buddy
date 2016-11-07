package br.com.codein.buddyadmin.presentation;

import br.com.codein.buddyadmin.application.service.UserService;
import br.com.gumga.security.domain.model.institutional.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/user")
public class UserAPI {

    @Autowired
    UserService userService;

    @RequestMapping("/userfromorganization/{orgId}")
    public List<User> getUserFromOrganization(@PathVariable Long orgId){
        return userService.getUsersFromOrganization(orgId);
    }
}
