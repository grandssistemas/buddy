package br.com.codein.buddyadmin.seed;

import br.com.codein.buddycharacteristic.application.service.characteristic.CharacteristicService;
import br.com.codein.buddycharacteristic.domain.characteristic.AssociativeCharacteristic;
import br.com.codein.buddycharacteristic.domain.characteristic.Characteristic;
import br.com.codein.buddycharacteristic.domain.characteristic.enums.CharacteristicOrigin;
import br.com.codein.buddycharacteristic.domain.characteristic.enums.ValueTypeCharacteristic;
import br.com.codein.buddyperson.application.service.person.RoleService;
import br.com.codein.buddyperson.domain.person.GroupRoleAttribute;
import br.com.codein.buddyperson.domain.person.Role;
import br.com.codein.buddyperson.domain.person.enums.RoleCategory;
import io.gumga.domain.seed.AppSeed;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Collections;

@Component
public class RoleSeed implements AppSeed {

    @Autowired
    private RoleService roleService;

    @Autowired
    private CharacteristicService characteristicService;

    @Override
    public void loadSeed() throws IOException {
        if (roleService.recoverByCategory(RoleCategory.OWNER).isEmpty())
            generateRole(RoleCategory.OWNER, "#ff0000");
        if (roleService.recoverByCategory(RoleCategory.DISTRIBUTOR).isEmpty())
            generateRole(RoleCategory.DISTRIBUTOR, "#00ff00");
        if (roleService.recoverByCategory(RoleCategory.COMPANY).isEmpty())
            generateRole(RoleCategory.COMPANY, "#c283b5");
        if (roleService.recoverByCategory(RoleCategory.AGGREGATOR).isEmpty())
            generateRole(RoleCategory.AGGREGATOR, "#26ffd2");
    }

    public Role generateRole(RoleCategory cat, String color){
        Characteristic ch = new Characteristic();
        ch.setName("Nome");
        ch.setTipoDeValorCaracteristica(ValueTypeCharacteristic.TEXTO);
        ch.setValues(new ArrayList<>());
        ch.setOrigin(CharacteristicOrigin.PERSON);

        characteristicService.save(ch);

        AssociativeCharacteristic att = new AssociativeCharacteristic();
        att.setIsRequired(false);
        att.setCharacteristic(ch);


        GroupRoleAttribute gra = new GroupRoleAttribute();
        gra.setName("Dados");
        gra.setAttributes(Collections.singletonList(att));

        Role role = new Role();

        role.setName(cat.getLabel());
        role.setCategory(cat);
        role.setColor(color);
        role.setGroupAttributes(Collections.singletonList(gra));

        roleService.save(role);
        return role;
    }
}
