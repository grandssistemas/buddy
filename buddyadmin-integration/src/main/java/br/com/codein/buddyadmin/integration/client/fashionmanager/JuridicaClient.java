package br.com.codein.buddyadmin.integration.client.fashionmanager;


import br.com.codein.buddyperson.domain.person.Juridica;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;

@Component
public class JuridicaClient extends FashionManagerClient<Juridica> {


        public Juridica save(Juridica j){
            ResponseEntity<Juridica> response;
            if (j.getId() == null){
                    response = this.post("/api/person/fromadmin",j);
            } else {
                response = this.put("/api/juridica",j);
            }

            return response.getBody();
        }


}
