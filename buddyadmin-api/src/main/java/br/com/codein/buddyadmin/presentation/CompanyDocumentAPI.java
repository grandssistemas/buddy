package br.com.codein.buddyadmin.presentation;

import br.com.codein.buddyadmin.application.service.CompanyDocumentBuddyService;
import br.com.codein.buddyadmin.domain.model.CompanyDocumentBuddy;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;
import java.util.Map;

/**
 * Created by gelatti on 30/01/17.
 */
@RestController
@RequestMapping("/api/cnpj")
public class CompanyDocumentAPI {

    @Autowired
    private CompanyDocumentBuddyService companyDocumentBuddyService;

    @RequestMapping(value = "/generate-captcha", method = RequestMethod.GET)
    public Map generateCaptcha() throws IOException {
        return companyDocumentBuddyService.generateCaptcha();
    }

    @RequestMapping(method = RequestMethod.GET, value = "/buscacnpj")
    public CompanyDocumentBuddy handlingCPNJ(@RequestParam("cnpj") String cnpj, @RequestParam("captcha") String captcha, @RequestParam("cookie") String cookie)
            throws IOException {
        return companyDocumentBuddyService.handlingCNPJ(cnpj, captcha, cookie);
    }
}
