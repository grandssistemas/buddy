package br.com.codein.buddyadmin.seed;

import br.com.mobiage.mobiage.application.service.buddyseed.BuddySeedControlService;
import br.com.mobiage.mobiage.application.service.fiscalgroup.PersonGroupService;
import br.com.mobiage.mobiage.application.service.product.ProductGroupService;
import br.com.mobiage.mobiage.domain.model.fiscal.PersonGroup;
import br.com.mobiage.mobiage.domain.model.product.ProductGroup;
import io.gumga.domain.seed.AppSeed;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.io.IOException;

/**
 * Created by gelatti on 17/02/17.
 */
@Component
public class ProductGroupSeed implements AppSeed {

    @Autowired
    private ProductGroupService service;

    @Autowired
    private BuddySeedControlService buddySeedControlService;



    @Override
    @Transactional
    public void loadSeed() throws IOException {
        if(service.findAll().isEmpty()){
            ProductGroup productGroup = new ProductGroup("Grupo de produto fiscal", "Grupo de produto fiscal padrão");
            this.service.save(productGroup);
            buddySeedControlService.saveSeedIntegrationFromBuddy(productGroup, service);
        }
    }

}

