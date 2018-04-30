package br.com.codein.buddyadmin.infrastructure.config;

import java.util.HashMap;
import java.util.Map;
import java.util.Properties;

import javax.sql.DataSource;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import io.gumga.core.GumgaValues;
import liquibase.integration.spring.SpringLiquibase;

@Configuration
public class LiquibaseConfiguration {

    @Autowired
    private GumgaValues gumgaValues;    
    

    public static final String PROP_SCHEMA_NAME = "schema.name";
    public static final String PROP_SCHEMA_AUD_NAME = "schema.aud.name";

    public static final String PARAM_SCHEMA_DEFAULT = "schema.default";
    public static final String PARAM_SCHEMA_AUD = "schema.aud";

    @Bean
    public SpringLiquibase liquibase(DataSource ds) {
    	
    	Properties properties = this.gumgaValues.getCustomFileProperties();

        Map<String, String> param = new HashMap<>();
        param.put(LiquibaseConfiguration.PARAM_SCHEMA_DEFAULT, properties.getProperty(LiquibaseConfiguration.PROP_SCHEMA_NAME));
        param.put(LiquibaseConfiguration.PARAM_SCHEMA_AUD, properties.getProperty(LiquibaseConfiguration.PROP_SCHEMA_AUD_NAME));
    	
    	
        SpringLiquibase liquibase = new SpringLiquibase();
        liquibase.setDataSource(ds);
        liquibase.setDropFirst(false);
        liquibase.setDefaultSchema(properties.getProperty(LiquibaseConfiguration.PROP_SCHEMA_NAME));
        liquibase.setChangeLogParameters(param);
        liquibase.setChangeLog("classpath:/liquibase/changelog-master.xml");
        return liquibase;
    }


}
