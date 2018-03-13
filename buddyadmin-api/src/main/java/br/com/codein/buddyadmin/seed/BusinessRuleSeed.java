package br.com.codein.buddyadmin.seed;

import br.com.mobiage.mobiage.application.service.buddyseed.BuddySeedControlService;
import br.com.mobiage.mobiage.application.service.businessrule.BusinessRuleService;
import br.com.mobiage.mobiage.application.service.operation.OperationTypeService;
import br.com.mobiage.mobiage.application.service.paymenttype.PaymentTypeService;
import br.com.mobiage.mobiage.application.service.product.ProductGroupService;
import br.com.mobiage.mobiage.domain.model.businessrule.BusinessRule;
import br.com.mobiage.mobiage.domain.model.businessrule.enums.ValueType;
import br.com.mobiage.mobiage.domain.model.operation.OperationType;
import br.com.mobiage.mobiage.domain.model.operation.enums.OperationCategory;
import br.com.mobiage.mobiage.domain.model.paymenttype.PaymentType;
import br.com.mobiage.mobiage.domain.model.paymenttype.enums.PaymentMethodsENUM;
import br.com.mobiage.mobiage.domain.model.product.ProductGroup;
import io.gumga.domain.seed.AppSeed;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.io.IOException;
import java.math.BigDecimal;
import java.util.Collections;
import java.util.Date;
import java.util.List;

/**
 * Created by gelatti on 17/02/17.
 */
@Component
public class BusinessRuleSeed implements AppSeed {

    @Autowired
    private BusinessRuleService service;
    @Autowired
    private PaymentTypeService paymentTypeService;
    @Autowired
    private OperationTypeService operationTypeService;
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
//        operationService.seed();
//        paymentFormService.seed();
        BusinessRule businessRule = new BusinessRule();

        List<PaymentType> paymentTypes = paymentTypeService.findByPaymentENUM(PaymentMethodsENUM.DINHEIRO);

        businessRule.setMaxDiscount(BigDecimal.valueOf(100));
        businessRule.setDiscountType(ValueType.PERCENTAGE);
        businessRule.setHasEntry(Boolean.TRUE);
        businessRule.setStartDuration(new Date());
        businessRule.setActive(Boolean.TRUE);
        businessRule.setNegotiationInterval(0);
        businessRule.setEntryValue(BigDecimal.ONE);
        businessRule.setEntryType(ValueType.PERCENTAGE);
        businessRule.setMinValue(BigDecimal.ZERO);
        businessRule.setEntryPaymentTypes(paymentTypes);
        businessRule.setParcelsCount(0);

        if (!service.containsConflict(businessRule)){
            List<OperationType> operationTypes = operationTypeService.recoveryAllByCategory(OperationCategory.SIMPLE_SALE);
            operationTypes.addAll(operationTypeService.recoveryAllByCategory(OperationCategory.CONSIGNMENT_SALE));

            businessRule = buddySeedControlService.saveSeedIntegrationFromBuddy(businessRule, service);
            service.createManyWithOperation(Collections.singletonList(businessRule), operationTypes);
        }
    }


}

