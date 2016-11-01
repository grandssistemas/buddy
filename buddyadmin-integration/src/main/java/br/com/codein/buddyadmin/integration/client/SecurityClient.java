package br.com.codein.buddyadmin.integration.client;

import br.com.codein.buddyadmin.infrastructure.config.ApplicationConstants;
import br.com.gumga.security.domain.model.institutional.Organization;
import br.com.gumga.security.domain.model.institutional.User;
import com.fasterxml.jackson.databind.JavaType;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.type.CollectionType;
import gumga.framework.core.GumgaThreadScope;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Properties;

@Component
public class SecurityClient extends AbstractClient<Object> {

    private ObjectMapper mapper = new ObjectMapper();

    @Autowired
    private ApplicationConstants gumgaValues;

    private Properties properties;

    public SecurityClient() {
        super();
        this.url = getProperties().getProperty("security.url") +
                "/security-api";
    }

    private <T> T translate(Object obj, Class<T> clazz){
        T result = null;
        try {
            byte[] x = mapper.writeValueAsBytes(obj);
            result =  mapper.readValue(x,clazz);
        } catch (IOException e) {
            e.printStackTrace();
        }
        return result;
    }
    private <T> T translate(Object obj, JavaType type){
        T result = null;

        try {
            byte[] x = mapper.writeValueAsBytes(obj);
            result =  mapper.readValue(x,type);
        } catch (IOException e) {
            e.printStackTrace();
        }
        return result;
    }


    private Properties getProperties() {
        if(gumgaValues == null)
            gumgaValues = new ApplicationConstants();

        if(properties == null)
            properties = gumgaValues.getCustomFileProperties();

        return properties;
    }

    public Organization newOrganization(Organization org){
        ResponseEntity<Object> response = this.post("/api/organization",org);
        return translate(((LinkedHashMap)response.getBody()).get("data"),Organization.class);

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
        ResponseEntity<Object> response;
        if (org.getId() == null){
             response = this.post("/api/organization/",org);
        } else {
            response = this.put("/api/organization/".concat(org.getId().toString()),org);
        }
        return translate(((LinkedHashMap)response.getBody()).get("data"),Organization.class);
    }

    public List<Organization> getByInternalCode(String internalCode) {
        ResponseEntity<Object> response= this.get("/api/organization/byinternalcode/".concat(internalCode),new HashMap<>());
        CollectionType type = mapper.getTypeFactory().constructCollectionType(List.class,Organization.class);
        return translate(((LinkedHashMap) response.getBody()).get("data"), type);
    }
}

