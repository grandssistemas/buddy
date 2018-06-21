package br.com.codein.buddyadmin.seed;

import br.com.mobiage.mobiage.application.service.buddyseed.BuddySeedControlService;
import br.com.mobiage.mobiage.application.service.businessrule.BusinessRuleService;
import br.com.mobiage.mobiage.application.service.characteristic.CharacteristicService;
import br.com.mobiage.mobiage.application.service.operation.OperationTypeService;
import br.com.mobiage.mobiage.application.service.paymenttype.PaymentTypeService;
import br.com.mobiage.mobiage.domain.model.businessrule.BusinessRule;
import br.com.mobiage.mobiage.domain.model.businessrule.enums.ValueType;
import br.com.mobiage.mobiage.domain.model.characteristic.Characteristic;
import br.com.mobiage.mobiage.domain.model.characteristic.OptionValueCharacteristic;
import br.com.mobiage.mobiage.domain.model.characteristic.enums.CharacteristicOrigin;
import br.com.mobiage.mobiage.domain.model.characteristic.enums.ValueTypeCharacteristic;
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
import java.util.ArrayList;
import java.util.Collections;
import java.util.Date;
import java.util.List;

/**
 * Created by gelatti on 17/02/17.
 */
@Component
public class CharacteristicSeed implements AppSeed {

    @Autowired
    private CharacteristicService service;

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
        List<OptionValueCharacteristic> volumeValue = new ArrayList<>();
        volumeValue.add(new OptionValueCharacteristic("210ml"));
        volumeValue.add(new OptionValueCharacteristic("237ml"));
        volumeValue.add(new OptionValueCharacteristic("250ml"));
        volumeValue.add(new OptionValueCharacteristic("269ml"));
        volumeValue.add(new OptionValueCharacteristic("275ml"));
        volumeValue.add(new OptionValueCharacteristic("290ml"));
        volumeValue.add(new OptionValueCharacteristic("300ml"));
        volumeValue.add(new OptionValueCharacteristic("310ml"));
        volumeValue.add(new OptionValueCharacteristic("313ml"));
        volumeValue.add(new OptionValueCharacteristic("330ml"));
        volumeValue.add(new OptionValueCharacteristic("343ml"));
        volumeValue.add(new OptionValueCharacteristic("350ml"));
        volumeValue.add(new OptionValueCharacteristic("375ml"));
        volumeValue.add(new OptionValueCharacteristic("355ml"));
        volumeValue.add(new OptionValueCharacteristic("400ml"));
        volumeValue.add(new OptionValueCharacteristic("473ml"));
        volumeValue.add(new OptionValueCharacteristic("500ml"));
        volumeValue.add(new OptionValueCharacteristic("550ml"));
        volumeValue.add(new OptionValueCharacteristic("600ml"));
        volumeValue.add(new OptionValueCharacteristic("740ml"));
        volumeValue.add(new OptionValueCharacteristic("750ml"));
        volumeValue.add(new OptionValueCharacteristic("765ml"));
        volumeValue.add(new OptionValueCharacteristic("960ml"));
        volumeValue.add(new OptionValueCharacteristic("970ml"));
        volumeValue.add(new OptionValueCharacteristic("990ml"));
        volumeValue.add(new OptionValueCharacteristic("1000ml"));
        volumeValue.add(new OptionValueCharacteristic("1250ml"));
        volumeValue.add(new OptionValueCharacteristic("1500ml"));
        volumeValue.add(new OptionValueCharacteristic("1750ml"));
        volumeValue.add(new OptionValueCharacteristic("2000ml"));
        volumeValue.add(new OptionValueCharacteristic("2250ml"));
        volumeValue.add(new OptionValueCharacteristic("2500ml"));
        volumeValue.add(new OptionValueCharacteristic("3000ml"));
        volumeValue.add(new OptionValueCharacteristic("3300ml"));
        volumeValue.add(new OptionValueCharacteristic("5000ml"));
        volumeValue.add(new OptionValueCharacteristic("10000ml"));
        volumeValue.add(new OptionValueCharacteristic("20000ml"));
        Characteristic volume = new Characteristic("Volume", ValueTypeCharacteristic.MULTISELECAO, volumeValue, CharacteristicOrigin.PRODUCT);
        this.service.save(volume);
        volume = buddySeedControlService.saveSeedIntegrationFromBuddy(volume, service);
        volume.setIntegrationId(volume.getId());
        volume.getValues().stream().forEach(vol -> {
            buddySeedControlService.saveSeedIntegrationFromBuddy(vol, vol.getId());
        });
        service.save(volume);

        List<OptionValueCharacteristic> embalagemValue = new ArrayList<>();
        embalagemValue.add(new OptionValueCharacteristic("Lata"));
        embalagemValue.add(new OptionValueCharacteristic("Garrafa"));
        embalagemValue.add(new OptionValueCharacteristic("Pet"));
        embalagemValue.add(new OptionValueCharacteristic("Caixa"));
        embalagemValue.add(new OptionValueCharacteristic("Galão"));
        embalagemValue.add(new OptionValueCharacteristic("Copo"));
        Characteristic embalagem = new Characteristic("Embalagem", ValueTypeCharacteristic.MULTISELECAO, embalagemValue, CharacteristicOrigin.PRODUCT);
        this.service.save(embalagem);
        embalagem = buddySeedControlService.saveSeedIntegrationFromBuddy(embalagem, service);
        embalagem.getValues().stream().forEach(embalagemValue1 -> {
            buddySeedControlService.saveSeedIntegrationFromBuddy(embalagemValue1, embalagemValue1.getId());
        });
        embalagem.setIntegrationId(embalagem.getId());
        service.save(embalagem);

        List<OptionValueCharacteristic> tamanhoValue = new ArrayList<>();
        tamanhoValue.add(new OptionValueCharacteristic("UN"));
        tamanhoValue.add(new OptionValueCharacteristic("TU"));
        tamanhoValue.add(new OptionValueCharacteristic("RN"));
        tamanhoValue.add(new OptionValueCharacteristic("P4"));
        tamanhoValue.add(new OptionValueCharacteristic("P2"));
        tamanhoValue.add(new OptionValueCharacteristic("PP"));
        tamanhoValue.add(new OptionValueCharacteristic("P"));
        tamanhoValue.add(new OptionValueCharacteristic("M"));
        tamanhoValue.add(new OptionValueCharacteristic("G"));
        tamanhoValue.add(new OptionValueCharacteristic("GG"));
        tamanhoValue.add(new OptionValueCharacteristic("EG"));
        tamanhoValue.add(new OptionValueCharacteristic("XG"));
        tamanhoValue.add(new OptionValueCharacteristic("G1"));
        tamanhoValue.add(new OptionValueCharacteristic("G2"));
        tamanhoValue.add(new OptionValueCharacteristic("G3"));
        tamanhoValue.add(new OptionValueCharacteristic("G4"));
        tamanhoValue.add(new OptionValueCharacteristic("G5"));
        tamanhoValue.add(new OptionValueCharacteristic("G6"));
        tamanhoValue.add(new OptionValueCharacteristic("G7"));
        tamanhoValue.add(new OptionValueCharacteristic("G8"));
        tamanhoValue.add(new OptionValueCharacteristic("3G"));
        tamanhoValue.add(new OptionValueCharacteristic("4G"));
        tamanhoValue.add(new OptionValueCharacteristic("5G"));
        tamanhoValue.add(new OptionValueCharacteristic("6G"));
        tamanhoValue.add(new OptionValueCharacteristic("1"));
        tamanhoValue.add(new OptionValueCharacteristic("2"));
        tamanhoValue.add(new OptionValueCharacteristic("3"));
        tamanhoValue.add(new OptionValueCharacteristic("4"));
        tamanhoValue.add(new OptionValueCharacteristic("5"));
        tamanhoValue.add(new OptionValueCharacteristic("6"));
        tamanhoValue.add(new OptionValueCharacteristic("7"));
        tamanhoValue.add(new OptionValueCharacteristic("8"));
        tamanhoValue.add(new OptionValueCharacteristic("9"));
        tamanhoValue.add(new OptionValueCharacteristic("10"));
        tamanhoValue.add(new OptionValueCharacteristic("11"));
        tamanhoValue.add(new OptionValueCharacteristic("12"));
        tamanhoValue.add(new OptionValueCharacteristic("13"));
        tamanhoValue.add(new OptionValueCharacteristic("14"));
        tamanhoValue.add(new OptionValueCharacteristic("15"));
        tamanhoValue.add(new OptionValueCharacteristic("16"));
        tamanhoValue.add(new OptionValueCharacteristic("17"));
        tamanhoValue.add(new OptionValueCharacteristic("18"));
        tamanhoValue.add(new OptionValueCharacteristic("19"));
        tamanhoValue.add(new OptionValueCharacteristic("20"));
        tamanhoValue.add(new OptionValueCharacteristic("21"));
        tamanhoValue.add(new OptionValueCharacteristic("22"));
        tamanhoValue.add(new OptionValueCharacteristic("23"));
        tamanhoValue.add(new OptionValueCharacteristic("24"));
        tamanhoValue.add(new OptionValueCharacteristic("25"));
        tamanhoValue.add(new OptionValueCharacteristic("26"));
        tamanhoValue.add(new OptionValueCharacteristic("27"));
        tamanhoValue.add(new OptionValueCharacteristic("28"));
        tamanhoValue.add(new OptionValueCharacteristic("29"));
        tamanhoValue.add(new OptionValueCharacteristic("30"));
        tamanhoValue.add(new OptionValueCharacteristic("31"));
        tamanhoValue.add(new OptionValueCharacteristic("32"));
        tamanhoValue.add(new OptionValueCharacteristic("33"));
        tamanhoValue.add(new OptionValueCharacteristic("34"));
        tamanhoValue.add(new OptionValueCharacteristic("35"));
        tamanhoValue.add(new OptionValueCharacteristic("36"));
        tamanhoValue.add(new OptionValueCharacteristic("37"));
        tamanhoValue.add(new OptionValueCharacteristic("38"));
        tamanhoValue.add(new OptionValueCharacteristic("39"));
        tamanhoValue.add(new OptionValueCharacteristic("40"));
        tamanhoValue.add(new OptionValueCharacteristic("41"));
        tamanhoValue.add(new OptionValueCharacteristic("42"));
        tamanhoValue.add(new OptionValueCharacteristic("43"));
        tamanhoValue.add(new OptionValueCharacteristic("44"));
        tamanhoValue.add(new OptionValueCharacteristic("45"));
        tamanhoValue.add(new OptionValueCharacteristic("46"));
        tamanhoValue.add(new OptionValueCharacteristic("47"));
        tamanhoValue.add(new OptionValueCharacteristic("48"));
        tamanhoValue.add(new OptionValueCharacteristic("49"));
        tamanhoValue.add(new OptionValueCharacteristic("50"));
        tamanhoValue.add(new OptionValueCharacteristic("51"));
        tamanhoValue.add(new OptionValueCharacteristic("52"));
        tamanhoValue.add(new OptionValueCharacteristic("53"));
        tamanhoValue.add(new OptionValueCharacteristic("54"));
        tamanhoValue.add(new OptionValueCharacteristic("55"));
        tamanhoValue.add(new OptionValueCharacteristic("56"));
        tamanhoValue.add(new OptionValueCharacteristic("57"));
        tamanhoValue.add(new OptionValueCharacteristic("58"));
        tamanhoValue.add(new OptionValueCharacteristic("59"));
        tamanhoValue.add(new OptionValueCharacteristic("60"));
        tamanhoValue.add(new OptionValueCharacteristic("61"));
        tamanhoValue.add(new OptionValueCharacteristic("62"));
        tamanhoValue.add(new OptionValueCharacteristic("63"));
        tamanhoValue.add(new OptionValueCharacteristic("64"));
        tamanhoValue.add(new OptionValueCharacteristic("65"));
        tamanhoValue.add(new OptionValueCharacteristic("66"));
        tamanhoValue.add(new OptionValueCharacteristic("67"));
        tamanhoValue.add(new OptionValueCharacteristic("68"));
        tamanhoValue.add(new OptionValueCharacteristic("69"));
        tamanhoValue.add(new OptionValueCharacteristic("70"));
        tamanhoValue.add(new OptionValueCharacteristic("71"));
        tamanhoValue.add(new OptionValueCharacteristic("72"));
        tamanhoValue.add(new OptionValueCharacteristic("73"));
        tamanhoValue.add(new OptionValueCharacteristic("74"));
        tamanhoValue.add(new OptionValueCharacteristic("75"));
        Characteristic tamanho = new Characteristic("TAMANHO", ValueTypeCharacteristic.MULTISELECAO, tamanhoValue, CharacteristicOrigin.PRODUCT);
        this.service.save(tamanho);
        tamanho = buddySeedControlService.saveSeedIntegrationFromBuddy(tamanho, service);
        tamanho.getValues().stream().forEach(optionValueCharacteristic -> {
            buddySeedControlService.saveSeedIntegrationFromBuddy(optionValueCharacteristic, optionValueCharacteristic.getId());
        });
        tamanho.setIntegrationId(tamanho.getId());
        service.save(tamanho);

        List<OptionValueCharacteristic> corValue = new ArrayList<>();
        corValue.add(new OptionValueCharacteristic("PRETO"));
        corValue.add(new OptionValueCharacteristic("BRANCO"));
        corValue.add(new OptionValueCharacteristic("CINZA"));
        corValue.add(new OptionValueCharacteristic("AMARELO"));
        corValue.add(new OptionValueCharacteristic("AZUL"));
        corValue.add(new OptionValueCharacteristic("VERMELHO"));
        corValue.add(new OptionValueCharacteristic("VERDE"));
        corValue.add(new OptionValueCharacteristic("ROXO"));
        corValue.add(new OptionValueCharacteristic("LARANJA"));
        corValue.add(new OptionValueCharacteristic("MARROM"));
        corValue.add(new OptionValueCharacteristic("ROSA"));
        corValue.add(new OptionValueCharacteristic("BEGE"));
        corValue.add(new OptionValueCharacteristic("PRATA"));
        corValue.add(new OptionValueCharacteristic("DOURADO"));
        corValue.add(new OptionValueCharacteristic("PINK"));
        corValue.add(new OptionValueCharacteristic("LILÁS"));
        corValue.add(new OptionValueCharacteristic("BORDÔ"));
        corValue.add(new OptionValueCharacteristic("VIOLETA"));
        corValue.add(new OptionValueCharacteristic("SEM COR"));
        Characteristic cores = new Characteristic("CORES", ValueTypeCharacteristic.MULTISELECAO, corValue, CharacteristicOrigin.PRODUCT);
        this.service.save(cores);
        cores = buddySeedControlService.saveSeedIntegrationFromBuddy(cores, service);
        cores.setIntegrationId(cores.getId());
        cores.getValues().stream().forEach(optionValueCharacteristic -> {
            buddySeedControlService.saveSeedIntegrationFromBuddy(optionValueCharacteristic, optionValueCharacteristic.getId());
        });
        service.save(cores);
    }


}

