package br.com.codein.buddyadmin.seed;

import br.com.mobiage.mobiage.application.service.buddyseed.BuddySeedControlService;
import br.com.mobiage.mobiage.application.service.operation.OperationService;
import br.com.mobiage.mobiage.application.service.paymenttype.PaymentFormService;
import br.com.mobiage.mobiage.domain.model.operation.Operation;
import br.com.mobiage.mobiage.domain.model.operation.OperationType;
import br.com.mobiage.mobiage.domain.model.operation.enums.DocumentFinality;
import br.com.mobiage.mobiage.domain.model.operation.enums.OperationCategory;
import br.com.mobiage.mobiage.domain.model.operation.enums.OperationENUMType;
import br.com.mobiage.mobiage.domain.model.paymenttype.PaymentCategory;
import br.com.mobiage.mobiage.domain.model.paymenttype.PaymentForm;
import br.com.mobiage.mobiage.domain.model.paymenttype.PaymentType;
import br.com.mobiage.mobiage.domain.model.paymenttype.enums.AccountType;
import br.com.mobiage.mobiage.domain.model.paymenttype.enums.PaymentFormENUM;
import br.com.mobiage.mobiage.domain.model.paymenttype.enums.PaymentMethodsENUM;
import io.gumga.domain.seed.AppSeed;
import org.hibernate.Hibernate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.io.IOException;
import java.util.ArrayList;
import java.util.HashSet;

/**
 * Created by gelatti on 17/02/17.
 */
@Component
public class OperationTypeSeed implements AppSeed {

    @Autowired
    private OperationService service;

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
        Operation operation = new Operation();
        operation.setName("Entrada");
        operation.setType(OperationENUMType.ENTRY);
        operation.setCharacteristics(new ArrayList<>());
        operation.setTypes(new HashSet<>());

        OperationType operationTypeEPC = new OperationType();
        operationTypeEPC.setName("Estorno entre estoques");
        operationTypeEPC.setInformative(false);
        operationTypeEPC.setInterstate(false);
        operationTypeEPC.setOperation(operation);
        operationTypeEPC.setInvoiceObjective(DocumentFinality.NORMAL);
        operationTypeEPC.setCategory(OperationCategory.REVERSED_BETWEEN_STOCK);
        operation.getTypes().add(operationTypeEPC);

        OperationType operationType5 = new OperationType();
        operationType5.setName("Entrada Simples");
        operationType5.setInformative(false);
        operationType5.setInterstate(false);
        operationType5.setOperation(operation);
        operationType5.setInvoiceObjective(DocumentFinality.NORMAL);
        operationType5.setCategory(OperationCategory.SIMPLE_ENTRY);
        operation.getTypes().add(operationType5);

        OperationType operationType1 = new OperationType();
        operationType1.setName("Devolução por Troca");
        operationType1.setInformative(false);
        operationType1.setInterstate(false);
        operationType1.setOperation(operation);
        operationType1.setInvoiceObjective(DocumentFinality.DEVOLUTION);
        operationType1.setCategory(OperationCategory.EXCHANGE_RETURN);
        operation.getTypes().add(operationType1);

        OperationType operationTypeBE = new OperationType();
        operationTypeBE.setName("Balanço Entrada");
        operationTypeBE.setInvoiceObjective(DocumentFinality.NORMAL);
        operationTypeBE.setInformative(false);
        operationTypeBE.setInterstate(false);
        operationTypeBE.setOperation(operation);
        operationTypeBE.setCategory(OperationCategory.AUDIT_ENTRY);
        operation.getTypes().add(operationTypeBE);

        OperationType operationTypeC1 = new OperationType();
        operationTypeC1.setName("Devolução de Consignado");
        operationTypeC1.setInformative(false);
        operationTypeC1.setInterstate(false);
        operationTypeC1.setOperation(operation);
        operationTypeC1.setInvoiceObjective(DocumentFinality.DEVOLUTION);
        operationTypeC1.setCategory(OperationCategory.CONSIGNMENT_RETURN);
        operation.getTypes().add(operationTypeC1);

        OperationType operationTypeRS = new OperationType();
        operationTypeRS.setName("Estorno de saída");
        operationTypeRS.setInformative(false);
        operationTypeRS.setInterstate(false);
        operationTypeRS.setOperation(operation);
        operationTypeRS.setInvoiceObjective(DocumentFinality.NORMAL);
        operationTypeRS.setCategory(OperationCategory.REVERSED_EXIT);
        operation.getTypes().add(operationTypeRS);

        OperationType operationTypeDXml = new OperationType();
        operationTypeDXml.setName("Devolução de XML");
        operationTypeDXml.setInformative(false);
        operationTypeDXml.setInterstate(false);
        operationTypeDXml.setOperation(operation);
        operationTypeDXml.setInvoiceObjective(DocumentFinality.DEVOLUTION);
        operationTypeDXml.setCategory(OperationCategory.XML_RETURN);
        operation.getTypes().add(operationTypeDXml);
        this.service.save(operation);
        operation = buddySeedControlService.saveSeedIntegrationFromBuddy(operation, service);
        operation.getTypes().stream().forEach(category -> {
            buddySeedControlService.saveSeedIntegrationFromBuddy(category, category.getId());
        });

        Operation operation2 = new Operation();
        operation2.setName("Saída");
        operation2.setType(OperationENUMType.EXIT);

        operation2.setCharacteristics(new ArrayList<>());
        operation2.setTypes(new HashSet<>());

        OperationType operationTypeSED = new OperationType();
        operationTypeSED.setName("Devolução de entrada simples");
        operationTypeSED.setInformative(false);
        operationTypeSED.setInterstate(false);
        operationTypeSED.setOperation(operation);
        operationTypeSED.setInvoiceObjective(DocumentFinality.NORMAL);
        operationTypeSED.setCategory(OperationCategory.SIMPLE_ENTRY_DEVOLUTION);
        operation2.getTypes().add(operationTypeSED);

        OperationType operationTypeA = new OperationType();
        operationTypeA.setName("Transferência para Filial");
        operationTypeA.setInformative(false);
        operationTypeA.setInterstate(false);
        operationTypeA.setOperation(operation2);
        operationTypeA.setInvoiceObjective(DocumentFinality.NORMAL);
        operationTypeA.setCategory(OperationCategory.TRANSFERENCE_OUTPUT);
        operation2.getTypes().add(operationTypeA);

        OperationType operationTypeA2 = new OperationType();
        operationTypeA2.setName("Entrada transferência");
        operationTypeA2.setInformative(false);
        operationTypeA2.setInterstate(false);
        operationTypeA2.setOperation(operation);
        operationTypeA2.setInvoiceObjective(DocumentFinality.NORMAL);
        operationTypeA2.setCategory(OperationCategory.TRANSFERENCE_ENTRY);
        operation2.getTypes().add(operationTypeA2);

        OperationType operationTypeA1 = new OperationType();
        operationTypeA1.setName("Saída transferência");
        operationTypeA1.setInformative(false);
        operationTypeA1.setInterstate(false);
        operationTypeA1.setOperation(operation2);
        operationTypeA1.setInvoiceObjective(DocumentFinality.NORMAL);
        operationTypeA1.setCategory(OperationCategory.TRANSFERENCE_OUTPUT);
        operation2.getTypes().add(operationTypeA1);

        OperationType operationTypeB = new OperationType();
        operationTypeB.setName("Transferência para Matriz");
        operationTypeB.setInformative(false);
        operationTypeB.setInterstate(false);
        operationTypeB.setOperation(operation2);
        operationTypeB.setInvoiceObjective(DocumentFinality.NORMAL);
        operationTypeB.setCategory(OperationCategory.TRANSFERENCE_OUTPUT);
        operation2.getTypes().add(operationTypeB);

        OperationType operationType2 = new OperationType();
        operationType2.setName("Venda Simples");
        operationType2.setInformative(false);
        operationType2.setInterstate(false);
        operationType2.setOperation(operation2);
        operationType2.setInvoiceObjective(DocumentFinality.NORMAL);
        operationType2.setCategory(OperationCategory.SIMPLE_SALE);
        operation2.getTypes().add(operationType2);

        OperationType operationTypeBrinde = new OperationType();
        operationTypeBrinde.setName("Saida por Brinde");
        operationTypeBrinde.setInformative(false);
        operationTypeBrinde.setInterstate(false);
        operationTypeBrinde.setOperation(operation2);
        operationTypeBrinde.setInvoiceObjective(DocumentFinality.NORMAL);
        operationTypeBrinde.setCategory(OperationCategory.SIMPLE_SALE);
        operation2.getTypes().add(operationTypeBrinde);

        OperationType operationTypeVC = new OperationType();
        operationTypeVC.setName("Venda Consignada");
        operationTypeVC.setInformative(false);
        operationTypeVC.setInterstate(false);
        operationTypeVC.setOperation(operation2);
        operationTypeVC.setInvoiceObjective(DocumentFinality.NORMAL);
        operationTypeVC.setCategory(OperationCategory.CONSIGNMENT_SALE);
        operation2.getTypes().add(operationTypeVC);

        OperationType operationTypeVT = new OperationType();
        operationTypeVT.setName("Venda por Troca");
        operationTypeVT.setInformative(false);
        operationTypeVT.setInterstate(false);
        operationTypeVT.setOperation(operation2);
        operationTypeVT.setInvoiceObjective(DocumentFinality.NORMAL);
        operationTypeVT.setCategory(OperationCategory.EXCHANGE_SALE);
        operation2.getTypes().add(operationTypeVT);

        OperationType operationTypeBS = new OperationType();
        operationTypeBS.setName("Balanço Saída");
        operationTypeBS.setInvoiceObjective(DocumentFinality.NORMAL);
        operationTypeBS.setInformative(false);
        operationTypeBS.setInterstate(false);
        operationTypeBS.setOperation(operation2);
        operationTypeBS.setCategory(OperationCategory.AUDIT_OUTPUT);
        operation2.getTypes().add(operationTypeBS);

        OperationType operationTypeRE = new OperationType();
        operationTypeRE.setName("Estorno de entrada");
        operationTypeRE.setInvoiceObjective(DocumentFinality.NORMAL);
        operationTypeRE.setInformative(false);
        operationTypeRE.setInterstate(false);
        operationTypeRE.setOperation(operation2);
        operationTypeRE.setCategory(OperationCategory.REVERSED_ENTRY);
        operation2.getTypes().add(operationTypeRE);
        this.service.save(operation2);
        operation2 = buddySeedControlService.saveSeedIntegrationFromBuddy(operation2, service);
        operation2.getTypes().stream().forEach(category -> {
            buddySeedControlService.saveSeedIntegrationFromBuddy(category, category.getId());
        });

        Operation operation3 = new Operation();
        operation3.setName("Informação");
        operation3.setType(OperationENUMType.INFORMATION);
        operation3.setCharacteristics(new ArrayList<>());
        operation3.setTypes(new HashSet<>());

        OperationType operationType3 = new OperationType();
        operationType3.setName("Devolução com defeito");
        operationType3.setInformative(false);
        operationType3.setInterstate(false);
        operationType3.setOperation(operation3);
        operationType3.setInvoiceObjective(DocumentFinality.DEVOLUTION);
        operationType3.setCategory(OperationCategory.FLAW_RETURN);
        operation3.getTypes().add(operationType3);

        OperationType operationTypePC = new OperationType();
        operationTypePC.setName("Pedido de Consignado");
        operationTypePC.setInformative(false);
        operationTypePC.setInterstate(false);
        operationTypePC.setOperation(operation2);
        operationTypePC.setInvoiceObjective(DocumentFinality.NORMAL);
        operationTypePC.setCategory(OperationCategory.CONSIGNMENT_ORDER);
        operation3.getTypes().add(operationTypePC);
        this.service.save(operation3);
        operation3 = buddySeedControlService.saveSeedIntegrationFromBuddy(operation3, service);
        operation3.getTypes().stream().forEach(category -> {
            buddySeedControlService.saveSeedIntegrationFromBuddy(category, category.getId());
        });
    }

}

