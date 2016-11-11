package br.com.codein.buddyadmin.integration.client.fashionmanager;

import br.com.codein.buddyadmin.infrastructure.config.ApplicationConstants;
import br.com.codein.buddyadmin.integration.client.AbstractClient;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.Properties;

abstract class FashionManagerClient<T> extends AbstractClient<T> {
    @Autowired
    private ApplicationConstants gumgaValues;

    private Properties properties;

    public FashionManagerClient() {
        super();
        this.url = getProperties().getProperty("fashionmanager.url") +
                "/fashionmanager-api";
    }


    private Properties getProperties() {
        if (gumgaValues == null)
            gumgaValues = new ApplicationConstants();

        if (properties == null)
            properties = gumgaValues.getCustomFileProperties();

        return properties;
    }
}
