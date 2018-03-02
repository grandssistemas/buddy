package br.com.codein.buddyadmin.infrastructure.config;

import io.gumga.core.GumgaValues;
import org.springframework.stereotype.Component;

@Component
public class ApplicationConstants implements GumgaValues {

    @Override
    public String getGumgaSecurityUrl() {
        System.out.println(this.getCustomFileProperties().toString());
        System.out.println("TESTE");
        return this.getCustomFileProperties().get("security.url") +"/security-api/publicoperations";
    }

    @Override
    public boolean isLogActive() {
        return true;
    }

    @Override
    public String getCustomPropertiesFileName() {
        return "buddyadmin.properties";
    }

}
