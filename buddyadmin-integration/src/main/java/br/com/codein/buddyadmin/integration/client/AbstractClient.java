package br.com.codein.buddyadmin.integration.client;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.JavaType;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.type.CollectionType;
import io.gumga.core.GumgaThreadScope;
import io.gumga.core.QueryObject;
import io.gumga.presentation.CustomGumgaRestTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import javax.annotation.PostConstruct;
import java.io.IOException;
import java.lang.reflect.ParameterizedType;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Component
public abstract class AbstractClient<T>{

    private final Class<T> objectClass;
    private HttpHeaders headers;
    private RestTemplate restTemplate;
    private HttpEntity requestEntity;
    private ObjectMapper mapper = new ObjectMapper();
    protected String url;

    @Autowired
    private CustomGumgaRestTemplate buddyadminGumgaRestTemplate;

    public AbstractClient(){
        this.objectClass = (Class<T>) ((ParameterizedType) getClass().getGenericSuperclass()).getActualTypeArguments()[0];
        mapper.getSerializationConfig().withSerializationInclusion(JsonInclude.Include.NON_NULL);
        mapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
    }

    public AbstractClient(String url) {
        this.url = url;
        this.objectClass = (Class<T>) ((ParameterizedType) getClass().getGenericSuperclass()).getActualTypeArguments()[0];
    }

    @PostConstruct
    public void initRestTemplate() {
        this.restTemplate = buddyadminGumgaRestTemplate.getRestTemplate(new RestTemplate());
    }

    protected ResponseEntity<T> get(String url) {
        return this.get(url, new HashMap<>());
    }

    protected ResponseEntity<T> get(String url, Map<String, Object> stringObjectMap) {
        this.headers = new HttpHeaders();
        this.headers.set("Accept", "application/json, text/plain, */*");
        this.headers.set("Accept-Encoding", "gzip, deflate");
        this.headers.set("Content-Type", "application/json;charset=utf-8");
        this.headers.set("gumgaToken", GumgaThreadScope.gumgaToken.get());
        this.requestEntity = new HttpEntity(this.headers);
        return this.restTemplate.exchange(this.url.concat(url), HttpMethod.GET, (HttpEntity<?>) this.requestEntity, objectClass, stringObjectMap);
    }

    protected ResponseEntity<T> post(String url, Object object) {
        this.headers = new HttpHeaders();
        this.headers.set("Accept", "application/json, text/plain, */*");
        this.headers.set("Accept-Encoding", "gzip, deflate");
        this.headers.set("Content-Type", "application/json;charset=utf-8");
        this.headers.set("gumgaToken", GumgaThreadScope.gumgaToken.get());
        this.requestEntity = new HttpEntity(object, this.headers);
        return this.restTemplate.exchange(this.url.concat(url), HttpMethod.POST, this.requestEntity, objectClass);
    }

    protected ResponseEntity<List<T>> postArray(String url, Object object) {
        this.headers = new HttpHeaders();
        this.headers.set("Accept", "application/json, text/plain, */*");
        this.headers.set("Accept-Encoding", "gzip, deflate");
        this.headers.set("Content-Type", "application/json;charset=utf-8");
        this.headers.set("gumgaToken", GumgaThreadScope.gumgaToken.get());
        this.requestEntity = new HttpEntity(object, this.headers);
        ParameterizedTypeReference<List<T>> typeRef = new ParameterizedTypeReference<List<T>>() {
        };
        return this.restTemplate.exchange(this.url.concat(url), HttpMethod.POST, this.requestEntity, typeRef);
    }

    protected ResponseEntity<T> put(String url, Object object) {
        this.headers = new HttpHeaders();
        this.headers.set("Accept", "application/json, text/plain, */*");
        this.headers.set("Accept-Encoding", "gzip, deflate");
        this.headers.set("Content-Type", "application/json;charset=utf-8");
        this.headers.set("gumgaToken", GumgaThreadScope.gumgaToken.get());
        this.requestEntity = new HttpEntity(object, this.headers);
        return this.restTemplate.exchange(this.url.concat(url), HttpMethod.PUT, (HttpEntity<?>) this.requestEntity, objectClass);
    }

    protected ResponseEntity<T> search(String url, QueryObject q){
        this.headers = new HttpHeaders();
        this.headers.set("Accept", "application/json, text/plain, */*");
        this.headers.set("Accept-Encoding", "gzip, deflate");
        this.headers.set("Content-Type", "application/json;charset=utf-8");
        this.headers.set("gumgaToken", GumgaThreadScope.gumgaToken.get());
        this.requestEntity = new HttpEntity(this.headers);

        UriComponentsBuilder builder =
                UriComponentsBuilder.fromHttpUrl(this.url.concat(url))
                        .queryParam("aq",q.getAq())
                        .queryParam("sortDir",q.getSortDir())
                        .queryParam("sortField",q.getSortField())
                        .queryParam("pageSize",q.getPageSize())
                        .queryParam("start",q.getStart())
                        .queryParam("currentPage",q.getCurrentPage());

        if (!(q.getQ().isEmpty() ||q.getSearchFields().length == 0)){
            builder.queryParam("q",q.getQ());
            builder.queryParam("searchFields", q.getSearchFields() == null ? "" : String.join(",",q.getSearchFields()));
        }

        return this.restTemplate.exchange(builder.build().toUriString(), HttpMethod.GET, (HttpEntity<?>) this.requestEntity, objectClass, new HashMap());
    }

    protected <T> T translate(Object obj, Class<T> clazz){
        JavaType type = mapper.getTypeFactory().constructFromCanonical(clazz.getCanonicalName());
        return translate(obj,type);
    }

    protected <T> T translate(Object obj, JavaType type){
        T result = null;

        try {
            byte[] x = mapper.writeValueAsBytes(obj);
            result =  mapper.readValue(x,type);
        } catch (IOException e) {
            e.printStackTrace();
        }
        return result;
    }

    protected <T> CollectionType createListType(Class<T> clazz){
        return mapper.getTypeFactory().constructCollectionType(List.class,clazz);

    }

}
