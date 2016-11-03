package br.com.codein.buddyadmin.integration.client;

import br.com.codein.buddyadmin.infrastructure.config.ApplicationConstants;
import br.com.gumga.security.domain.model.institutional.Organization;
import br.com.gumga.security.domain.model.institutional.User;
import com.fasterxml.jackson.databind.type.CollectionType;
import gumga.framework.core.GumgaThreadScope;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;

import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Properties;

@Component
public class SecurityClient extends AbstractClient<Object> {



    @Autowired
    private ApplicationConstants gumgaValues;

    private Properties properties;

    public SecurityClient() {
        super();
        this.url = getProperties().getProperty("security.url") +
                "/security-api";
    }


    private Properties getProperties() {
        if(gumgaValues == null)
            gumgaValues = new ApplicationConstants();

        if(properties == null)
            properties = gumgaValues.getCustomFileProperties();

        return properties;
    }

    public Organization changeOrganization(Long id) {
        ResponseEntity<Object> response =
                this.get("/publicoperations/token/changeorganization/"
                        .concat(GumgaThreadScope.gumgaToken.get())
                        .concat("/")
                        .concat(id.toString()),
                        new HashMap());
        return translate(response.getBody(),Organization.class);
    }

    public User getUserByEmail(String email){
        ResponseEntity<Object> response =
                this.get("/api/gumga-security/user-by-email/".concat(email).concat("/"),new HashMap<>());
        return translate(response.getBody(),User.class);
    }


public Organization getOrganization(Long id) {
        ResponseEntity<Object> response =
                this.get("/api/organization/".concat(id.toString()),new HashMap<>());
    return translate(response.getBody(),Organization.class);
    }

    public Organization saveOrganization(Organization org) {
        ResponseEntity<Object> response = null;
        try {
            if (org.getId() == null){
                response = this.post("/api/organization/",org);
            } else {
                response = this.put("/api/organization/".concat(org.getId().toString()),org);
            }
        } catch (Exception e){
            e.printStackTrace();
        }

        return translate(((LinkedHashMap)response.getBody()).get("data"),Organization.class);
    }

    public List<Organization> getByInternalCode(String internalCode) {
        ResponseEntity<Object> response= this.get("/api/organization/byinternalcode/".concat(internalCode),new HashMap<>());
        CollectionType type =createListType(Organization.class);
        return translate(((LinkedHashMap) response.getBody()).get("data"), type);
    }
}

