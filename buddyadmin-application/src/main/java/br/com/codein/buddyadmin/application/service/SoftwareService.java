package br.com.codein.buddyadmin.application.service;

import br.com.codein.buddyadmin.domain.model.Softwares;
import br.com.codein.buddyadmin.integration.client.SecurityClient;
import br.com.gumga.security.domain.model.softwarehouse.Software;
import io.gumga.core.QueryObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.HashSet;
import java.util.Set;

@Component
public class SoftwareService {

    @Autowired
    private SecurityClient securityClient;


    public Set<Software> getAll(){

        Set<Software> softwareSet = new HashSet<>();
        softwareSet.add(this.getSoftwareByName(Softwares.BUDDY_ADMIN.getSoftwareName()));
        softwareSet.add(this.getSoftwareByName(Softwares.SECURITY.getSoftwareName()));
        softwareSet.add(this.getSoftwareByName(Softwares.FASHION_MANAGER.getSoftwareName()));
        softwareSet.add(this.getSoftwareByName(Softwares.RUPTURA.getSoftwareName()));

        return softwareSet;
    }

    public Software getSoftwareByName(String name){
        QueryObject q = new QueryObject();
        q.setSearchFields("name");
        q.setQ(name);
        q.setAq("SIMPLE");
        q.setSortField("id");


       return securityClient.searchSoftware(q);
    }
}
