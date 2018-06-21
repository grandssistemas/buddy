package br.com.codein.buddyadmin.seed;

import br.com.mobiage.mobiage.application.service.buddyseed.BuddySeedControlService;
import br.com.mobiage.mobiage.application.service.characteristic.CharacteristicService;
import br.com.mobiage.mobiage.application.service.characteristic.OptionValueCharacteristicService;
import br.com.mobiage.mobiage.application.service.person.RoleService;
import br.com.mobiage.mobiage.application.service.tributador.FormulaService;
import br.com.mobiage.mobiage.domain.model.characteristic.AssociativeCharacteristic;
import br.com.mobiage.mobiage.domain.model.characteristic.Characteristic;
import br.com.mobiage.mobiage.domain.model.characteristic.OptionValueCharacteristic;
import br.com.mobiage.mobiage.domain.model.characteristic.SpecializationOrigin;
import br.com.mobiage.mobiage.domain.model.characteristic.enums.CharacteristicOrigin;
import br.com.mobiage.mobiage.domain.model.characteristic.enums.ValueTypeCharacteristic;
import br.com.mobiage.mobiage.domain.model.person.GroupRoleAttribute;
import br.com.mobiage.mobiage.domain.model.person.Role;
import br.com.mobiage.mobiage.domain.model.person.enums.RoleCategory;
import br.com.mobiage.mobiage.domain.model.tributador.backend_reader.Formula;
import br.com.mobiage.mobiage.domain.model.tributador.enums.TariffType;
import io.gumga.domain.seed.AppSeed;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

/**
 * Created by gelatti on 17/02/17.
 */
@Component
public class FormulaSeed implements AppSeed {

    @Autowired
    private FormulaService service;
//    @Autowired2acteristicService optionValueCharacteristicService;

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
        Formula f1 = new Formula();
        f1.setName("Base ICMS");
        f1.setTariffType(TariffType.ICMS);
        f1.setFormula("VALOR_PRODUTO");
        this.service.save(f1);
        buddySeedControlService.saveSeedIntegrationFromBuddy(f1, service);

        Formula f2 = new Formula();
        f2.setName("Valor ICMS");
        f2.setTariffType(TariffType.ICMS);
        f2.setFormula("@BASE_ICMS*PERC_ALIQUOTA_ICMS/100");
        this.service.save(f2);
        buddySeedControlService.saveSeedIntegrationFromBuddy(f2, service);

        Formula f3 = new Formula();
        f3.setName("Base PIS");
        f3.setTariffType(TariffType.PIS);
        f3.setFormula("VALOR_PRODUTO");
        this.service.save(f3);
        buddySeedControlService.saveSeedIntegrationFromBuddy(f3, service);

        Formula f4 = new Formula();
        f4.setName("Valor PIS");
        f4.setTariffType(TariffType.PIS);
        f4.setFormula("@BASE_PIS*PERC_ALIQUOTA_PIS/100");
        this.service.save(f4);
        buddySeedControlService.saveSeedIntegrationFromBuddy(f4, service);

        Formula f5 = new Formula();
        f5.setName("Base COFINS");
        f5.setTariffType(TariffType.COFINS);
        f5.setFormula("VALOR_PRODUTO");
        this.service.save(f5);
        buddySeedControlService.saveSeedIntegrationFromBuddy(f5, service);

        Formula f6 = new Formula();
        f6.setName("Valor COFINS");
        f6.setTariffType(TariffType.COFINS);
        f6.setFormula("@BASE_COFINS*PERC_ALIQUOTA_COFINS/100");
        this.service.save(f6);
        buddySeedControlService.saveSeedIntegrationFromBuddy(f6, service);

        Formula f7 = new Formula();
        f7.setName("IPI");
        f7.setTariffType(TariffType.IPI);
        f7.setFormula("0");
        this.service.save(f7);
        buddySeedControlService.saveSeedIntegrationFromBuddy(f7, service);
    }

}

