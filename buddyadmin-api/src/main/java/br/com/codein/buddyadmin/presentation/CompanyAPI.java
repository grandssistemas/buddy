package br.com.codein.buddyadmin.presentation;


import br.com.codein.buddyadmin.application.service.CompanyService;
import br.com.codein.buddyperson.domain.person.Person;
import br.com.gumga.security.domain.model.institutional.Organization;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/company")
public class CompanyAPI {

    @Autowired
    private CompanyService companyService;

    @Transactional(readOnly = true)
    @RequestMapping(value="/addorganization", method = RequestMethod.POST)
    public Organization addOrganization(@RequestBody Person p){
        return companyService.newOrganization(p);
    }




}
