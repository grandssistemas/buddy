package br.com.codein.buddyadmin.presentation;

import br.com.codein.buddyadmin.application.service.CompanyService;
import br.com.gumga.security.domain.model.institutional.Organization;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/public/company")
public class PublicAPI {

    @Autowired
    private CompanyService companyService;

    @RequestMapping(value="/changeOrganization/{id}", method = RequestMethod.GET)
    public Organization changeOrganization(@PathVariable Long id){
        return companyService.changeOrganization(id);
    }
}
