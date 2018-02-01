package br.com.codein.buddyadmin.seed;

import br.com.mobiage.mobiage.application.service.buddyseed.BuddySeedControlService;
import br.com.mobiage.mobiage.application.service.fiscalgroup.PersonGroupService;
import br.com.mobiage.mobiage.application.service.person.IndividualService;
import br.com.mobiage.mobiage.application.service.person.JuridicaService;
import br.com.mobiage.mobiage.application.service.person.RoleService;
import br.com.mobiage.mobiage.domain.model.fiscal.PersonGroup;
import br.com.mobiage.mobiage.domain.model.fiscal.enums.IndicatorTypes;
import br.com.mobiage.mobiage.domain.model.person.*;
import br.com.mobiage.mobiage.domain.model.person.enums.RoleCategory;
import io.gumga.core.GumgaThreadScope;
import io.gumga.domain.domains.GumgaCNPJ;
import io.gumga.domain.domains.GumgaCPF;
import io.gumga.domain.seed.AppSeed;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.io.IOException;
import java.util.*;

/**
 * Created by gelatti on 17/02/17.
 */
@Component
public class IndividualSeed implements AppSeed {

    @Autowired
    private IndividualService service;
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
//        Juridica company = companyService.getByOrganizationCode(GumgaThreadScope.organizationCode.get());
        Individual individual = new Individual();
        long cpf = 10000000000L + (int) (Math.random() * 1000000000);
        individual.setCpf(new GumgaCPF("" + cpf));

        individual.setDocRg("" + cpf);
        individual.setName("Empregado Padrão");
        individual.setNickname("Empregado");
        individual.setActive(Boolean.TRUE);
        individual.setSecurityLogin(GumgaThreadScope.login.get());

        Role r = roleService.recoverByCategory(RoleCategory.EMPLOYEE).get(0);
        individual.setRoles(new HashSet<>(Collections.singleton(new AssociativeRole(r))));

        individual.setEmails(new ArrayList<>(Collections.singletonList(new Email(""))));
        individual.setPhones(new ArrayList<>(Collections.singletonList(new Phone(""))));
//        individual.setAddressList(new ArrayList<>(Collections.singletonList(new Address(company.getPrimaryAddress().getAddress(), true))));

        List<PersonGroup> groups = personGroupService.getAllActives().getValues();
        individual.setGroup(groups.get(0));
        individual.setIntegrationId(2L);
        buddySeedControlService.saveSeedIntegrationFromBuddy(individual, service);

//        List<PersonGroup> groups = personGroupService.getAllActives().getValues();
//        Juridica company = companyService.getByOrganizationCode(GumgaThreadScope.organizationCode.get());
        Individual finalconsumer = new Individual();
        finalconsumer.setFinalConsumer(Boolean.TRUE);
        finalconsumer.setCpf(new GumgaCPF("00000000000"));
        finalconsumer.setDocRg("000000000");
        finalconsumer.setName("Consumidor final");
        finalconsumer.setNickname("Cliente");
        finalconsumer.setActive(Boolean.TRUE);
        List<Email> emails = new ArrayList<>();
        emails.add(new Email(""));
        finalconsumer.setEmails(emails);
        List<Phone> phones = new ArrayList<>();
        phones.add(new Phone(""));
        finalconsumer.setPhones(phones);
        Set<AssociativeRole> roles = new HashSet<>();
        List<Role> clientes = roleService.recoverByCategory(RoleCategory.CLIENT);
        if (clientes.isEmpty()) {
            clientes.add(roleService.saveClient());
        }
        roles.add(new AssociativeRole(clientes.get(0)));
        finalconsumer.setRoles(roles);
        List<Address> addresses = new ArrayList<>();
//        Address address = new Address(company.getPrimaryAddress().getAddress(), true);
//        addresses.add(address);
//        finalconsumer.setAddressList(addresses);
        if (groups.isEmpty()) {
            groups.add(personGroupService.createStandartGroup());
        }
        finalconsumer.setGroup(groups.get(0));
        finalconsumer.setIntegrationId(3L);
        buddySeedControlService.saveSeedIntegrationFromBuddy(finalconsumer, service);
    }


}

