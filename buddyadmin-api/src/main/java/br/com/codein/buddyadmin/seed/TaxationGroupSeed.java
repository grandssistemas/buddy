package br.com.codein.buddyadmin.seed;

import br.com.mobiage.mobiage.application.service.fiscalgroup.PersonGroupService;
import br.com.mobiage.mobiage.application.service.operation.OperationTypeService;
import br.com.mobiage.mobiage.application.service.product.ProductGroupService;
import br.com.mobiage.mobiage.application.service.tributador.CfopService;
import br.com.mobiage.mobiage.application.service.tributador.CodigoEnquadramentoIpiService;
import br.com.mobiage.mobiage.application.service.tributador.FormulaService;
import br.com.mobiage.mobiage.application.service.tributador.TaxationGroupService;
import br.com.mobiage.mobiage.domain.model.fiscal.PersonGroup;
import br.com.mobiage.mobiage.domain.model.fiscal.enums.State;
import br.com.mobiage.mobiage.domain.model.operation.OperationType;
import br.com.mobiage.mobiage.domain.model.operation.enums.OperationCategory;
import br.com.mobiage.mobiage.domain.model.product.ProductGroup;
import br.com.mobiage.mobiage.domain.model.tributador.*;
import br.com.mobiage.mobiage.domain.model.tributador.backend_reader.Formula;
import br.com.mobiage.mobiage.domain.model.tributador.enums.*;
import io.gumga.domain.seed.AppSeed;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.io.IOException;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

/**
 * Created by gelatti on 17/02/17.
 */
@Component
public class TaxationGroupSeed implements AppSeed {

    @Autowired
    private TaxationGroupService service;
    @Autowired
    private CfopService cfopService;
    @Autowired
    private FormulaService formulaService;
    @Autowired
    private OperationTypeService operationTypeService;
    @Autowired
    private PersonGroupService personGroupService;
    @Autowired
    private ProductGroupService productGroupService;
    @Autowired
    private CodigoEnquadramentoIpiService enquadramentoIpiService;
//    @Autowired2acteristicService optionValueCharacteristicService;



    @Override
    @Transactional
    public void loadSeed() throws IOException {
        if(service.findAll().getValues().isEmpty()){
            create();
        }
    }

    private void create() {
        Cfop cfop = cfopService.findByCodigo("5102");

        Formula vBC = formulaService.findByName("Base ICMS");
        Formula vICMS = formulaService.findByName("Valor ICMS");
        Formula pisvBC = formulaService.findByName("Base PIS");
        Formula vPIS = formulaService.findByName("Valor PIS");
        Formula cofinsvBC = formulaService.findByName("Base COFINS");
        Formula vCOFINS = formulaService.findByName("Valor COFINS");
        Formula formulaIPI = formulaService.findByName("IPI");

        List<State> stateList = new ArrayList<>();
        stateList.add(State.PARANA);
        stateList.add(State.DISTRITO_FEDERAL);
        stateList.add(State.MATO_GROSSO);
        stateList.add(State.RIO_DE_JANEIRO);
        stateList.add(State.SAO_PAULO);

        List<OperationType> operationTypeList = new ArrayList<>();
        operationTypeList.addAll(operationTypeService.recoveryAllByCategory(OperationCategory.SIMPLE_SALE));

        List<PersonGroup> personGroupList = personGroupService.getAllActives().getValues();

        List<ProductGroup> productGroupList = productGroupService.getAllActives().getValues();

        TaxationICMS taxationICMS = new TaxationICMS();
        taxationICMS.setCfop(cfop);
        taxationICMS.setCST(IcmsTypes.INTEGRALMENTE_00);
        taxationICMS.setModBC(ModeCalculationBase.MARGEM_VALOR);
        taxationICMS.setvBC(vBC);
        taxationICMS.setpICMS(new BigDecimal("0.18"));
        taxationICMS.setvICMS(vICMS);

        TaxationPIS taxationPIS = new TaxationPIS();
        taxationPIS.setCST(CofinsPisTypes.OPERACAO_TRIBUTAVEL_01);
        taxationPIS.setvBC(pisvBC);
        taxationPIS.setpPIS(new BigDecimal("0.0013"));
        taxationPIS.setvPIS(vPIS);

        TaxationCOFINS taxationCOFINS = new TaxationCOFINS();
        taxationCOFINS.setCST(CofinsPisTypes.OPERACAO_TRIBUTAVEL_01);
        taxationCOFINS.setvBC(cofinsvBC);
        taxationCOFINS.setpCOFINS(new BigDecimal("0.03"));
        taxationCOFINS.setvCOFINS(vCOFINS);

        TaxationIPI taxationIPI = new TaxationIPI();
        taxationIPI.setCST(IpiTypes.OUTRAS_SAIDAS_99);
        taxationIPI.setIpiCalculationType(CalculationType.PORCENTAGEM);
        taxationIPI.setvBC(formulaIPI);
        taxationIPI.setpIPI(BigDecimal.ZERO);
        taxationIPI.setvIPI(formulaIPI);
        taxationIPI.setEnquadramentoIpi(enquadramentoIpiService.findByCodigo("999"));

        TaxationGroup taxationGroup = new TaxationGroup();
        taxationGroup.setName("Parametrização venda simples");
        taxationGroup.setOperationTypes(operationTypeList);
        taxationGroup.setOrigins(stateList);
        taxationGroup.setDestinations(stateList);
        taxationGroup.setPersonGroups(personGroupList);
        taxationGroup.setProductGroups(productGroupList);
        taxationGroup.setTaxationICMS(taxationICMS);
        taxationGroup.setTaxationPIS(taxationPIS);
        taxationGroup.setTaxationCOFINS(taxationCOFINS);
        taxationGroup.setTaxationIPI(taxationIPI);
        service.save(taxationGroup);


        Cfop cfop1 = cfopService.findByCodigo("1923");

        List<OperationType> operationTypeList1 = new ArrayList<>();
        OperationType op11 = operationTypeService.recoverByCategory(OperationCategory.SIMPLE_ENTRY);
        operationTypeList1.add(op11);

        TaxationICMS taxationICMS1 = new TaxationICMS();
        taxationICMS1.setCfop(cfop1);
        taxationICMS1.setCST(IcmsTypes.INTEGRALMENTE_00);
        taxationICMS1.setModBC(ModeCalculationBase.MARGEM_VALOR);
        taxationICMS1.setvBC(vBC);
        taxationICMS1.setpICMS(new BigDecimal("0.18"));
        taxationICMS1.setvICMS(vICMS);

        TaxationPIS taxationPIS1 = new TaxationPIS();
        taxationPIS1.setCST(CofinsPisTypes.OPERACAO_TRIBUTAVEL_01);
        taxationPIS1.setvBC(pisvBC);
        taxationPIS1.setpPIS(new BigDecimal("0.0013"));
        taxationPIS1.setvPIS(vPIS);

        TaxationCOFINS taxationCOFINS1 = new TaxationCOFINS();
        taxationCOFINS1.setCST(CofinsPisTypes.OPERACAO_TRIBUTAVEL_01);
        taxationCOFINS1.setvBC(cofinsvBC);
        taxationCOFINS1.setpCOFINS(new BigDecimal("0.03"));
        taxationCOFINS1.setvCOFINS(vCOFINS);

        TaxationIPI taxationIPI1 = new TaxationIPI();
        taxationIPI1.setCST(IpiTypes.OUTRAS_SAIDAS_99);
        taxationIPI1.setIpiCalculationType(CalculationType.PORCENTAGEM);
        taxationIPI1.setvBC(formulaIPI);
        taxationIPI1.setpIPI(BigDecimal.ZERO);
        taxationIPI1.setvIPI(formulaIPI);
        taxationIPI1.setEnquadramentoIpi(enquadramentoIpiService.findByCodigo("999"));

        TaxationGroup taxationGroup1 = new TaxationGroup();
        taxationGroup1.setName("Parametrização entrada simples");
        taxationGroup1.setOperationTypes(operationTypeList1);
        taxationGroup1.setOrigins(stateList);
        taxationGroup1.setDestinations(stateList);
        taxationGroup1.setPersonGroups(personGroupList);
        taxationGroup1.setProductGroups(productGroupList);
        taxationGroup1.setTaxationICMS(taxationICMS1);
        taxationGroup1.setTaxationPIS(taxationPIS1);
        taxationGroup1.setTaxationCOFINS(taxationCOFINS1);
        taxationGroup1.setTaxationIPI(taxationIPI1);
        service.save(taxationGroup1);

        Cfop cfop2 = cfopService.findByCodigo("5917");

        List<OperationType> operationTypeList2 = new ArrayList<>();
        OperationType op2 = operationTypeService.recoverByCategory(OperationCategory.CONSIGNMENT_ORDER);
        operationTypeList2.add(op2);

        TaxationICMS taxationICMS2 = new TaxationICMS();
        taxationICMS2.setCfop(cfop2);
        taxationICMS2.setCST(IcmsTypes.INTEGRALMENTE_00);
        taxationICMS2.setModBC(ModeCalculationBase.MARGEM_VALOR);
        taxationICMS2.setvBC(vBC);
        taxationICMS2.setpICMS(new BigDecimal("0.18"));
        taxationICMS2.setvICMS(vICMS);

        TaxationPIS taxationPIS2 = new TaxationPIS();
        taxationPIS2.setCST(CofinsPisTypes.OPERACAO_TRIBUTAVEL_01);
        taxationPIS2.setvBC(pisvBC);
        taxationPIS2.setpPIS(new BigDecimal("0.0013"));
        taxationPIS2.setvPIS(vPIS);

        TaxationCOFINS taxationCOFINS2 = new TaxationCOFINS();
        taxationCOFINS2.setCST(CofinsPisTypes.OPERACAO_TRIBUTAVEL_01);
        taxationCOFINS2.setvBC(cofinsvBC);
        taxationCOFINS2.setpCOFINS(new BigDecimal("0.03"));
        taxationCOFINS2.setvCOFINS(vCOFINS);

        TaxationIPI taxationIPI2 = new TaxationIPI();
        taxationIPI2.setCST(IpiTypes.OUTRAS_SAIDAS_99);
        taxationIPI2.setIpiCalculationType(CalculationType.PORCENTAGEM);
        taxationIPI2.setvBC(formulaIPI);
        taxationIPI2.setpIPI(BigDecimal.ZERO);
        taxationIPI2.setvIPI(formulaIPI);
        taxationIPI2.setEnquadramentoIpi(enquadramentoIpiService.findByCodigo("999"));

        TaxationGroup taxationGroup2 = new TaxationGroup();
        taxationGroup2.setName("Parametrização pedido consignado");
        taxationGroup2.setOperationTypes(operationTypeList2);
        taxationGroup2.setOrigins(stateList);
        taxationGroup2.setDestinations(stateList);
        taxationGroup2.setPersonGroups(personGroupList);
        taxationGroup2.setProductGroups(productGroupList);
        taxationGroup2.setTaxationICMS(taxationICMS2);
        taxationGroup2.setTaxationPIS(taxationPIS2);
        taxationGroup2.setTaxationCOFINS(taxationCOFINS2);
        taxationGroup2.setTaxationIPI(taxationIPI2);
        service.save(taxationGroup2);

        Cfop cfop3 = cfopService.findByCodigo("5115");

        List<OperationType> operationTypeList3 = new ArrayList<>();
        OperationType op3 = operationTypeService.recoverByCategory(OperationCategory.CONSIGNMENT_SALE);
        operationTypeList3.add(op3);

        TaxationICMS taxationICMS3 = new TaxationICMS();
        taxationICMS3.setCfop(cfop3);
        taxationICMS3.setCST(IcmsTypes.INTEGRALMENTE_00);
        taxationICMS3.setModBC(ModeCalculationBase.MARGEM_VALOR);
        taxationICMS3.setvBC(vBC);
        taxationICMS3.setpICMS(new BigDecimal("0.18"));
        taxationICMS3.setvICMS(vICMS);

        TaxationPIS taxationPIS3 = new TaxationPIS();
        taxationPIS3.setCST(CofinsPisTypes.OPERACAO_TRIBUTAVEL_01);
        taxationPIS3.setvBC(pisvBC);
        taxationPIS3.setpPIS(new BigDecimal("0.0013"));
        taxationPIS3.setvPIS(vPIS);

        TaxationCOFINS taxationCOFINS3 = new TaxationCOFINS();
        taxationCOFINS3.setCST(CofinsPisTypes.OPERACAO_TRIBUTAVEL_01);
        taxationCOFINS3.setvBC(cofinsvBC);
        taxationCOFINS3.setpCOFINS(new BigDecimal("0.03"));
        taxationCOFINS3.setvCOFINS(vCOFINS);

        TaxationIPI taxationIPI3 = new TaxationIPI();
        taxationIPI3.setCST(IpiTypes.OUTRAS_SAIDAS_99);
        taxationIPI3.setIpiCalculationType(CalculationType.PORCENTAGEM);
        taxationIPI3.setvBC(formulaIPI);
        taxationIPI3.setpIPI(BigDecimal.ZERO);
        taxationIPI3.setvIPI(formulaIPI);
        taxationIPI3.setEnquadramentoIpi(enquadramentoIpiService.findByCodigo("999"));

        TaxationGroup taxationGroup3 = new TaxationGroup();
        taxationGroup3.setName("Parametrização venda de consignado");
        taxationGroup3.setOperationTypes(operationTypeList3);
        taxationGroup3.setOrigins(stateList);
        taxationGroup3.setDestinations(stateList);
        taxationGroup3.setPersonGroups(personGroupList);
        taxationGroup3.setProductGroups(productGroupList);
        taxationGroup3.setTaxationICMS(taxationICMS3);
        taxationGroup3.setTaxationPIS(taxationPIS3);
        taxationGroup3.setTaxationCOFINS(taxationCOFINS3);
        taxationGroup3.setTaxationIPI(taxationIPI3);
        service.save(taxationGroup3);

        Cfop cfop4 = cfopService.findByCodigo("1918");

        List<OperationType> operationTypeList4 = new ArrayList<>();
        OperationType op4 = operationTypeService.recoverByCategory(OperationCategory.CONSIGNMENT_RETURN);
        operationTypeList4.add(op4);

        TaxationICMS taxationICMS4 = new TaxationICMS();
        taxationICMS4.setCfop(cfop4);
        taxationICMS4.setCST(IcmsTypes.INTEGRALMENTE_00);
        taxationICMS4.setModBC(ModeCalculationBase.MARGEM_VALOR);
        taxationICMS4.setvBC(vBC);
        taxationICMS4.setpICMS(new BigDecimal("0.18"));
        taxationICMS4.setvICMS(vICMS);

        TaxationPIS taxationPIS4 = new TaxationPIS();
        taxationPIS4.setCST(CofinsPisTypes.OPERACAO_TRIBUTAVEL_01);
        taxationPIS4.setvBC(pisvBC);
        taxationPIS4.setpPIS(new BigDecimal("0.0013"));
        taxationPIS4.setvPIS(vPIS);

        TaxationCOFINS taxationCOFINS4 = new TaxationCOFINS();
        taxationCOFINS4.setCST(CofinsPisTypes.OPERACAO_TRIBUTAVEL_01);
        taxationCOFINS4.setvBC(cofinsvBC);
        taxationCOFINS4.setpCOFINS(new BigDecimal("0.03"));
        taxationCOFINS4.setvCOFINS(vCOFINS);

        TaxationIPI taxationIPI4 = new TaxationIPI();
        taxationIPI4.setCST(IpiTypes.OUTRAS_SAIDAS_99);
        taxationIPI4.setIpiCalculationType(CalculationType.PORCENTAGEM);
        taxationIPI4.setvBC(formulaIPI);
        taxationIPI4.setpIPI(BigDecimal.ZERO);
        taxationIPI4.setvIPI(formulaIPI);
        taxationIPI4.setEnquadramentoIpi(enquadramentoIpiService.findByCodigo("999"));

        TaxationGroup taxationGroup4 = new TaxationGroup();
        taxationGroup4.setName("Parametrização devolução de consignado");
        taxationGroup4.setOperationTypes(operationTypeList4);
        taxationGroup4.setOrigins(stateList);
        taxationGroup4.setDestinations(stateList);
        taxationGroup4.setPersonGroups(personGroupList);
        taxationGroup4.setProductGroups(productGroupList);
        taxationGroup4.setTaxationICMS(taxationICMS4);
        taxationGroup4.setTaxationPIS(taxationPIS4);
        taxationGroup4.setTaxationCOFINS(taxationCOFINS4);
        taxationGroup4.setTaxationIPI(taxationIPI4);
        service.save(taxationGroup4);


        Cfop cfop5 = cfopService.findByCodigo("1949");

        List<OperationType> operationTypeList5 = new ArrayList<>();
        OperationType op5 = operationTypeService.recoverByCategory(OperationCategory.AUDIT_ENTRY);
        operationTypeList5.add(op5);

        TaxationICMS taxationICMS5 = new TaxationICMS();
        taxationICMS5.setCfop(cfop5);
        taxationICMS5.setCST(IcmsTypes.INTEGRALMENTE_00);
        taxationICMS5.setModBC(ModeCalculationBase.MARGEM_VALOR);
        taxationICMS5.setvBC(vBC);
        taxationICMS5.setpICMS(new BigDecimal("0.18"));
        taxationICMS5.setvICMS(vICMS);

        TaxationPIS taxationPIS5 = new TaxationPIS();
        taxationPIS5.setCST(CofinsPisTypes.OPERACAO_TRIBUTAVEL_01);
        taxationPIS5.setvBC(pisvBC);
        taxationPIS5.setpPIS(new BigDecimal("0.0013"));
        taxationPIS5.setvPIS(vPIS);

        TaxationCOFINS taxationCOFINS5 = new TaxationCOFINS();
        taxationCOFINS5.setCST(CofinsPisTypes.OPERACAO_TRIBUTAVEL_01);
        taxationCOFINS5.setvBC(cofinsvBC);
        taxationCOFINS5.setpCOFINS(new BigDecimal("0.03"));
        taxationCOFINS5.setvCOFINS(vCOFINS);

        TaxationIPI taxationIPI5 = new TaxationIPI();
        taxationIPI5.setCST(IpiTypes.OUTRAS_SAIDAS_99);
        taxationIPI5.setIpiCalculationType(CalculationType.PORCENTAGEM);
        taxationIPI5.setvBC(formulaIPI);
        taxationIPI5.setpIPI(BigDecimal.ZERO);
        taxationIPI5.setvIPI(formulaIPI);
        taxationIPI5.setEnquadramentoIpi(enquadramentoIpiService.findByCodigo("999"));

        TaxationGroup taxationGroup5 = new TaxationGroup();
        taxationGroup5.setName("Parametrização balanço de entrada");
        taxationGroup5.setOperationTypes(operationTypeList5);
        taxationGroup5.setOrigins(stateList);
        taxationGroup5.setDestinations(stateList);
        taxationGroup5.setPersonGroups(personGroupList);
        taxationGroup5.setProductGroups(productGroupList);
        taxationGroup5.setTaxationICMS(taxationICMS5);
        taxationGroup5.setTaxationPIS(taxationPIS5);
        taxationGroup5.setTaxationCOFINS(taxationCOFINS5);
        taxationGroup5.setTaxationIPI(taxationIPI5);
        service.save(taxationGroup5);

        Cfop cfop6 = cfopService.findByCodigo("5927");

        List<OperationType> operationTypeList6 = new ArrayList<>();
        OperationType op6 = operationTypeService.recoverByCategory(OperationCategory.AUDIT_OUTPUT);
        operationTypeList6.add(op6);

        TaxationICMS taxationICMS6 = new TaxationICMS();
        taxationICMS6.setCfop(cfop6);
        taxationICMS6.setCST(IcmsTypes.INTEGRALMENTE_00);
        taxationICMS6.setModBC(ModeCalculationBase.MARGEM_VALOR);
        taxationICMS6.setvBC(vBC);
        taxationICMS6.setpICMS(new BigDecimal("0.18"));
        taxationICMS6.setvICMS(vICMS);

        TaxationPIS taxationPIS6 = new TaxationPIS();
        taxationPIS6.setCST(CofinsPisTypes.OPERACAO_TRIBUTAVEL_01);
        taxationPIS6.setvBC(pisvBC);
        taxationPIS6.setpPIS(new BigDecimal("0.0013"));
        taxationPIS6.setvPIS(vPIS);

        TaxationCOFINS taxationCOFINS6 = new TaxationCOFINS();
        taxationCOFINS6.setCST(CofinsPisTypes.OPERACAO_TRIBUTAVEL_01);
        taxationCOFINS6.setvBC(cofinsvBC);
        taxationCOFINS6.setpCOFINS(new BigDecimal("0.03"));
        taxationCOFINS6.setvCOFINS(vCOFINS);

        TaxationIPI taxationIPI6 = new TaxationIPI();
        taxationIPI6.setCST(IpiTypes.OUTRAS_SAIDAS_99);
        taxationIPI6.setIpiCalculationType(CalculationType.PORCENTAGEM);
        taxationIPI6.setvBC(formulaIPI);
        taxationIPI6.setpIPI(BigDecimal.ZERO);
        taxationIPI6.setvIPI(formulaIPI);
        taxationIPI6.setEnquadramentoIpi(enquadramentoIpiService.findByCodigo("999"));

        TaxationGroup taxationGroup6 = new TaxationGroup();
        taxationGroup6.setName("Parametrização balanço de saida");
        taxationGroup6.setOperationTypes(operationTypeList6);
        taxationGroup6.setOrigins(stateList);
        taxationGroup6.setDestinations(stateList);
        taxationGroup6.setPersonGroups(personGroupList);
        taxationGroup6.setProductGroups(productGroupList);
        taxationGroup6.setTaxationICMS(taxationICMS6);
        taxationGroup6.setTaxationPIS(taxationPIS6);
        taxationGroup6.setTaxationCOFINS(taxationCOFINS6);
        taxationGroup6.setTaxationIPI(taxationIPI6);
        service.save(taxationGroup6);

        Cfop cfop7 = cfopService.findByCodigo("1202");

        List<OperationType> operationTypeList7 = new ArrayList<>();
        OperationType op7 = operationTypeService.recoverByCategory(OperationCategory.EXCHANGE_RETURN);
        operationTypeList7.add(op7);

        TaxationICMS taxationICMS7 = new TaxationICMS();
        taxationICMS7.setCfop(cfop7);
        taxationICMS7.setCST(IcmsTypes.INTEGRALMENTE_00);
        taxationICMS7.setModBC(ModeCalculationBase.MARGEM_VALOR);
        taxationICMS7.setvBC(vBC);
        taxationICMS7.setpICMS(new BigDecimal("0.18"));
        taxationICMS7.setvICMS(vICMS);

        TaxationPIS taxationPIS7 = new TaxationPIS();
        taxationPIS7.setCST(CofinsPisTypes.OPERACAO_TRIBUTAVEL_01);
        taxationPIS7.setvBC(pisvBC);
        taxationPIS7.setpPIS(new BigDecimal("0.0013"));
        taxationPIS7.setvPIS(vPIS);

        TaxationCOFINS taxationCOFINS7 = new TaxationCOFINS();
        taxationCOFINS7.setCST(CofinsPisTypes.OPERACAO_TRIBUTAVEL_01);
        taxationCOFINS7.setvBC(cofinsvBC);
        taxationCOFINS7.setpCOFINS(new BigDecimal("0.03"));
        taxationCOFINS7.setvCOFINS(vCOFINS);

        TaxationIPI taxationIPI7 = new TaxationIPI();
        taxationIPI7.setCST(IpiTypes.OUTRAS_SAIDAS_99);
        taxationIPI7.setIpiCalculationType(CalculationType.PORCENTAGEM);
        taxationIPI7.setvBC(formulaIPI);
        taxationIPI7.setpIPI(BigDecimal.ZERO);
        taxationIPI7.setvIPI(formulaIPI);
        taxationIPI7.setEnquadramentoIpi(enquadramentoIpiService.findByCodigo("999"));

        TaxationGroup taxationGroup7 = new TaxationGroup();
        taxationGroup7.setName("Parametrização devolução por troca");
        taxationGroup7.setOperationTypes(operationTypeList7);
        taxationGroup7.setOrigins(stateList);
        taxationGroup7.setDestinations(stateList);
        taxationGroup7.setPersonGroups(personGroupList);
        taxationGroup7.setProductGroups(productGroupList);
        taxationGroup7.setTaxationICMS(taxationICMS7);
        taxationGroup7.setTaxationPIS(taxationPIS7);
        taxationGroup7.setTaxationCOFINS(taxationCOFINS7);
        taxationGroup7.setTaxationIPI(taxationIPI7);
        service.save(taxationGroup7);

        Cfop cfop8 = cfopService.findByCodigo("5949");
        List<OperationType> operationTypeList8 = new ArrayList<>();
        OperationType op8 = operationTypeService.recoverByCategory(OperationCategory.EXCHANGE_SALE);
        operationTypeList8.add(op8);
        TaxationICMS taxationICMS8 = new TaxationICMS();
        taxationICMS8.setCfop(cfop8);
        taxationICMS8.setCST(IcmsTypes.INTEGRALMENTE_00);
        taxationICMS8.setModBC(ModeCalculationBase.MARGEM_VALOR);
        taxationICMS8.setvBC(vBC);
        taxationICMS8.setpICMS(new BigDecimal("0.18"));
        taxationICMS8.setvICMS(vICMS);
        TaxationPIS taxationPIS8 = new TaxationPIS();
        taxationPIS8.setCST(CofinsPisTypes.OPERACAO_TRIBUTAVEL_01);
        taxationPIS8.setvBC(pisvBC);
        taxationPIS8.setpPIS(new BigDecimal("0.0013"));
        taxationPIS8.setvPIS(vPIS);
        TaxationCOFINS taxationCOFINS8 = new TaxationCOFINS();
        taxationCOFINS8.setCST(CofinsPisTypes.OPERACAO_TRIBUTAVEL_01);
        taxationCOFINS8.setvBC(cofinsvBC);
        taxationCOFINS8.setpCOFINS(new BigDecimal("0.03"));
        taxationCOFINS8.setvCOFINS(vCOFINS);
        TaxationIPI taxationIPI8 = new TaxationIPI();
        taxationIPI8.setCST(IpiTypes.OUTRAS_SAIDAS_99);
        taxationIPI8.setIpiCalculationType(CalculationType.PORCENTAGEM);
        taxationIPI8.setvBC(formulaIPI);
        taxationIPI8.setpIPI(BigDecimal.ZERO);
        taxationIPI8.setvIPI(formulaIPI);
        taxationIPI8.setEnquadramentoIpi(enquadramentoIpiService.findByCodigo("999"));
        TaxationGroup taxationGroup8 = new TaxationGroup();
        taxationGroup8.setName("Parametrização venda por troca");
        taxationGroup8.setOperationTypes(operationTypeList8);
        taxationGroup8.setOrigins(stateList);
        taxationGroup8.setDestinations(stateList);
        taxationGroup8.setPersonGroups(personGroupList);
        taxationGroup8.setProductGroups(productGroupList);
        taxationGroup8.setTaxationICMS(taxationICMS8);
        taxationGroup8.setTaxationPIS(taxationPIS8);
        taxationGroup8.setTaxationCOFINS(taxationCOFINS8);
        taxationGroup8.setTaxationIPI(taxationIPI8);
        service.save(taxationGroup8);
    }

}

