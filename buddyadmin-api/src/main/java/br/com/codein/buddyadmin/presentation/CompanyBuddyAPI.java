package br.com.codein.buddyadmin.presentation;


import br.com.codein.buddyadmin.application.service.CompanyBuddyService;
import br.com.mobiage.mobiage.domain.model.person.Person;
import br.com.gumga.security.domain.model.institutional.Organization;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/companybuddy")
public class CompanyBuddyAPI {

    @Autowired
    private CompanyBuddyService companyBuddyService;

    @RequestMapping(value="/addorganization", method = RequestMethod.POST)
    public Organization addOrganization(@RequestBody Person p){
        return companyBuddyService.newOrganization(p);
    }

    @Transactional
    @RequestMapping(value="/verifyexistsh", method = RequestMethod.POST)
    public void verifyExistSh(){
        companyBuddyService.verifyExistSH();
    }




}
