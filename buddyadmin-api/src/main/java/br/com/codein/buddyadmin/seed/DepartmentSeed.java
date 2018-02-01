package br.com.codein.buddyadmin.seed;

import br.com.mobiage.mobiage.application.service.buddyseed.BuddySeedControlService;
import br.com.mobiage.mobiage.application.service.businessrule.BusinessRuleService;
import br.com.mobiage.mobiage.application.service.characteristic.AssociativeCharacteristicService;
import br.com.mobiage.mobiage.application.service.characteristic.CharacteristicService;
import br.com.mobiage.mobiage.application.service.department.DepartmentService;
import br.com.mobiage.mobiage.application.service.operation.OperationTypeService;
import br.com.mobiage.mobiage.application.service.paymenttype.PaymentTypeService;
import br.com.mobiage.mobiage.domain.model.businessrule.BusinessRule;
import br.com.mobiage.mobiage.domain.model.businessrule.enums.ValueType;
import br.com.mobiage.mobiage.domain.model.characteristic.AssociativeCharacteristic;
import br.com.mobiage.mobiage.domain.model.characteristic.Characteristic;
import br.com.mobiage.mobiage.domain.model.department.Category;
import br.com.mobiage.mobiage.domain.model.department.Department;
import br.com.mobiage.mobiage.domain.model.department.ProductType;
import br.com.mobiage.mobiage.domain.model.department.enums.TypeLabeling;
import br.com.mobiage.mobiage.domain.model.operation.OperationType;
import br.com.mobiage.mobiage.domain.model.operation.enums.OperationCategory;
import br.com.mobiage.mobiage.domain.model.paymenttype.PaymentType;
import br.com.mobiage.mobiage.domain.model.paymenttype.enums.PaymentMethodsENUM;
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
public class DepartmentSeed implements AppSeed {

    @Autowired
    private DepartmentService service;
    @Autowired
    private CharacteristicService characteristicService;
    @Autowired
    private AssociativeCharacteristicService associativeCharacteristicService;

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

        Characteristic tamanho = characteristicService.recoveryByName("TAMANHO");
        Characteristic cor = characteristicService.recoveryByName("CORES");

        Department moda = new Department("Moda", new HashSet<>(), "MOD");
        Set<Category> categoriesModa = new HashSet<>();

        Category calcado = new Category("Calçados", new HashSet<>(), "CAL");
        calcado.setDepartment(moda);
        Set<ProductType> productTypesCalcados = new HashSet<>();
        ProductType tenis = new ProductType("Tenis", Arrays.asList("Tipo de Produto", "Marca"), TypeLabeling.COMMON, true, tamanho, cor, 1L, "TNS");
        tenis.setCategory(calcado);
        productTypesCalcados.add(tenis);
        ProductType sapatenis = new ProductType("Sapatenis", Arrays.asList("Tipo de Produto", "Marca"), TypeLabeling.COMMON, true, tamanho, cor, 2L, "SPTN");
        sapatenis.setCategory(calcado);
        productTypesCalcados.add(sapatenis);
        ProductType sapato = new ProductType("Sapato", Arrays.asList("Tipo de Produto", "Marca"), TypeLabeling.COMMON, true, tamanho, cor, 3L, "SPT");
        sapato.setCategory(calcado);
        productTypesCalcados.add(sapato);
        ProductType sapatilha = new ProductType("Sapatilha", Arrays.asList("Tipo de Produto", "Marca"), TypeLabeling.COMMON, true, tamanho, cor, 4L, "SPTL");
        sapatilha.setCategory(calcado);
        productTypesCalcados.add(sapatilha);
        ProductType bota = new ProductType("Bota", Arrays.asList("Tipo de Produto", "Marca"), TypeLabeling.COMMON, true, tamanho, cor, 5L, "BT");
        bota.setCategory(calcado);
        productTypesCalcados.add(bota);
        calcado.setProductTypes(productTypesCalcados);
        categoriesModa.add(calcado);

        Category roupas = new Category("Roupas", new HashSet<>(), "ROU");
        roupas.setDepartment(moda);
        Set<ProductType> productTypesRoupa = new HashSet<>();
        ProductType camiseta = new ProductType("Camiseta", Arrays.asList("Tipo de Produto", "Marca"), TypeLabeling.COMMON, true, tamanho, cor, 6L, "CMST");
        camiseta.setCategory(roupas);
        productTypesRoupa.add(camiseta);
        ProductType camisa = new ProductType("Camisa", Arrays.asList("Tipo de Produto", "Marca"), TypeLabeling.COMMON, true, tamanho, cor, 7L, "CMS");
        camisa.setCategory(roupas);
        productTypesRoupa.add(camisa);
        ProductType regata = new ProductType("Regata", Arrays.asList("Tipo de Produto", "Marca"), TypeLabeling.COMMON, true, tamanho, cor, 8L, "RGT");
        regata.setCategory(roupas);
        productTypesRoupa.add(regata);
        ProductType calca = new ProductType("Calça", Arrays.asList("Tipo de Produto", "Marca"), TypeLabeling.COMMON, true, tamanho, cor, 9L, "CLC");
        calca.setCategory(roupas);
        productTypesRoupa.add(calca);
        ProductType vestido = new ProductType("Vestido", Arrays.asList("Tipo de Produto", "Marca"), TypeLabeling.COMMON, true, tamanho, cor, 10L, "VSTD");
        vestido.setIntegrationId(1L);
        vestido.setCategory(roupas);
        productTypesRoupa.add(vestido);
        ProductType blusa = new ProductType("Blusa", Arrays.asList("Tipo de Produto", "Marca"), TypeLabeling.COMMON, true, tamanho, cor, 11L, "BLS");
        blusa.setCategory(roupas);
        productTypesRoupa.add(blusa);
        ProductType macacao = new ProductType("Macacão", Arrays.asList("Tipo de Produto", "Marca"), TypeLabeling.COMMON, true, tamanho, cor, 12L, "MCC");
        macacao.setCategory(roupas);
        productTypesRoupa.add(macacao);
        ProductType jardineira = new ProductType("Jardineira", Arrays.asList("Tipo de Produto", "Marca"), TypeLabeling.COMMON, true, tamanho, cor, 13L, "JRDN");
        jardineira.setCategory(roupas);
        productTypesRoupa.add(jardineira);
        ProductType bermuda = new ProductType("Bermuda", Arrays.asList("Tipo de Produto", "Marca"), TypeLabeling.COMMON, true, tamanho, cor, 14L, "BRMD");
        bermuda.setCategory(roupas);
        productTypesRoupa.add(bermuda);
        ProductType body = new ProductType("Body", Arrays.asList("Tipo de Produto", "Marca"), TypeLabeling.COMMON, true, tamanho, cor, 15L, "BD");
        body.setCategory(roupas);
        productTypesRoupa.add(body);
        ProductType saia = new ProductType("Saia", Arrays.asList("Tipo de Produto", "Marca"), TypeLabeling.COMMON, true, tamanho, cor, 16L, "S");
        saia.setCategory(roupas);
        productTypesRoupa.add(saia);
        ProductType legging = new ProductType("Legging", Arrays.asList("Tipo de Produto", "Marca"), TypeLabeling.COMMON, true, tamanho, cor, 17L, "LGGN");
        legging.setCategory(roupas);
        productTypesRoupa.add(legging);
        roupas.setProductTypes(productTypesRoupa);
        categoriesModa.add(roupas);


        Category modaI = new Category("Moda Intima", new HashSet<>(), "INT");
        modaI.setDepartment(moda);
        Set<ProductType> productTypesModaI = new HashSet<>();
        ProductType calcinha = new ProductType("Calcinha", Arrays.asList("Tipo de Produto", "Marca"), TypeLabeling.COMMON, true, tamanho, cor, 18L, "CLCN");
        calcinha.setCategory(modaI);
        productTypesModaI.add(calcinha);
        ProductType sutia = new ProductType("Sutiã", Arrays.asList("Tipo de Produto", "Marca"), TypeLabeling.COMMON, true, tamanho, cor, 19L, "ST");
        sutia.setCategory(modaI);
        productTypesModaI.add(sutia);
        ProductType cueca = new ProductType("Cueca", Arrays.asList("Tipo de Produto", "Marca"), TypeLabeling.COMMON, true, tamanho, cor, 20L, "CC");
        cueca.setCategory(modaI);
        productTypesModaI.add(cueca);
        ProductType camisola = new ProductType("Camisola", Arrays.asList("Tipo de Produto", "Marca"), TypeLabeling.COMMON, true, tamanho, cor, 21L, "CMSL");
        camisola.setCategory(modaI);
        productTypesModaI.add(camisola);
        ProductType pijama = new ProductType("Pijama", Arrays.asList("Tipo de Produto", "Marca"), TypeLabeling.COMMON, true, tamanho, cor, 22L, "PJM");
        pijama.setCategory(modaI);
        productTypesModaI.add(pijama);
        ProductType daybyday = new ProductType("DayByDay", Arrays.asList("Tipo de Produto", "Marca"), TypeLabeling.COMMON, true, tamanho, cor, 23L, "DBD");
        daybyday.setCategory(modaI);
        productTypesModaI.add(daybyday);
        modaI.setProductTypes(productTypesModaI);
        categoriesModa.add(modaI);

        Category modaP = new Category("Moda Praia", new HashSet<>(), "PRA");
        modaP.setDepartment(moda);
        Set<ProductType> productTypesModaP = new HashSet<>();
        ProductType biquine = new ProductType("Biquine", Arrays.asList("Tipo de Produto", "Marca"), TypeLabeling.COMMON, true, tamanho, cor, 24L, "BQN");
        biquine.setCategory(modaP);
        productTypesModaP.add(biquine);
        ProductType sunga = new ProductType("Sunga", Arrays.asList("Tipo de Produto", "Marca"), TypeLabeling.COMMON, true, tamanho, cor, 25L, "SNG");
        sunga.setCategory(modaP);
        productTypesModaP.add(sunga);
        ProductType saidadepraia = new ProductType("Saída de Praia", Arrays.asList("Tipo de Produto", "Marca"), TypeLabeling.COMMON, true, tamanho, cor, 26L, "SDPR");
        saidadepraia.setCategory(modaP);
        productTypesModaP.add(saidadepraia);
        ProductType bolsapraia = new ProductType("Bolsa de Praia", Arrays.asList("Tipo de Produto", "Marca"), TypeLabeling.COMMON, true, tamanho, cor, 27L, "BSDP");
        bolsapraia.setCategory(modaP);
        productTypesModaP.add(bolsapraia);
        ProductType chinelo = new ProductType("Chinelo", Arrays.asList("Tipo de Produto", "Marca"), TypeLabeling.COMMON, true, tamanho, cor, 28L, "CHNL");
        chinelo.setCategory(modaP);
        productTypesModaP.add(chinelo);
        modaP.setProductTypes(productTypesModaP);
        categoriesModa.add(modaP);

        Category acessorios = new Category("Acessorios", new HashSet<>(), "ACE");
        acessorios.setDepartment(moda);
        Set<ProductType> productTypesAcessorios = new HashSet<>();
        ProductType bolsa = new ProductType("Bolsa", Arrays.asList("Tipo de Produto", "Marca"), TypeLabeling.COMMON, true, tamanho, cor, 29L, "BLS");
        bolsa.setCategory(acessorios);
        productTypesAcessorios.add(bolsa);
        ProductType bijuteria = new ProductType("Bijuteria", Arrays.asList("Tipo de Produto", "Marca"), TypeLabeling.COMMON, true, tamanho, cor, 30L, "BJTR");
        bijuteria.setCategory(acessorios);
        productTypesAcessorios.add(bijuteria);
        ProductType joia = new ProductType("Joia", Arrays.asList("Tipo de Produto", "Marca"), TypeLabeling.COMMON, true, tamanho, cor, 31L, "J");
        joia.setCategory(acessorios);
        productTypesAcessorios.add(joia);
        ProductType cinto = new ProductType("Cinto", Arrays.asList("Tipo de Produto", "Marca"), TypeLabeling.COMMON, true, tamanho, cor, 32L, "CNT");
        cinto.setCategory(acessorios);
        productTypesAcessorios.add(cinto);
        ProductType carteira = new ProductType("Carteira", Arrays.asList("Tipo de Produto", "Marca"), TypeLabeling.COMMON, true, tamanho, cor, 33L, "CRTR");
        carteira.setCategory(acessorios);
        productTypesAcessorios.add(carteira);
        ProductType cachecol = new ProductType("Cachecol", Arrays.asList("Tipo de Produto", "Marca"), TypeLabeling.COMMON, true, tamanho, cor, 34L, "CCHC");
        cachecol.setCategory(acessorios);
        productTypesAcessorios.add(cachecol);
        ProductType bone = new ProductType("Boné", Arrays.asList("Tipo de Produto", "Marca"), TypeLabeling.COMMON, true, tamanho, cor, 35L, "BN");
        bone.setCategory(acessorios);
        productTypesAcessorios.add(bone);
        acessorios.setProductTypes(productTypesAcessorios);
        categoriesModa.add(acessorios);

        moda.setCategories(categoriesModa);

        for (Category c : moda.getCategories()) {
            for (ProductType p : c.getProductTypes()) {
                if (p.getCharacteristics() == null) {
                    System.out.println(p.getName());
                }
                for (AssociativeCharacteristic a : p.getCharacteristics()) {
                    buddySeedControlService.saveSeedIntegrationFromBuddy(a, associativeCharacteristicService);
                }
            }
        }
        buddySeedControlService.saveSeedIntegrationFromBuddy(moda, service);
        moda.getCategories().stream().forEach(category -> {
            buddySeedControlService.saveSeedIntegrationFromBuddy(category, category.getId());
            category.getProductTypes().stream().forEach(productType -> {
                buddySeedControlService.saveSeedIntegrationFromBuddy(productType, productType.getId());
            });
        });

        ProductType pt = new ProductType("Mouse", Arrays.asList("Tipo de Produto", "Marca"), TypeLabeling.COMMON, false, "MS");
        Category cat = new Category("Perifericos", new HashSet<>(Arrays.asList(pt)), "PER");
        pt.setCategory(cat);
        Department department = new Department("Informática", new HashSet<>(Arrays.asList(cat)), "INF");
        cat.setDepartment(department);
        buddySeedControlService.saveSeedIntegrationFromBuddy(department, service);
        department.getCategories().stream().forEach(category -> {
            buddySeedControlService.saveSeedIntegrationFromBuddy(category, category.getId());
            category.getProductTypes().stream().forEach(productType -> {
                buddySeedControlService.saveSeedIntegrationFromBuddy(productType, productType.getId());
            });
        });
    }


}

