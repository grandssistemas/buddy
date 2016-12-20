package br.com.codein.buddyadmin.presentation;

import br.com.codein.buddyadmin.application.service.SecurityRoleService;
import br.com.gumga.security.domain.model.instance.Instance;
import br.com.gumga.security.domain.model.instance.Role;
import com.fasterxml.jackson.databind.node.ObjectNode;
import gumga.framework.core.QueryObject;
import gumga.framework.core.SearchResult;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

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

    @RequestMapping(method = RequestMethod.GET)
    public SearchResult<Role> search(QueryObject param){
        List<Role> result = securityRoleService.search(param);
        return new SearchResult<Role>(param,result.size(),result);
    }
}
