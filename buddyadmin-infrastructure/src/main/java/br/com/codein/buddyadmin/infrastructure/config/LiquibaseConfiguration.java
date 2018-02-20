package br.com.codein.buddyadmin.infrastructure.config;

import io.gumga.core.GumgaValues;
import liquibase.integration.spring.SpringLiquibase;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import javax.sql.DataSource;

@Configuration
public class LiquibaseConfiguration {

    @Autowired
    private GumgaValues gumgaValues;

    @Bean
    public SpringLiquibase liquibase(DataSource ds) {
        SpringLiquibase liquibase = new SpringLiquibase();
        liquibase.setDataSource(ds);
        liquibase.setDropFirst(false);
        liquibase.setDefaultSchema(gumgaValues.getCustomFileProperties().getProperty("schema.name"));
        liquibase.setChangeLog("classpath:/liquibase/changelog-master.xml");
        return liquibase;
    }


}
