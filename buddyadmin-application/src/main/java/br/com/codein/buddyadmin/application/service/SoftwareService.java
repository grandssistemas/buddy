package br.com.codein.buddyadmin.application.service;

import br.com.codein.buddyadmin.integration.client.SecurityClient;
import br.com.gumga.security.domain.model.softwarehouse.Software;
import io.gumga.core.QueryObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class SoftwareService {

    @Autowired
    private SecurityClient securityClient;

    public Software getSoftwareByName(String name){
        QueryObject q = new QueryObject();
        q.setSearchFields("name");
        q.setQ(name);
        q.setAq("SIMPLE");
        q.setSortField("id");


       return securityClient.searchSoftware(q);
    }
}
