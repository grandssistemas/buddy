package br.com.codein.buddyadmin.application.service;

import br.com.codein.buddyadmin.application.utils.StringUtils;
import br.com.codein.buddyadmin.integration.client.SecurityClient;
import br.com.gumga.security.domain.model.instance.Instance;
import br.com.gumga.security.domain.model.institutional.Organization;
import io.gumga.core.QueryObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.temporal.ChronoUnit;
import java.util.Date;
import java.util.List;

@Service
public class InstanceService {

    @Autowired
    private StringUtils stringUtils;

    @Autowired
    private CompanyService companyService;

    @Autowired
    private SoftwareService softwareService;

    @Autowired
    private SecurityClient securityClient;

    @Autowired
    private SecurityRoleService securityRoleService;

    public Instance createInstance(Organization org){
        Instance result = new Instance();

        result.setName("Instancia do "+ org.getName());
        result.setExpiration(Date.from( new Date().toInstant().plus(60, ChronoUnit.DAYS)));
        result.setOrganization(org);
        result.setSoftwares(softwareService.getAll());
        Instance created = securityClient.saveInstance(result);
        securityRoleService.createRole(created, "Papel padrão da " + result.getName());
        return this.getInstance(created.getId());
    }

    public Instance createInstance(String name, Date expiration, String organizationOi) {

        Instance result = new Instance();

        result.setName(name);
        result.setExpiration(expiration);
        String id = stringUtils.extractOrgIdFromOi(organizationOi);
        Organization org = companyService.getOrganization(Long.valueOf(id));
        result.setOrganization(org);

        result.setSoftwares(softwareService.getAll());
        return securityClient.saveInstance(result);
    }

    public Instance createInstanceWithRole(String name, Date expiration, String organizationOi) {
        Instance i = this.createInstance(name, expiration, organizationOi);
        securityRoleService.createRole(i, "Papel padrão da " + name);
        return this.getInstance(i.getId());
    }

    public Instance getInstance(Long instanceId) {
        return securityClient.getInstance(instanceId);
    }

    public List<Instance> search(QueryObject param) {

        if (param.getSearchFields() == null){
            param.setSearchFields("name");
        }
        return securityClient.searchInstance(param);
    }
}
