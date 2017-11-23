package br.com.codein.buddyadmin.application.service;


import br.com.codein.buddyadmin.infrastructure.config.ApplicationConstants;
import br.com.codein.buddyadmin.integration.client.SecurityBuddyClient;
import br.com.codein.buddyadmin.integration.client.fashionmanager.DepartmentClient;
import br.com.codein.buddyadmin.integration.client.fashionmanager.JuridicaClient;
import br.com.gumga.security.domain.model.institutional.Organization;
import br.com.mobiage.mobiage.application.service.businessrule.BusinessRuleService;
import br.com.mobiage.mobiage.application.service.characteristic.CharacteristicService;
import br.com.mobiage.mobiage.application.service.department.DepartmentService;
import br.com.mobiage.mobiage.application.service.fiscalgroup.PersonGroupService;
import br.com.mobiage.mobiage.application.service.operation.OperationService;
import br.com.mobiage.mobiage.application.service.paymenttype.PaymentFormService;
import br.com.mobiage.mobiage.application.service.pdv.CashAccountService;
import br.com.mobiage.mobiage.application.service.pdv.PdvService;
import br.com.mobiage.mobiage.application.service.person.IndividualService;
import br.com.mobiage.mobiage.application.service.person.JuridicaService;
import br.com.mobiage.mobiage.application.service.person.PersonService;
import br.com.mobiage.mobiage.application.service.person.RoleService;
import br.com.mobiage.mobiage.application.service.product.ProductGroupService;
import br.com.mobiage.mobiage.application.service.product.ProductService;
import br.com.mobiage.mobiage.application.service.tributador.FormulaService;
import br.com.mobiage.mobiage.application.service.tributador.TaxationGroupService;
import br.com.mobiage.mobiage.domain.model.businessrule.BusinessRule;
import br.com.mobiage.mobiage.domain.model.characteristic.Characteristic;
import br.com.mobiage.mobiage.domain.model.department.Department;
import br.com.mobiage.mobiage.domain.model.fiscal.PersonGroup;
import br.com.mobiage.mobiage.domain.model.operation.Operation;
import br.com.mobiage.mobiage.domain.model.paymenttype.PaymentForm;
import br.com.mobiage.mobiage.domain.model.pdv.CashAccount;
import br.com.mobiage.mobiage.domain.model.pdv.Pdv;
import br.com.mobiage.mobiage.domain.model.person.Individual;
import br.com.mobiage.mobiage.domain.model.person.Juridica;
import br.com.mobiage.mobiage.domain.model.person.Person;
import br.com.mobiage.mobiage.domain.model.person.Role;
import br.com.mobiage.mobiage.domain.model.product.Product;
import br.com.mobiage.mobiage.domain.model.product.ProductGroup;
import br.com.mobiage.mobiage.domain.model.tributador.TaxationGroup;
import br.com.mobiage.mobiage.domain.model.tributador.backend_reader.Formula;
import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;
import io.gumga.core.GumgaValues;
import io.gumga.domain.GumgaTenancyUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.IOException;
import java.util.*;
import java.util.stream.Collector;
import java.util.stream.Collectors;


@Service
public class SeedBuddyService {
    @Autowired
    private PaymentFormService paymentFormService;
    @Autowired
    private PersonGroupService personGroupService;
    @Autowired
    private OperationService operationService;
    @Autowired
    private BusinessRuleService businessRuleService;
    @Autowired
    private RoleService roleService;
//    @Autowired
//    private CashAccountService cashAccountService;
//    @Autowired
//    private PdvService pdvService;
    @Autowired
    private ProductGroupService productGroupService;
    @Autowired
    private FormulaService formulaService;
    @Autowired
    private TaxationGroupService taxationGroupService;
    @Autowired
    private ProductService productService;
    @Autowired
    private CharacteristicService characteristicService;
    @Autowired
    private DepartmentService departmentService;
    @Autowired
    private JuridicaService juridicaService;
    @Autowired
    private IndividualService individualService;



    @Transactional
    public List<PaymentForm> savePaymentForm(List<PaymentForm> entities) {
        return entities.stream().map(paymentForm -> paymentFormService.save(paymentForm)).collect(Collectors.toList());
    }

    @Transactional
    public List<PersonGroup> savePersonGroup(List<PersonGroup> entities) {
        return entities.stream().map(personGroup -> personGroupService.save(personGroup)).collect(Collectors.toList());
    }

    @Transactional
    public List<Operation> saveOperationType(List<Operation> entities) {
        return entities.stream().map(operation -> operationService.save(operation)).collect(Collectors.toList());
    }

    @Transactional
    public List<BusinessRule> saveBusinessRule(List<BusinessRule> entities) {
        entities.forEach(entity -> businessRuleService.save(entity));
        return entities;
    }

    @Transactional
    public List<Role> saveRole(List<Role> entities) {
        entities.forEach(entity -> roleService.save(entity));
        return entities;
    }

//    @Transactional
//    public List<CashAccount> saveCashAccount(List<CashAccount> entities) {
//        entities.forEach(entity -> cashAccountService.save(entity));
//        return entities;
//    }
//
//    @Transactional
//    public List<Pdv> savePdv(List<Pdv> entities) {
//        entities.forEach(entity -> pdvService.save(entity));
//        return entities;
//    }

    @Transactional
    public List<ProductGroup> saveProductGroup(List<ProductGroup> entities) {
        entities.forEach(entity -> productGroupService.save(entity));
        return entities;
    }

    @Transactional
    public List<Formula> saveFormula(List<Formula> entities) {
        entities.forEach(entity -> formulaService.save(entity));
        return entities;
    }

    @Transactional
    public List<TaxationGroup> saveTaxationGroup(List<TaxationGroup> entities) {
        entities.forEach(entity -> taxationGroupService.save(entity));
        return entities;
    }

    @Transactional
    public List<Product> saveProduct(List<Product> entities) {
        entities.forEach(entity -> productService.save(entity));
        return entities;
    }

    @Transactional
    public List<Characteristic> saveCharacteristic(List<Characteristic> entities) {
        entities.forEach(entity -> characteristicService.save(entity));
        return entities;
    }

    @Transactional
    public List<Department> saveDepartment(List<Department> entities) {
        entities.forEach(entity -> departmentService.save(entity));
        return entities;
    }

    @Transactional
    public List<Juridica> saveJuridica(List<Juridica> entities) {
        entities.forEach(entity -> juridicaService.save(entity));
        return entities;
    }

    @Transactional
    public List<Individual> saveIndividual(List<Individual> entities) {
        entities.forEach(entity -> individualService.save(entity));
        return entities;
    }

    @Transactional(readOnly = true)
    public HashMap<String, Object> all() {
        HashMap<String, Object> all = new HashMap<>();

        all.put("characteristics",characteristicService.findAllFat());
        all.put("paymentForms",paymentFormService.findAllFat());
        all.put("personGroups",personGroupService.findAll());
        all.put("operations",operationService.findAllFat());
        all.put("businessRules",businessRuleService.findAllFat());
        all.put("roles",roleService.findAllFat());
        all.put("individuals",individualService.findAllFat());
        all.put("juridicas",juridicaService.findAllFat());
        all.put("productGroups",productGroupService.findAll());
        all.put("formulas",formulaService.findAll().getValues());
        all.put("taxationGroups",taxationGroupService.findAllFat());
        all.put("departments",departmentService.findAllFat());
        all.put("products",productService.findAllFat());

        return all;
    }

}
