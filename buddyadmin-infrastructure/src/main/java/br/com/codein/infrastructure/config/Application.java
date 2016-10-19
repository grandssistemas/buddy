package br.com.codein.infrastructure.config;

import gumga.framework.application.GumgaRepositoryFactoryBean;
import gumga.framework.application.spring.config.DatabaseConfigSupport;
import gumga.framework.core.GumgaValues;
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
@ComponentScan(basePackages = {"br.com.codein", "gumga.framework"})
@EnableJpaRepositories(repositoryFactoryBeanClass = GumgaRepositoryFactoryBean.class, basePackages = {"br.com.codein", "gumga.framework"})
@EnableTransactionManagement(proxyTargetClass = true)
public class Application {

    @Bean
    public static PropertyPlaceholderConfigurer dataConfigPropertyConfigurer() {
        PropertyPlaceholderConfigurer configurer = new PropertyPlaceholderConfigurer();
        configurer.setSearchSystemEnvironment(true);
        return configurer;
    }
    @Autowired
    private static GumgaValues gumgaValues;

    private static Properties properties;

    private static Properties getProperties() {
        if(gumgaValues == null)
            gumgaValues = new ApplicationConstants();

        if(properties == null)
            properties = gumgaValues.getCustomFileProperties();

        return properties;
    }

    @Bean
    public static DataSource dataSource() {
        StringBuilder databaseURL = new StringBuilder();
        databaseURL.append("jdbc:postgresql://");
        databaseURL.append(getProperties().getProperty("database.url"));
        databaseURL.append("/").append(getProperties().getProperty("database.name"));
        databaseURL.append("?currentSchema=").append(getProperties().getProperty("schema.name"));

        return new DatabaseConfigSupport().getDataSourceProvider(DatabaseConfigSupport.Database.POSTGRES).
                createDataSource(databaseURL.toString(),
                        getProperties().getProperty("database.user"),
                        getProperties().getProperty("database.password"));
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
        //properties.put("hibernate.show_sql", "true");
        //properties.put("hibernate.format_sql", "true");
        properties.put("hibernate.connection.charSet", "UTF-8");
        properties.put("hibernate.connection.characterEncoding", "UTF-8");
        properties.put("hibernate.connection.useUnicode", "true");
        properties.put("hibernate.jdbc.batch_size", "55");

        LocalContainerEntityManagerFactoryBean factory = new LocalContainerEntityManagerFactoryBean();
        factory.setJpaVendorAdapter(vendorAdapter);
        factory.setPackagesToScan("gumga.framework.domain","br.com.codein");
        factory.setDataSource(dataSource);

        factory.setJpaProperties(properties);
        factory.afterPropertiesSet();

        return factory;
    }

    @Bean
    @Autowired
    public PlatformTransactionManager transactionManager(EntityManagerFactory emf) {
        return new JpaTransactionManager(emf);
    }

}
