package br.com.codein.buddyadmin.application.utils;

import org.springframework.stereotype.Component;

import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 * Created by luizaugusto on 08/11/16.
 */
@Component
public class StringUtils {

    public String extractOrgIdFromOi(String oi){
        Pattern p = Pattern.compile("\\d*\\.$");
        Matcher m = p.matcher(oi);
        if (m.find()){
            return m.group(0).replace(".","");
        }
        return "";
    }
}
