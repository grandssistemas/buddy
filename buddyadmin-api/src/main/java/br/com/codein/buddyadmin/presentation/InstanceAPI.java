package br.com.codein.buddyadmin.presentation;

import br.com.codein.buddyadmin.application.service.InstanceService;
import br.com.gumga.security.domain.model.instance.Instance;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import gumga.framework.core.QueryObject;
import gumga.framework.core.SearchResult;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;

@RestController
@RequestMapping("/api/instance")
public class InstanceAPI {

    @Autowired
    private InstanceService instanceService;

    @RequestMapping(value = "/create", method = RequestMethod.POST)
    public Instance create(@RequestBody ObjectNode params) throws IOException {

        ObjectMapper mapper = new ObjectMapper();
        DateFormat df = new SimpleDateFormat("dd/MM/yyyy");
        mapper.setDateFormat(df);
        String name = params.get("name").asText();
        Date expiration = mapper.readValue(params.get("expiration").toString(),Date.class);
        String organizationOi = params.get("oi").asText();
        return instanceService.createInstance(name,expiration,organizationOi);
    }

    @RequestMapping(value = "/createwithrole", method = RequestMethod.POST)
    public Instance createWithRole(@RequestBody ObjectNode params) throws IOException {

        ObjectMapper mapper = new ObjectMapper();
        DateFormat df = new SimpleDateFormat("dd/MM/yyyy");
        mapper.setDateFormat(df);
        String name = params.get("name").asText();
        Date expiration = mapper.readValue(params.get("expiration").toString(),Date.class);
        String organizationOi = params.get("oi").asText();
        return instanceService.createInstanceWithRole(name,expiration,organizationOi);
    }

    @RequestMapping(method = RequestMethod.GET)
    public SearchResult<Instance> search(QueryObject param){
        List<Instance> result = instanceService.search(param);
        return new SearchResult<Instance>(param,result.size(),result);
    }
}
