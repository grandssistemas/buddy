package br.com.codein.buddyadmin.seed;

import br.com.mobiage.mobiage.application.service.buddyseed.BuddySeedControlService;
import br.com.mobiage.mobiage.application.service.fiscalgroup.PersonGroupService;
import br.com.mobiage.mobiage.application.service.paymenttype.PaymentFormService;
import br.com.mobiage.mobiage.domain.model.fiscal.PersonGroup;
import br.com.mobiage.mobiage.domain.model.paymenttype.PaymentCategory;
import br.com.mobiage.mobiage.domain.model.paymenttype.PaymentForm;
import br.com.mobiage.mobiage.domain.model.paymenttype.PaymentType;
import br.com.mobiage.mobiage.domain.model.paymenttype.enums.AccountType;
import br.com.mobiage.mobiage.domain.model.paymenttype.enums.PaymentFormENUM;
import br.com.mobiage.mobiage.domain.model.paymenttype.enums.PaymentMethodsENUM;
import io.gumga.domain.seed.AppSeed;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

/**
 * Created by gelatti on 17/02/17.
 */
@Component
public class PersonGroupSeed implements AppSeed {

    @Autowired
    private PersonGroupService service;

    @Autowired
    private BuddySeedControlService buddySeedControlService;



    @Override
    @Transactional
    public void loadSeed() throws IOException {
        if(service.findAll().isEmpty()){
            PersonGroup personGroup = new PersonGroup("Grupo de pessoa fiscal", "Grupo de pessoa fiscal padrão");
            buddySeedControlService.saveSeedIntegrationFromBuddy(personGroup, service);
        }
    }

}

