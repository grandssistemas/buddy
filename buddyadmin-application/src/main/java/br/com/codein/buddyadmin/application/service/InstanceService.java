package br.com.codein.buddyadmin.application.service;

import br.com.codein.buddyadmin.application.utils.StringUtils;
import br.com.codein.buddyadmin.domain.model.Softwares;
import br.com.codein.buddyadmin.integration.client.SecurityClient;
import br.com.gumga.security.domain.model.instance.Instance;
import br.com.gumga.security.domain.model.institutional.Organization;
import br.com.gumga.security.domain.model.softwarehouse.Software;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.HashSet;
import java.util.Set;

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

    public Instance createInstance(String name, Date expiration, String organizationOi) {

        Instance result = new Instance();

        result.setName(name);
        result.setExpiration(expiration);
        String id = stringUtils.extractOrgIdFromOi(organizationOi);
        Organization org = companyService.getOrganization(Long.valueOf(id));
        result.setOrganization(org);

        Set<Software> softwareSet = new HashSet<>();
        softwareSet.add(softwareService.getSoftwareByName(Softwares.BUDDY_ADMIN.getSoftwareName()));
        softwareSet.add(softwareService.getSoftwareByName(Softwares.SECURITY.getSoftwareName()));
        softwareSet.add(softwareService.getSoftwareByName(Softwares.FASHION_MANAGER.getSoftwareName()));

        result.setSoftwares(softwareSet);
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
}
