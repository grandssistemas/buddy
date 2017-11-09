package br.com.codein.buddyadmin.seed;

import br.com.mobiage.mobiage.application.service.characteristic.CharacteristicService;
import br.com.mobiage.mobiage.domain.model.characteristic.AssociativeCharacteristic;
import br.com.mobiage.mobiage.domain.model.characteristic.Characteristic;
import br.com.mobiage.mobiage.domain.model.characteristic.enums.CharacteristicOrigin;
import br.com.mobiage.mobiage.domain.model.characteristic.enums.ValueTypeCharacteristic;
import br.com.mobiage.mobiage.application.service.person.RoleService;
import br.com.mobiage.mobiage.domain.model.person.GroupRoleAttribute;
import br.com.mobiage.mobiage.domain.model.person.Role;
import br.com.mobiage.mobiage.domain.model.person.enums.RoleCategory;
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
        throw new RuntimeException("Esse metodo necesita de atualização");
//        if (roleService.recoverByCategory(RoleCategory.OWNER).isEmpty())
//            generateRole(RoleCategory.OWNER, "#ff0000");
//        if (roleService.recoverByCategory(RoleCategory.DISTRIBUTOR).isEmpty())
//            generateRole(RoleCategory.DISTRIBUTOR, "#00ff00");
//        if (roleService.recoverByCategory(RoleCategory.COMPANY).isEmpty())
//            generateRole(RoleCategory.COMPANY, "#c283b5");
//        if (roleService.recoverByCategory(RoleCategory.AGGREGATOR).isEmpty())
//            generateRole(RoleCategory.AGGREGATOR, "#26ffd2");
    }

    public Role generateRole(RoleCategory cat, String color){
        throw new RuntimeException("Esse metodo necesita de atualização");
// Characteristic ch = new Characteristic();
//        ch.setName("Nome");
//        ch.setTipoDeValorCaracteristica(ValueTypeCharacteristic.TEXTO);
//        ch.setValues(new ArrayList<>());
//        ch.setOrigin(CharacteristicOrigin.PERSON);
//
//        characteristicService.save(ch);
//
//        AssociativeCharacteristic att = new AssociativeCharacteristic();
//        att.setIsRequired(false);
//        att.setCharacteristic(ch);
//
//
//        GroupRoleAttribute gra = new GroupRoleAttribute();
//        gra.setName("Dados");
//        gra.setAttributes(Collections.singletonList(att));
//
//        Role role = new Role();
//
//        role.setName(cat.getLabel());
//        role.setCategory(cat);
//        role.setColor(color);
//        role.setGroupAttributes(Collections.singletonList(gra));
//
//        roleService.save(role);
//        return role;
    }
}
