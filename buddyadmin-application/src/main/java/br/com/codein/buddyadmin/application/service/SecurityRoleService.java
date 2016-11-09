package br.com.codein.buddyadmin.application.service;

import br.com.codein.buddyadmin.integration.client.SecurityClient;
import br.com.gumga.security.domain.model.instance.AddRemove;
import br.com.gumga.security.domain.model.instance.Instance;
import br.com.gumga.security.domain.model.instance.OperationEspecification;
import br.com.gumga.security.domain.model.instance.Role;
import br.com.gumga.security.gateway.RoleAndList;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;

/**
 * Created by luizaugusto on 07/11/16.
 */
@Service
public class SecurityRoleService {

    @Autowired
    private SecurityClient securityClient;

    @Autowired
    private InstanceService instanceService;

    public Role createRole(Long instanceId, String name) {
        Instance i = instanceService.getInstance(instanceId);
        return createRole(i, name);
    }


    public Role createRole(Instance instance, String name) {
        Role role = new Role();

        role.setName(name);
        role.setInstance(instance);
        role.setUsers(new HashSet<>());

        List<OperationEspecification> esp = new ArrayList<>();

        instance.getSoftwares().forEach(software -> {
            software.getOperations().forEach(operation -> {
                OperationEspecification e = new OperationEspecification();
                e.setName(operation.getName());
                e.setOperation(operation);
                e.setType(AddRemove.ADD);
                esp.add(e);
            });
        });

        RoleAndList roleAndList = new RoleAndList();
        roleAndList.setRole(role);
        roleAndList.setOperationsEspecifications(esp);
        return securityClient.saveRoleAndList(roleAndList);

    }


    public Role getRole(Long roleId) {
        return securityClient.getRole(roleId);
    }
}
