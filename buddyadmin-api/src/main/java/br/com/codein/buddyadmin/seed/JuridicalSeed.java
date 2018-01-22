package br.com.codein.buddyadmin.seed;

import br.com.mobiage.mobiage.application.service.buddyseed.BuddySeedControlService;
import br.com.mobiage.mobiage.application.service.businessrule.BusinessRuleService;
import br.com.mobiage.mobiage.application.service.fiscalgroup.PersonGroupService;
import br.com.mobiage.mobiage.application.service.operation.OperationTypeService;
import br.com.mobiage.mobiage.application.service.paymenttype.PaymentTypeService;
import br.com.mobiage.mobiage.application.service.person.JuridicaService;
import br.com.mobiage.mobiage.application.service.person.RoleService;
import br.com.mobiage.mobiage.domain.model.businessrule.BusinessRule;
import br.com.mobiage.mobiage.domain.model.businessrule.enums.ValueType;
import br.com.mobiage.mobiage.domain.model.fiscal.PersonGroup;
import br.com.mobiage.mobiage.domain.model.fiscal.enums.IndicatorTypes;
import br.com.mobiage.mobiage.domain.model.operation.OperationType;
import br.com.mobiage.mobiage.domain.model.operation.enums.OperationCategory;
import br.com.mobiage.mobiage.domain.model.paymenttype.PaymentType;
import br.com.mobiage.mobiage.domain.model.paymenttype.enums.PaymentMethodsENUM;
import br.com.mobiage.mobiage.domain.model.person.*;
import br.com.mobiage.mobiage.domain.model.person.enums.RoleCategory;
import io.gumga.domain.domains.GumgaCNPJ;
import io.gumga.domain.seed.AppSeed;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.io.IOException;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Date;
import java.util.List;

/**
 * Created by gelatti on 17/02/17.
 */
@Component
public class JuridicalSeed implements AppSeed {

    @Autowired
    private JuridicaService service;
    @Autowired
    private RoleService roleService;
    @Autowired
    private PersonGroupService personGroupService;

    @Autowired
    private BuddySeedControlService buddySeedControlService;



    @Override
    @Transactional
    public void loadSeed() throws IOException {
        if(service.findAll().isEmpty()){
            create();
        }
    }

    private void create() {
        Juridica j = new Juridica();
        j.setCnpj(new GumgaCNPJ("00000000000000"));
        j.setStateRegistration("ISENTO");
        j.setIndicators(IndicatorTypes.ISENTO);
        j.setName("Fornecedor Padrão");
        j.setNickname("Fornecedor");
        j.setActive(Boolean.TRUE);

        Role r = roleService.recoverByCategory(RoleCategory.PROVIDER).get(0);
        j.setRoles(Collections.singleton(new AssociativeRole(r)));
        j.setEmails(Collections.singletonList(new Email("")));
        List<Phone> phones = new ArrayList<>();
        phones.add(new Phone(""));
        j.setPhones(phones);
//        List<Address> addresses = new ArrayList<>();
//        addresses.add(new Address(company.getPrimaryAddress().getAddress(), true));
//        j.setAddressList(addresses);
        List<PersonGroup> groups = personGroupService.getAllActives().getValues();
        j.setGroup(groups.get(0));
        j.setIntegrationId(1L);

        buddySeedControlService.saveSeedIntegrationFromBuddy(j, service);
    }


}

