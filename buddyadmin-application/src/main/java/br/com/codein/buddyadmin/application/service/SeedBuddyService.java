package br.com.codein.buddyadmin.application.service;


import br.com.codein.buddyadmin.infrastructure.config.ApplicationConstants;
import br.com.codein.buddyadmin.integration.client.SecurityBuddyClient;
import br.com.codein.buddyadmin.integration.client.fashionmanager.DepartmentClient;
import br.com.codein.buddyadmin.integration.client.fashionmanager.JuridicaClient;
import br.com.gumga.security.domain.model.institutional.Organization;
import br.com.mobiage.mobiage.application.service.department.DepartmentService;
import br.com.mobiage.mobiage.application.service.paymenttype.PaymentFormService;
import br.com.mobiage.mobiage.application.service.person.PersonService;
import br.com.mobiage.mobiage.application.service.person.RoleService;
import br.com.mobiage.mobiage.domain.model.department.Department;
import br.com.mobiage.mobiage.domain.model.paymenttype.PaymentForm;
import br.com.mobiage.mobiage.domain.model.person.Person;
import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;
import io.gumga.core.GumgaValues;
import io.gumga.domain.GumgaTenancyUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.IOException;
import java.util.ArrayList;
import java.util.LinkedList;
import java.util.List;
import java.util.Properties;
import java.util.stream.Collector;
import java.util.stream.Collectors;


@Service
public class SeedBuddyService {
    @Autowired
    private PaymentFormService paymentFormService;


    @Transactional
    public List<PaymentForm> savePaymentForm(List<PaymentForm> entities) {
        return entities.stream().map(paymentForm -> paymentFormService.save(paymentForm)).collect(Collectors.toList());
    }
}
