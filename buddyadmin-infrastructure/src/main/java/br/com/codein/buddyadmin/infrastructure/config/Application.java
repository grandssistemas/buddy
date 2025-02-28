package br.com.codein.buddyadmin.infrastructure.config;

import io.gumga.application.GumgaRepositoryFactoryBean;
import io.gumga.application.spring.config.DatabaseConfigSupport;
import io.gumga.core.GumgaValues;
import liquibase.integration.spring.SpringLiquibase;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.config.PropertyPlaceholderConfigurer;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.orm.jpa.JpaTransactionManager;
import org.springframework.orm.jpa.LocalContainerEntityManagerFactoryBean;
import org.springframework.orm.jpa.vendor.HibernateJpaVendorAdapter;
import org.springframework.transaction.PlatformTransactionManager;
import org.springframework.transaction.annotation.EnableTransactionManagement;

import javax.persistence.EntityManagerFactory;
import javax.sql.DataSource;
import java.util.Properties;


@Configuration
@ComponentScan(basePackages = {
        "br.com.codein",
        "br.com.mobiage.configuration.properties",
//        "br.com.mobiage.configuration.http",
        "br.com.mobiage.mobiage.application.component",
        "br.com.mobiage.mobiage.application.service.person",
        "br.com.mobiage.mobiage.application.service.fiscalgroup",
        "br.com.mobiage.mobiage.application.service.configuration",
        "br.com.mobiage.mobiage.application.service.characteristic",
        "br.com.mobiage.mobiage.application.service.marking",
        "br.com.mobiage.mobiage.application.service.department",
        "br.com.mobiage.mobiage.application.service.storage",
        "br.com.mobiage.mobiage.application.service.dfe",
        "br.com.mobiage.mobiage.application.service.certificado",
        "br.com.mobiage.mobiage.application.service.paymenttype",
        "br.com.mobiage.mobiage.application.service.operation",
        "br.com.mobiage.mobiage.application.service.product",
        "br.com.mobiage.mobiage.application.service.businessrule",
        "br.com.mobiage.mobiage.application.service.tributador",
        "br.com.mobiage.mobiage.application.service.buddyseed",
        "br.com.mobiage.mobiage.application.service.genericreport",
        "br.com.mobiage.mobiage.application.service.product",
        "br.com.mobiage.integration",
        "br.com.mobiage.mobiage.presentation.api.person",
        "br.com.mobiage.mobiage.presentation.api.fiscalgroup",
        "br.com.mobiage.mobiage.presentation.api.configuration",
        "br.com.mobiage.mobiage.presentation.api.characteristic",
        "br.com.mobiage.mobiage.presentation.api.marking",
        "br.com.mobiage.mobiage.presentation.api.department",
        "br.com.mobiage.mobiage.presentation.api.paymenttype",
        "br.com.mobiage.mobiage.presentation.api.operation",
        "br.com.mobiage.mobiage.presentation.api.businessrule",
        "br.com.mobiage.mobiage.presentation.api.tributador",
        "br.com.mobiage.mobiage.presentation.api.genericreport",
        "br.com.mobiage.mobiage.presentation.api.product",
        "br.com.mobiage.mobiage.gateway.dto.businessrole",
        "br.com.mobiage.mobiage.gateway.dto.department",
        "br.com.mobiage.mobiage.gateway.dto.operation",
        "br.com.mobiage.mobiage.gateway.dto.paymenttype",
        "br.com.mobiage.mobiage.gateway.dto.person",
        "br.com.mobiage.mobiage.gateway.dto.tributador",
        "br.com.mobiage.mobiage.gateway.dto.businessrole",
        "br.com.mobiage.mobiage.gateway.dto.translator",
        "io.gumga"
})


@EnableJpaRepositories(repositoryFactoryBeanClass = GumgaRepositoryFactoryBean.class, basePackages = {
        "br.com.codein",
        "br.com.mobiage.mobiage.application.repository.person",
        "br.com.mobiage.mobiage.application.repository.fiscalgroup",
        "br.com.mobiage.mobiage.application.repository.configuration",
        "br.com.mobiage.mobiage.application.repository.characteristic",
        "br.com.mobiage.mobiage.application.repository.marking",
        "br.com.mobiage.mobiage.application.repository.department",
        "br.com.mobiage.mobiage.application.repository.storage",
        "br.com.mobiage.mobiage.application.repository.certificado",
        "br.com.mobiage.mobiage.application.repository.paymenttype",
        "br.com.mobiage.mobiage.application.repository.operation",
        "br.com.mobiage.mobiage.application.repository.product",
        "br.com.mobiage.mobiage.application.repository.businessrule",
        "br.com.mobiage.mobiage.application.repository.tributador",
        "br.com.mobiage.mobiage.application.repository.buddyseed",
        "br.com.mobiage.mobiage.application.repository.genericreport",
        "io.gumga"
})
@EnableTransactionManagement(proxyTargetClass = true)
public class Application {

    @Autowired
    private static GumgaValues gumgaValues;

    private static Properties properties;

    private static Properties getProperties() {
        if (gumgaValues == null)
            gumgaValues = new ApplicationConstants();

        if (properties == null)
            properties = gumgaValues.getCustomFileProperties();

        return properties;
    }

    @Bean
    public static PropertyPlaceholderConfigurer dataConfigPropertyConfigurer() {
        PropertyPlaceholderConfigurer configurer = new PropertyPlaceholderConfigurer();
        configurer.setSearchSystemEnvironment(true);
        return configurer;
    }

    @Bean
    public static DataSource dataSource() {
//        StringBuilder databaseURL = new StringBuilder();
//        databaseURL.append("jdbc:postgresql://");
//        databaseURL.append(getProperties().getProperty("database.url"));
//        databaseURL.append("/").append(getProperties().getProperty("database.name"));
//        databaseURL.append("?currentSchema=").append(getProperties().getProperty("schema.name"));
//
//        return new DatabaseConfigSupport().getDataSourceProvider(DatabaseConfigSupport.Database.POSTGRES).
//                createDataSource(databaseURL.toString(),
//                        getProperties().getProperty("database.user"),
//                        getProperties().getProperty("database.password"));

        return new DatabaseConfigSupport().getDataSourceProvider(DatabaseConfigSupport.Database.POSTGRES).
                createDataSource(getDatabaseURL(getProperties().getProperty("schema.name")),
                        getProperties().getProperty("database.user"),
                        getProperties().getProperty("database.password"));
    }

    private static String getDatabaseURL(String property) {
        StringBuilder databaseURL = new StringBuilder();
        databaseURL.append("jdbc:postgresql://");
        databaseURL.append(getProperties().getProperty("database.url"));
        databaseURL.append("/").append(getProperties().getProperty("database.name"));
        databaseURL.append("?currentSchema=").append(property);
        return databaseURL.toString();
    }

    @Bean
    @Autowired
    public LocalContainerEntityManagerFactoryBean entityManagerFactory(DataSource dataSource) {
        HibernateJpaVendorAdapter vendorAdapter = new HibernateJpaVendorAdapter();

        Properties properties = new Properties();
        properties.put("eclipselink.weaving", "false");
        properties.put("hibernate.hbm2ddl.auto", "none");

        properties.put("hibernate.dialect", "org.hibernate.dialect.PostgreSQLDialect");
        properties.put("hibernate.ejb.naming_strategy", "org.hibernate.cfg.EJB3NamingStrategy");
        properties.put("hibernate.show_sql", "false");
//        properties.put("hibernate.format_sql", "true");
        properties.put("hibernate.connection.charSet", "UTF-8");
        properties.put("hibernate.connection.characterEncoding", "UTF-8");
        properties.put("hibernate.connection.useUnicode", "true");
        properties.put("hibernate.jdbc.batch_size", "55");
        properties.put("org.hibernate.envers.default_schema", getProperties().getProperty("schema.aud.name"));

        properties.put("liquibase.enabled", "false");
//        properties.put("liquibase.drop-first", "false");
//        properties.put("liquibase.change-log", "src/main/resources/liquibase/changelog-master.xml");

        LocalContainerEntityManagerFactoryBean factory = new LocalContainerEntityManagerFactoryBean();
        factory.setJpaVendorAdapter(vendorAdapter);
        factory.setPackagesToScan(
                "io.gumga.domain",
                "br.com.codein",
                "br.com.mobiage.mobiage.domain.model.person",
                "br.com.mobiage.mobiage.domain.model.fiscal",
                "br.com.mobiage.mobiage.domain.model.configuration",
                "br.com.mobiage.mobiage.domain.model.characteristic",
                "br.com.mobiage.mobiage.domain.model.marking",
                "br.com.mobiage.mobiage.domain.model.department",
                "br.com.mobiage.mobiage.domain.model.storage",
                "br.com.mobiage.mobiage.domain.model.paymenttype",
                "br.com.mobiage.mobiage.domain.model.operation",
                "br.com.mobiage.mobiage.domain.model.businessrule",
                "br.com.mobiage.mobiage.domain.model.product",
                "br.com.mobiage.mobiage.domain.model.tributador",
                "br.com.mobiage.mobiage.domain.model.certificado",
                "br.com.mobiage.mobiage.domain.model.buddyseed",
                "br.com.mobiage.mobiage.domain.model.genericreport",
                "br.com.mobiage.mobiage.domain.model.product"
        );
        factory.setDataSource(dataSource);

        factory.setJpaProperties(properties);
        factory.afterPropertiesSet();

        return factory;
    }

//    @Bean
//    public static SpringLiquibase liquibase() {
//        SpringLiquibase liquibase = new SpringLiquibase();
//        liquibase.setDataSource(dataSource());
//        liquibase.setDropFirst(false);
//        liquibase.setChangeLog("classpath:/liquibase/changelog-master.xml");
//        return liquibase;
//    }

    @Bean
    @Autowired
    public PlatformTransactionManager transactionManager(EntityManagerFactory emf) {
        return new JpaTransactionManager(emf);
    }

}

