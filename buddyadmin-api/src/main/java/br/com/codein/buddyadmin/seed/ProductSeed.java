package br.com.codein.buddyadmin.seed;

import br.com.mobiage.mobiage.application.service.businessrule.BusinessRuleService;
import br.com.mobiage.mobiage.application.service.characteristic.CharacteristicService;
import br.com.mobiage.mobiage.application.service.department.ProductTypeService;
import br.com.mobiage.mobiage.application.service.operation.OperationTypeService;
import br.com.mobiage.mobiage.application.service.paymenttype.PaymentTypeService;
import br.com.mobiage.mobiage.application.service.product.*;
import br.com.mobiage.mobiage.domain.model.businessrule.BusinessRule;
import br.com.mobiage.mobiage.domain.model.businessrule.enums.ValueType;
import br.com.mobiage.mobiage.domain.model.characteristic.Characteristic;
import br.com.mobiage.mobiage.domain.model.characteristic.CharacteristicValue;
import br.com.mobiage.mobiage.domain.model.department.enums.TypeLabeling;
import br.com.mobiage.mobiage.domain.model.operation.OperationType;
import br.com.mobiage.mobiage.domain.model.operation.enums.OperationCategory;
import br.com.mobiage.mobiage.domain.model.paymenttype.PaymentType;
import br.com.mobiage.mobiage.domain.model.paymenttype.enums.PaymentMethodsENUM;
import br.com.mobiage.mobiage.domain.model.product.*;
import br.com.mobiage.mobiage.domain.model.product.enums.CodeBarType;
import br.com.mobiage.mobiage.domain.model.product.enums.CommodityOrigin;
import io.gumga.domain.seed.AppSeed;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.io.IOException;
import java.math.BigDecimal;
import java.util.*;

/**
 * Created by gelatti on 17/02/17.
 */
@Component
public class ProductSeed implements AppSeed {

    @Autowired
    private ProductService service;
    @Autowired
    private CharacteristicService characteristicService;
    @Autowired
    private ProductInternalBarCodeService productInternalBarCodeService;
    @Autowired
    private NcmService ncmService;
    @Autowired
    private CestService cestService;
    @Autowired
    private ProductTypeService productTypeService;
    @Autowired
    private ProductGroupService productGroupService;



    @Override
    @Transactional
    public void loadSeed() throws IOException {
        if(service.findAll().getValues().isEmpty()){
            create();
        }
    }

    private void create() {
        Characteristic tamanho = characteristicService.recoveryByName("TAMANHO");
        Characteristic cor = characteristicService.recoveryByName("CORES");

        Product product = new Product();
        HashSet<CharacteristicValue> values = new HashSet<>();
        values.add(new CharacteristicValue(tamanho, tamanho.getValues().get(0)));
        values.add(new CharacteristicValue(cor, cor.getValues().get(0)));
        HashSet<CharacteristicValue> valuesItem = new HashSet<>();
        valuesItem.add(new CharacteristicValue(tamanho, tamanho.getValues().get(0)));
        valuesItem.add(new CharacteristicValue(cor, cor.getValues().get(0)));
        product.setFiscal(new Fiscal());
        product.setName("Bijuteria");
        product.setDate(new Date());
        product.setProductsItens(new HashSet<>());
        product.setSequenceCode(service.generateSequenceCode());
        product.setSku("MOD-ACE-BJTR-".concat(product.getSequenceCode()));
        product.setCharacteristicValues(values);
        product.setFiles(new ArrayList<>());

        ProductItem item = new ProductItem();
        item.setName("Bijuteria");
        item.setActive(true);
        item.setCharacteristicValues(valuesItem);
        item.setProductInternalBarCodes(new ArrayList<>());
        item.setFiles(new ArrayList<>());
        item.setSku(product.getSku());

        ProductInternalBarCode code = new ProductInternalBarCode();
        code.setInternalCode(productInternalBarCodeService.generateInternalCode(""));
        code.setBarCode(code.getInternalCode());
        code.setSaleValue(BigDecimal.TEN);
        code.setProfit(BigDecimal.ZERO);
        code.setName("Bijuteria");
        code.setLowStock(BigDecimal.ONE);
        code.setCostValue(BigDecimal.TEN);
        code.setActive(true);
        code.setType(CodeBarType.OWN);
        code.setFiles(new ArrayList<>());
        item.getProductInternalBarCodes().add(code);
        item.setFractionated(false);
        item.setTypeLabeling(TypeLabeling.COMMON);
        item.setGrossWeight(1d);
        item.setNetWeight(1d);
        product.getProductsItens().add(item);

        Ncm ncm = ncmService.findByCodigo("71179000");
        product.getFiscal().setNcm(ncm);

        Cest cest = cestService.findByCodigo("2805800");
        product.getFiscal().setCest(cest);

        product.setProductType(productTypeService.recoveryByName("Bijuteria"));
        product.setStatus(true);
        product.getFiscal().setCommodityOrigin(CommodityOrigin.NACIONAL);

        product.getFiscal().setVlIpi(BigDecimal.ZERO);
        product.getFiscal().setVlCofins(BigDecimal.ZERO);
        product.getFiscal().setVlPis(BigDecimal.ZERO);
        product.setCostValue(BigDecimal.TEN);
        product.setPercentageProfit(BigDecimal.ZERO);
        product.setTypeLabeling(TypeLabeling.COMMON);
        product.setFractionated(false);

        ProductGroup productGroup = productGroupService.findAll().get(0);
        product.getFiscal().setGroup(productGroup);

        service.save(product);
    }


}

