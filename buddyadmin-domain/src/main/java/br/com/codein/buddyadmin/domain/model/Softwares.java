package br.com.codein.buddyadmin.domain.model;

/**
 * Created by luizaugusto on 08/11/16.
 */
public enum Softwares {
    BUDDY_ADMIN("Admin","br.com.codein.buddyadmin"),
    FASHION_MANAGER("Fashion Manager","Fashion Manager"),
    SECURITY("Segurança","br.com.gumga.security"),
    RUPTURA("Ruptura","br.com.sgsistemas.ruptura")

    ;

    private final String label;
    private final String softwareName;

    Softwares(String label, String softwareName) {
        this.label = label;
        this.softwareName = softwareName;
    }

    public String getLabel() {
        return label;
    }

    public String getName(){
        return name();
    }

    public String getSoftwareName() {
        return softwareName;
    }


}
