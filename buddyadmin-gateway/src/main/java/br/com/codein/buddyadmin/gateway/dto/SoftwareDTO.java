package br.com.codein.buddyadmin.gateway.dto;

import br.com.codein.buddyadmin.domain.model.Softwares;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

/**
 * Created by luizaugusto on 16/12/16.
 */
public class SoftwareDTO {
    private String key;
    private String label;

    public SoftwareDTO(Softwares softwares){
        this.key = softwares.getName();
        this.label = softwares.getLabel();
    }

    public String getKey() {
        return key;
    }

    public void setKey(String key) {
        this.key = key;
    }

    public String getLabel() {
        return label;
    }
    public void setLabel(String label) {
        this.label = label;
    }

    public static List<SoftwareDTO> getValues(){
        List<SoftwareDTO> softwareDTOs = new ArrayList<>();
        Arrays.asList(Softwares.values()).forEach(item->{
            softwareDTOs.add(new SoftwareDTO(item));
        });
        return softwareDTOs;
    }
}
