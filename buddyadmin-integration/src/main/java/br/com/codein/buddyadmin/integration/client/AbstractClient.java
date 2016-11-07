package br.com.codein.buddyadmin.integration.client;

import com.fasterxml.jackson.databind.JavaType;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.type.CollectionType;
import gumga.framework.core.GumgaThreadScope;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import java.io.IOException;
import java.lang.reflect.ParameterizedType;
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

    public AbstractClient(){
        this.objectClass = (Class<T>) ((ParameterizedType) getClass().getGenericSuperclass()).getActualTypeArguments()[0];
    }

    public AbstractClient(String url) {
        this.url = url;
        this.objectClass = (Class<T>) ((ParameterizedType) getClass().getGenericSuperclass()).getActualTypeArguments()[0];
    }

    protected ResponseEntity<T> get(String url) {
        return this.get(url, new HashMap<>());
    }

    protected ResponseEntity<T> get(String url, Map<String, Object> stringObjectMap) {
        this.restTemplate = new RestTemplate();
        this.headers = new HttpHeaders();
        this.headers.set("Accept", "application/json, text/plain, */*");
        this.headers.set("Accept-Encoding", "gzip, deflate");
        this.headers.set("Content-Type", "application/json;charset=utf-8");
        this.headers.set("gumgaToken", GumgaThreadScope.gumgaToken.get());
        this.requestEntity = new HttpEntity(this.headers);
        return this.restTemplate.exchange(this.url.concat(url), HttpMethod.GET, (HttpEntity<?>) this.requestEntity, objectClass, stringObjectMap);
    }

    protected ResponseEntity<T> post(String url, Object object) {
        this.restTemplate = new RestTemplate();
        this.headers = new HttpHeaders();
        this.headers.set("Accept", "application/json, text/plain, */*");
        this.headers.set("Accept-Encoding", "gzip, deflate");
        this.headers.set("Content-Type", "application/json;charset=utf-8");
        this.headers.set("gumgaToken", GumgaThreadScope.gumgaToken.get());
        this.requestEntity = new HttpEntity(object, this.headers);
        return this.restTemplate.exchange(this.url.concat(url), HttpMethod.POST, this.requestEntity, objectClass);
    }

    protected ResponseEntity<T> put(String url, Object object) {
        this.restTemplate = new RestTemplate();
        this.headers = new HttpHeaders();
        this.headers.set("Accept", "application/json, text/plain, */*");
        this.headers.set("Accept-Encoding", "gzip, deflate");
        this.headers.set("Content-Type", "application/json;charset=utf-8");
        this.headers.set("gumgaToken", GumgaThreadScope.gumgaToken.get());
        this.requestEntity = new HttpEntity(object, this.headers);
        return this.restTemplate.exchange(this.url.concat(url), HttpMethod.PUT, (HttpEntity<?>) this.requestEntity, objectClass);
    }

    protected <T> T translate(Object obj, Class<T> clazz){
        T result = null;
        try {
            byte[] x = mapper.writeValueAsBytes(obj);
            result =  mapper.readValue(x,clazz);
        } catch (IOException e) {
            e.printStackTrace();
        }
        return result;
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
