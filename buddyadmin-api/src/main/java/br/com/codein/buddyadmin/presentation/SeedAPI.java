package br.com.codein.buddyadmin.presentation;

import br.com.codein.buddyadmin.application.service.SeedBuddyService;
import br.com.mobiage.mobiage.application.service.seed.SeedService;
import br.com.mobiage.mobiage.domain.model.paymenttype.PaymentForm;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import javax.transaction.Transactional;
import java.util.List;

@RestController
@RequestMapping("/api/seed")
public class SeedAPI {

    @Autowired
    private SeedBuddyService service;

    @RequestMapping(value = "/paymenttype",method = RequestMethod.POST)
    public List<PaymentForm> seedPaymentType(@RequestBody List<PaymentForm> entities){
        return service.savePaymentForm(entities);
    }
}
