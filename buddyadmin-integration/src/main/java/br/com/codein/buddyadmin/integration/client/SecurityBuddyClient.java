package br.com.codein.buddyadmin.integration.client;

import br.com.codein.buddyadmin.domain.exception.OrganizationException;
import br.com.codein.buddyadmin.domain.exception.UserException;
import br.com.codein.buddyadmin.infrastructure.config.ApplicationConstants;
import br.com.gumga.security.domain.model.instance.Instance;
import br.com.gumga.security.domain.model.instance.Role;
import br.com.gumga.security.domain.model.institutional.Organization;
import br.com.gumga.security.domain.model.institutional.User;
import br.com.gumga.security.domain.model.softwarehouse.Software;
import br.com.gumga.security.gateway.RoleAndList;
import com.fasterxml.jackson.databind.type.CollectionType;
import io.gumga.core.GumgaThreadScope;
import io.gumga.core.QueryObject;
import io.gumga.core.SearchResult;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.web.client.HttpClientErrorException;

import java.time.Instant;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Properties;

@Component
public class SecurityBuddyClient extends AbstractClient<Object> {


    @Autowired
    private ApplicationConstants gumgaValues;

    private Properties properties;

    public SecurityBuddyClient() {
        super();
        this.url = getProperties().getProperty("security.url") +
                "/security-api";
    }


    private Properties getProperties() {
        if (gumgaValues == null)
            gumgaValues = new ApplicationConstants();

        if (properties == null)
            properties = gumgaValues.getCustomFileProperties();

        return properties;
    }

    //<editor-fold desc="Organization">
    public Organization changeOrganization(Long id) {
        ResponseEntity<Object> response =
                this.get("/publicoperations/token/changeorganization/"
                        .concat(GumgaThreadScope.gumgaToken.get())
                        .concat("/")
                        .concat(id.toString()));
        return translate(response.getBody(), Organization.class);
    }


    public Organization getOrganization(Long id) {
        ResponseEntity<Object> response =
                this.get("/api/organization/".concat(id.toString()));
        return translate(response.getBody(), Organization.class);
    }

    public Organization saveOrganization(Organization org) {
        ResponseEntity<Object> response = null;
        try {
            if (org.getId() == null) {
                response = this.post("/api/organization/", org);
            } else {
                response = this.put("/api/organization/".concat(org.getId().toString()), org);
            }
        } catch (HttpClientErrorException e) {
            throw new OrganizationException("Error while saving organization, there is already an organization with this name");
        }

        return translate(((LinkedHashMap) response.getBody()).get("data"), Organization.class);
    }

    public List<Organization> getByInternalCode(String internalCode) {
        ResponseEntity<Object> response = this.get("/api/organization/byinternalcode/".concat(internalCode));
        CollectionType type = createListType(Organization.class);
        return translate(((LinkedHashMap) response.getBody()).get("data"), type);
    }

    public void addUserInOrganization(User user, Organization organization) {
        if (user.getId() == null) {
            throw new UserException("Invalid user. It doesn't have an ID.");
        }
        if (organization.getId() == null) {
            throw new OrganizationException("Invalid organization. Id doesn't have an ID.");
        }
        this.get("/api/gumga-security/simple-add-user-organization/".concat(user.getId().toString()).concat("/").concat(organization.getId().toString()));

    }

    public void removeUserFromOrganization(User user, Organization organization) {
        if (user.getId() == null) {
            throw new UserException("Invalid user. It doesn't have an ID.");
        }
        if (organization.getHierarchyCode() == null) {
            throw new OrganizationException("Invalid organization. Id doesn't have an hierarchy code.");
        }
        this.get("/api/gumga-security/remove-user-organization/".concat(user.getId().toString()).concat("/").concat(organization.getHierarchyCode().toString()));
    }


    //</editor-fold>

    //<editor-fold desc="User">
    public User saveUser(User user) {
        ResponseEntity<Object> response = null;
        try {
            if (user.getId() == null) {
                response = this.post("/api/user/", user);
            } else {
                response = this.put("/api/user/".concat(user.getId().toString()), user);
            }
        } catch (HttpClientErrorException e) {
            throw new UserException("Error while saving entity, there is already an user with this login");
        }

        return translate(((LinkedHashMap) response.getBody()).get("data"), User.class);
    }

    public User getUserByEmail(String email) {
        ResponseEntity<Object> response =
                this.get("/api/gumga-security/user-by-email/".concat(email).concat("/"));
        return translate(response.getBody(), User.class);
    }

    public List<User> getUsersFromOrganization() {
        ResponseEntity<Object> response = this.get("/api/user/?aq=' obj.organizations'");
        return translate(response.getBody(), createListType(User.class));
    }
    //</editor-fold>

    //<editor-fold desc="Software">
    public Software searchSoftware(QueryObject queryObject) {
        ResponseEntity<Object> response = this.search("/api/software/", queryObject);
        setModulesNull((LinkedHashMap) ((List) ((LinkedHashMap) response.getBody()).get("values")).get(0));
        return translate(((List) ((LinkedHashMap) response.getBody()).get("values")).get(0), Software.class);
    }

    private void setModulesNull(LinkedHashMap<String, Object> software) {
        software.put("modules", new ArrayList<>());
    }
    //</editor-fold>

    //<editor-fold desc="Instance">
    public Instance saveInstance(Instance instance) {
        ResponseEntity<Object> response = null;
        try {
            if (instance.getId() == null) {
                response = this.post("/api/instance/", instance);
            } else {
                response = this.put("/api/instance/".concat(instance.getId().toString()), instance);
            }
        } catch (HttpClientErrorException e) {
            throw new OrganizationException("Error while saving instance, there is already an instance with this name");
        }

        return translate(((LinkedHashMap) response.getBody()).get("data"), Instance.class);
    }

    public Instance getInstance(Long id) {
        ResponseEntity<Object> response =
                this.get("/api/instance/".concat(id.toString()));
        ((List) ((LinkedHashMap) response.getBody()).get("softwares")).stream().forEach(soft ->
                setModulesNull((LinkedHashMap<String, Object>) soft));
        return translate(response.getBody(), Instance.class);
    }

    public List<Instance> searchInstance(QueryObject queryObject) {
        ResponseEntity<Object> response = this.search("/api/instance/", queryObject);
        CollectionType type = createListType(Instance.class);
        return translate((((LinkedHashMap) response.getBody()).get("values")), type);
    }
    //</editor-fold>

    //<editor-fold desc="Role">
    public Role saveRole(Role role) {
        ResponseEntity<Object> response;
        if (role.getId() == null) {
            response = this.post("/api/role/saveall", role);
        } else {
            response = this.put("/api/role/".concat(role.getId().toString()), role);
        }
        return translate(((LinkedHashMap) response.getBody()).get("data"), Role.class);
    }

    public Role saveRoleAndList(RoleAndList role) {
        ResponseEntity<Object> response = this.post("/api/role/saveall", role);
        return translate(((LinkedHashMap) response.getBody()).get("data"), Role.class);
    }

    public Role getRole(Long roleId) {
        ResponseEntity<Object> response = this.get("/api/role/".concat(roleId.toString()));
        return translate(response.getBody(), Role.class);
    }

    public void addUserInRole(User user, Role role) {
        if (user.getId() == null) {
            throw new UserException("Invalid user. It doesn't have an ID.");
        }
        if (role.getId() == null) {
            throw new OrganizationException("Invalid role. Id doesn't have an ID.");
        }
        this.get("/api/gumga-security/add-user-role/".concat(user.getId().toString()).concat("/").concat(role.getId().toString()));
    }

    public void removeUserFromRole(User user, Role role) {
        if (user.getId() == null) {
            throw new UserException("Invalid user. It doesn't have an ID.");
        }
        if (role.getId() == null) {
            throw new OrganizationException("Invalid role. Id doesn't have an ID.");
        }
        this.get("/api/gumga-security/remove-user-role/".concat(user.getId().toString()).concat("/").concat(role.getId().toString()));
    }

    public List<Role> searchRole(QueryObject queryObject) {
        ResponseEntity<Object> response = this.search("/api/role/", queryObject);
        CollectionType type = createListType(Role.class);
        return translate((((LinkedHashMap) response.getBody()).get("values")), type);
    }


    //</editor-fold>
}

