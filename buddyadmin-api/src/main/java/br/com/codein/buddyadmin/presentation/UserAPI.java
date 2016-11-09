package br.com.codein.buddyadmin.presentation;

import br.com.codein.buddyadmin.application.service.UserService;
import br.com.gumga.security.domain.model.instance.Role;
import br.com.gumga.security.domain.model.institutional.User;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
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

    @RequestMapping(value = "/create", method = RequestMethod.POST)
    public User createUser(@RequestBody ObjectNode params) throws IOException {

        ObjectMapper mapper = new ObjectMapper();


        String name = params.get("name").asText();
        String email = params.get("email").asText();
        String organizationOi = params.get("oi").asText();
        Role role = mapper.readValue(params.get("role").toString(),Role.class);

        return userService.createUser(name,email,organizationOi,role);
    }

    @RequestMapping(value ="/adduserinorganization/{orgId}/{userEmail}")
    public User addUserInOrganization(@PathVariable("orgId") Long organizationId, @PathVariable("userEmail") String userEmail){
        return userService.addUserInOrganization(userEmail,organizationId);
    }

    @RequestMapping(value ="/removeuserfromorganization/{orgId}/{userEmail}")
    public User removeUserFromOrganization(@PathVariable("orgId") Long organizationId, @PathVariable("userEmail") String userEmail){
        return userService.removeUserFromOrganization(userEmail,organizationId);
    }
}
