package br.com.codein.buddyadmin.infrastructure.config.http;

import io.gumga.core.GumgaThreadScope;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;

public class BuddyadminUtil {
    private BuddyadminUtil() {}

    private static HttpHeaders getHttpHeaders() {
        HttpHeaders headers = new HttpHeaders();
        headers.set("Accept", "application/json, text/plain, */*");
        headers.set("Accept-Encoding", "gzip, deflate");
        headers.set("Content-Type", "application/json;charset=utf-8");
        headers.set("gumgaToken", GumgaThreadScope.gumgaToken.get());
        return headers;
    }

    public static HttpEntity getHttpEntity(Object value) {
        return new HttpEntity(value, BuddyadminUtil.getHttpHeaders());
    }

    public static HttpEntity getHttpEntity() {
        return new HttpEntity(BuddyadminUtil.getHttpHeaders());
    }

    public static HttpHeaders getHttpHeadersJustGumgaToken() {
        HttpHeaders headers = new HttpHeaders();
        headers.set("gumgaToken", GumgaThreadScope.gumgaToken.get());
        return headers;
    }

    public static HttpHeaders getHttpHeadersWithoutGumgaToken() {
        HttpHeaders headers = new HttpHeaders();
        headers.set("Accept", "application/json, text/plain, */*");
        headers.set("Accept-Encoding", "gzip, deflate");
        headers.set("Content-Type", "application/json;charset=utf-8");
        return headers;
    }
}
