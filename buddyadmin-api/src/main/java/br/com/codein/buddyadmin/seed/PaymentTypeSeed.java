package br.com.codein.buddyadmin.seed;

import br.com.mobiage.mobiage.application.service.buddyseed.BuddySeedControlService;
import br.com.mobiage.mobiage.application.service.characteristic.CharacteristicService;
import br.com.mobiage.mobiage.application.service.paymenttype.PaymentFormService;
import br.com.mobiage.mobiage.domain.model.characteristic.Characteristic;
import br.com.mobiage.mobiage.domain.model.characteristic.OptionValueCharacteristic;
import br.com.mobiage.mobiage.domain.model.characteristic.enums.CharacteristicOrigin;
import br.com.mobiage.mobiage.domain.model.characteristic.enums.ValueTypeCharacteristic;
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

import java.io.BufferedReader;
import java.io.File;
import java.io.FileReader;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

/**
 * Created by gelatti on 17/02/17.
 */
@Component
public class PaymentTypeSeed implements AppSeed {

    @Autowired
    private PaymentFormService service;

    @Autowired
    private BuddySeedControlService buddySeedControlService;



    @Override
    @Transactional
    public void loadSeed() throws IOException {
        if(service.findAll().getValues().isEmpty()){
            create();
        }
    }

    public void create() {
        /**
         * Real
         * */
        PaymentForm paymentForm = new PaymentForm();
        paymentForm.setName("Espécie");
        paymentForm.setPaymentCategories(new ArrayList<>());
        paymentForm.setClassification(PaymentFormENUM.ESPECIE);

        PaymentCategory paymentCategory = new PaymentCategory();
        paymentCategory.setName("Dinheiro");
        paymentCategory.setPaymentCategories(new ArrayList<>());
        paymentCategory.setPaymentForm(paymentForm);
        paymentCategory.setPaymentTypes(new ArrayList<>());
        paymentForm.getPaymentCategories().add(paymentCategory);

        PaymentType paymentType = new PaymentType();
        paymentType.setName("Dinheiro");
        paymentType.setIcon("fa fa-money");
        paymentType.setPaymentCategory(paymentCategory);
        paymentType.setPaymentMethod(PaymentMethodsENUM.DINHEIRO);
        paymentType.setAccountType(AccountType.CAIXA_FISICO);
        paymentCategory.getPaymentTypes().add(paymentType);
        this.service.save(paymentForm);
        paymentForm = buddySeedControlService.saveSeedIntegrationFromBuddy(paymentForm, service);

        paymentForm.getPaymentCategories().stream().forEach(category -> {
            buddySeedControlService.saveSeedIntegrationFromBuddy(category, category.getId());
            category.getPaymentTypes().stream().forEach(productType -> {
                buddySeedControlService.saveSeedIntegrationFromBuddy(productType, productType.getId());
            });
        });

        /**
         * Cheque, Cartão de Credito, Cartão de Débito, Vale Refeição, Vale Alimentação, Vale Combustivel, Vale Presente
         * */
        paymentForm = new PaymentForm();
        paymentForm.setName("Bancário");
        paymentForm.setPaymentCategories(new ArrayList<>());
        paymentForm.setClassification(PaymentFormENUM.BANCARIO);


        PaymentCategory paymentCategoryCartao = new PaymentCategory();
        paymentCategoryCartao.setName("Cartão");
        paymentCategoryCartao.setPaymentCategories(new ArrayList<>());
        paymentCategoryCartao.setPaymentForm(paymentForm);
        paymentCategoryCartao.setPaymentTypes(new ArrayList<>());
        paymentForm.getPaymentCategories().add(paymentCategoryCartao);
        PaymentType paymentTypeCC = new PaymentType();
        paymentTypeCC.setName("Crédito");
        paymentTypeCC.setIcon("fa fa-credit-card-alt");
        paymentTypeCC.setPaymentCategory(paymentCategoryCartao);
        paymentTypeCC.setPaymentMethod(PaymentMethodsENUM.CARTAO_CREDITO);
        paymentTypeCC.setAccountType(AccountType.CONTA_CARTAO_CREDITO);
        paymentCategoryCartao.getPaymentTypes().add(paymentTypeCC);
        PaymentType paymentTypeCD = new PaymentType();
        paymentTypeCD.setName("Débito");
        paymentTypeCD.setIcon("fa fa-credit-card");
        paymentTypeCD.setPaymentCategory(paymentCategoryCartao);
        paymentTypeCD.setPaymentMethod(PaymentMethodsENUM.CARTAO_DEBITO);
        paymentTypeCD.setAccountType(AccountType.CONTA_CARTAO_CREDITO);
        paymentCategoryCartao.getPaymentTypes().add(paymentTypeCD);

        paymentCategory = new PaymentCategory();
        paymentCategory.setName("Cheque");
        paymentCategory.setPaymentCategories(new ArrayList<>());
        paymentCategory.setPaymentForm(paymentForm);
        paymentCategory.setPaymentTypes(new ArrayList<>());
        paymentForm.getPaymentCategories().add(paymentCategory);
        PaymentType paymentTypeCheque = new PaymentType();
        paymentTypeCheque.setName("Cheque");
        paymentTypeCheque.setIcon("fa fa-newspaper-o");
        paymentTypeCheque.setPaymentCategory(paymentCategory);
        paymentTypeCheque.setPaymentMethod(PaymentMethodsENUM.CHEQUE);
        paymentTypeCheque.setAccountType(AccountType.CARTEIRA_CHEQUE);
        paymentCategory.getPaymentTypes().add(paymentTypeCheque);

        PaymentCategory paymentCategoryDep = new PaymentCategory();
        paymentCategoryDep.setName("Deposito/Transferência");
        paymentCategoryDep.setPaymentCategories(new ArrayList<>());
        paymentCategoryDep.setPaymentForm(paymentForm);
        paymentCategoryDep.setPaymentTypes(new ArrayList<>());
        paymentForm.getPaymentCategories().add(paymentCategoryDep);
        PaymentType paymentTypeDep = new PaymentType();
        paymentTypeDep.setName("Deposito/Transferência");
        paymentTypeDep.setIcon("fa fa-fa-exchange");
        paymentTypeDep.setPaymentCategory(paymentCategoryDep);
        paymentTypeDep.setPaymentMethod(PaymentMethodsENUM.OUTROS);
        paymentTypeDep.setAccountType(AccountType.CONTA_CORRENTE);
        paymentCategoryDep.getPaymentTypes().add(paymentTypeDep);
        this.service.save(paymentForm);
        paymentForm = buddySeedControlService.saveSeedIntegrationFromBuddy(paymentForm, service);
        paymentForm.getPaymentCategories().stream().forEach(category -> {
            buddySeedControlService.saveSeedIntegrationFromBuddy(category, category.getId());
            category.getPaymentTypes().stream().forEach(productType -> {
                buddySeedControlService.saveSeedIntegrationFromBuddy(productType, productType.getId());
            });
        });


        /**
         * Promissoria, Cartão da Loja, Outros
         * */

        paymentForm = new PaymentForm();
        paymentForm.setName("Outros");
        paymentForm.setPaymentCategories(new ArrayList<>());
        paymentForm.setClassification(PaymentFormENUM.OUTROS);

        PaymentCategory paymentCategoryVales = new PaymentCategory();
        paymentCategoryVales.setName("Vales");
        paymentCategoryVales.setPaymentCategories(new ArrayList<>());
        paymentCategoryVales.setPaymentForm(paymentForm);
        paymentCategoryVales.setPaymentTypes(new ArrayList<>());
        paymentForm.getPaymentCategories().add(paymentCategoryVales);

        PaymentType paymentTypeVA = new PaymentType();
        paymentTypeVA.setName("Vale Alimentação");
        paymentTypeVA.setIcon("fa fa-shopping-cart");
        paymentTypeVA.setPaymentMethod(PaymentMethodsENUM.VALE_ALIMENTACAO);
        paymentTypeVA.setPaymentCategory(paymentCategoryVales);
        paymentTypeVA.setAccountType(AccountType.CONTA_CARTAO_CREDITO);
        paymentCategoryVales.getPaymentTypes().add(paymentTypeVA);

        PaymentType paymentTypeVR = new PaymentType();
        paymentTypeVR.setName("Vale Refeição");
        paymentTypeVR.setIcon("fa fa-cutlery");
        paymentTypeVR.setPaymentCategory(paymentCategoryVales);
        paymentTypeVR.setPaymentMethod(PaymentMethodsENUM.VALE_REFEICAO);
        paymentTypeVR.setAccountType(AccountType.CONTA_CARTAO_CREDITO);
        paymentCategoryVales.getPaymentTypes().add(paymentTypeVR);


        PaymentType paymentTypeVC = new PaymentType();
        paymentTypeVC.setName("Vale Combustível");
        paymentTypeVC.setIcon("fa fa-tint");
        paymentTypeVC.setPaymentCategory(paymentCategoryVales);
        paymentTypeVC.setPaymentMethod(PaymentMethodsENUM.VALE_COMBUSTIVEL);
        paymentTypeVC.setAccountType(AccountType.CONTA_CARTAO_CREDITO);
        paymentCategoryVales.getPaymentTypes().add(paymentTypeVC);

        PaymentType paymentTypeVP = new PaymentType();
        paymentTypeVP.setName("Vale Presente");
        paymentTypeVP.setIcon("fa fa-gift");
        paymentTypeVP.setPaymentCategory(paymentCategoryVales);
        paymentTypeVP.setPaymentMethod(PaymentMethodsENUM.VALE_PRESENTE);
        paymentTypeVP.setAccountType(AccountType.CONTA_CARTAO_CREDITO);
        paymentCategoryVales.getPaymentTypes().add(paymentTypeVP);

        PaymentCategory paymentCategoryCrediario = new PaymentCategory();
        paymentCategoryCrediario.setName("Crediário");
        paymentCategoryCrediario.setPaymentCategories(new ArrayList<>());
        paymentCategoryCrediario.setPaymentForm(paymentForm);
        paymentCategoryCrediario.setPaymentTypes(new ArrayList<>());
        paymentForm.getPaymentCategories().add(paymentCategoryCrediario);

        PaymentType paymentTypeCL = new PaymentType();
        paymentTypeCL.setName("Crediário Loja");
        paymentTypeCL.setIcon("fa fa-shopping-bag");
        paymentTypeCL.setAccountType(AccountType.CREDITO_PESSOAL);
        paymentTypeCL.setPaymentMethod(PaymentMethodsENUM.CREDITO_LOJA);
        paymentTypeCL.setPaymentCategory(paymentCategoryCrediario);
        paymentCategoryCrediario.getPaymentTypes().add(paymentTypeCL);

        PaymentType paymentTypePromissoria = new PaymentType();
        paymentTypePromissoria.setName("Crédito na loja");
        paymentTypePromissoria.setIcon("fa fa-sticky-note-o");
        paymentTypePromissoria.setPaymentMethod(PaymentMethodsENUM.CREDITO_LOJA);
        paymentTypePromissoria.setAccountType(AccountType.CREDITO_PESSOAL);
        paymentTypePromissoria.setPaymentCategory(paymentCategoryCrediario);
        paymentCategoryCrediario.getPaymentTypes().add(paymentTypePromissoria);

        PaymentType paymentTypeTroca = new PaymentType();
        paymentTypeTroca.setName("Crédito de troca");
        paymentTypeTroca.setPaymentMethod(PaymentMethodsENUM.CREDITO_TROCA);
        paymentTypeTroca.setIcon("fa fa-sticky-note-o");
        paymentTypeTroca.setAccountType(AccountType.CAIXA_FISICO);
        paymentTypeTroca.setPaymentCategory(paymentCategory);
        paymentCategoryCrediario.getPaymentTypes().add(paymentTypeTroca);
        this.service.save(paymentForm);

        paymentForm = buddySeedControlService.saveSeedIntegrationFromBuddy(paymentForm, service);
        paymentForm.getPaymentCategories().stream().forEach(category -> {
            buddySeedControlService.saveSeedIntegrationFromBuddy(category, category.getId());
            category.getPaymentTypes().stream().forEach(productType -> {
                buddySeedControlService.saveSeedIntegrationFromBuddy(productType, productType.getId());
            });
        });
    }

}

