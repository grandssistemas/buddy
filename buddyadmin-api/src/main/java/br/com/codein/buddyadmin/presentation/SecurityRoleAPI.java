package br.com.codein.buddyadmin.presentation;

import br.com.codein.buddyadmin.application.service.SecurityRoleService;
import br.com.gumga.security.domain.model.instance.Role;
import com.fasterxml.jackson.databind.node.ObjectNode;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/securityrole")
public class SecurityRoleAPI {

    @Autowired
    private SecurityRoleService securityRoleService;

    @RequestMapping(value="/create", method = RequestMethod.POST)
    public Role create(@RequestBody ObjectNode params) {
        String roleName = params.get("name").asText();
        Long instanceId = params.get("instanceId").asLong();
        return securityRoleService.createRole(instanceId,roleName);
    }
}
