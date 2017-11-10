package br.com.codein.buddyadmin.presentation;

import br.com.codein.buddyadmin.application.service.SeedBuddyService;
import br.com.mobiage.mobiage.application.service.seed.SeedService;
import br.com.mobiage.mobiage.domain.model.businessrule.BusinessRule;
import br.com.mobiage.mobiage.domain.model.characteristic.Characteristic;
import br.com.mobiage.mobiage.domain.model.fiscal.PersonGroup;
import br.com.mobiage.mobiage.domain.model.invoice.Prod;
import br.com.mobiage.mobiage.domain.model.operation.Operation;
import br.com.mobiage.mobiage.domain.model.paymenttype.PaymentForm;
import br.com.mobiage.mobiage.domain.model.pdv.CashAccount;
import br.com.mobiage.mobiage.domain.model.pdv.Pdv;
import br.com.mobiage.mobiage.domain.model.person.Individual;
import br.com.mobiage.mobiage.domain.model.person.Juridica;
import br.com.mobiage.mobiage.domain.model.person.Role;
import br.com.mobiage.mobiage.domain.model.product.Product;
import br.com.mobiage.mobiage.domain.model.product.ProductGroup;
import br.com.mobiage.mobiage.domain.model.tributador.TaxationGroup;
import br.com.mobiage.mobiage.domain.model.tributador.backend_reader.Formula;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import javax.transaction.Transactional;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/seed")
public class SeedBuddyAPI {

    @Autowired
    private SeedBuddyService service;

    @RequestMapping(value = "/paymenttype",method = RequestMethod.POST)
    public List<PaymentForm> seedPaymentType(@RequestBody List<PaymentForm> entities){
        return service.savePaymentForm(entities);
    }

    @RequestMapping(value = "/fiscalpersongroup",method = RequestMethod.POST)
    public List<PersonGroup> seedFiscalPersonGroup(@RequestBody List<PersonGroup> entities){
        return service.savePersonGroup(entities);
    }

    @RequestMapping(value = "/fiscalproductgroup",method = RequestMethod.POST)
    public List<ProductGroup> seedFiscalProductGroup(@RequestBody List<ProductGroup> entities){
        return service.saveProductGroup(entities);
    }

    @RequestMapping(value = "/operationtype",method = RequestMethod.POST)
    public List<Operation> seedOperationType(@RequestBody List<Operation> entities){
        return service.saveOperationType(entities);
    }

    @RequestMapping(value = "/businessrule",method = RequestMethod.POST)
    public List<BusinessRule> seedBusinessRule(@RequestBody List<BusinessRule> entities){
        return service.saveBusinessRule(entities);
    }

    @RequestMapping(value = "/role",method = RequestMethod.POST)
    public List<Role> seedRole(@RequestBody List<Role> entities){
        return service.saveRole(entities);
    }
//
//    @RequestMapping(value = "/cashaccount",method = RequestMethod.POST)
//    public List<CashAccount> seedCashAccount(@RequestBody List<CashAccount> entities){
//        return service.saveCashAccount(entities);
//    }
//
//    @RequestMapping(value = "/pdv",method = RequestMethod.POST)
//    public List<Pdv> seedPdv(@RequestBody List<Pdv> entities){
//        return service.savePdv(entities);
//    }

    @RequestMapping(value = "/formula",method = RequestMethod.POST)
    public List<Formula> seedFormula(@RequestBody List<Formula> entities){
        return service.saveFormula(entities);
    }

    @RequestMapping(value = "/taxationgroup",method = RequestMethod.POST)
    public List<TaxationGroup> seedTaxationGroup(@RequestBody List<TaxationGroup> entities){
        return service.saveTaxationGroup(entities);
    }

    @RequestMapping(value = "/product",method = RequestMethod.POST)
    public List<Product> seedProduct(@RequestBody List<Product> entities){
        return service.saveProduct(entities);
    }

    @RequestMapping(value = "/characteristic",method = RequestMethod.POST)
    public List<Characteristic> seedCharacteristic(@RequestBody List<Characteristic> entities){
        return service.saveCharacteristic(entities);
    }

    @RequestMapping(value = "/juridica",method = RequestMethod.POST)
    public List<Juridica> seedJuridica(@RequestBody List<Juridica> entities){
        return service.saveJuridica(entities);
    }

    @RequestMapping(value = "/individual",method = RequestMethod.POST)
    public List<Individual> seedIndividual(@RequestBody List<Individual> entities){
        return service.saveIndividual(entities);
    }

    @RequestMapping(value = "/all",method = RequestMethod.GET)
    public HashMap<String,Object> seedAll(){
        return service.all();
    }


}
