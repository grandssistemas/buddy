package br.com.codein.buddyadmin.infrastructure.config.http;

import io.gumga.presentation.CustomGumgaRestTemplate;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClients;
import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.http.client.HttpComponentsClientHttpRequestFactory;
import org.springframework.http.converter.HttpMessageConverter;
import org.springframework.http.converter.json.MappingJackson2HttpMessageConverter;
import org.springframework.stereotype.Component;

import java.util.Arrays;
import java.util.List;

@Component
@Order(Ordered.HIGHEST_PRECEDENCE)
public class BuddyadminGumgaRestTemplate implements CustomGumgaRestTemplate {

    @Override
    public HttpComponentsClientHttpRequestFactory getRequestFactory() {
        CloseableHttpClient httpClient = HttpClients.custom().setUserAgent("buddyadmin-api").build();
        HttpComponentsClientHttpRequestFactory requestFactory = new HttpComponentsClientHttpRequestFactory();
        requestFactory.setHttpClient(httpClient);
        return requestFactory;
    }


    @Override
    public List<HttpMessageConverter<?>> getMessageConverters() {
        return Arrays.asList(new MappingJackson2HttpMessageConverter());
    }
}
