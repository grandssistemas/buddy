package br.com.codein.buddyadmin.api;

import io.gumga.security.ApiOperationTranslator;
import org.springframework.stereotype.Component;

import java.util.Arrays;
import java.util.List;

@Component
public class GumgaRegexApiOperationTranslator implements ApiOperationTranslator {

    private final List<OperationExpression> operations = Arrays.asList(
            new OperationExpression("ALL_OPERATIONS", ".*", ".*")
    );

    public String getOperation(String url, String method) {
        for (OperationExpression oe : operations) {
            if (url.matches(oe.url) && method.matches(oe.method)) {
                return oe.operation;
            }
        }
        return "NOOP";

    }

    class OperationExpression {

        public String url, method, operation;

        public OperationExpression(String operation, String url, String method) {
            this.url = url;
            this.method = method;
            this.operation = operation;
        }

    }

}
