package br.com.codein.buddyadmin.integration.client.fashionmanager;

import br.com.mobiage.mobiage.domain.model.department.Department;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;

import java.util.List;

/**
 * Created by gelatti on 22/02/17.
 */
@Component
public class DepartmentClient extends FashionManagerClient<Department> {

    public List<Department> save(List<Department> departments){
        ResponseEntity<List<Department>> response;
        response = this.postArray("/api/department/array", departments);
        return response.getBody();
    }
}
