package br.com.codein.buddyadmin.seed;

import br.com.mobiage.mobiage.application.service.buddyseed.BuddySeedControlService;
import br.com.mobiage.mobiage.application.service.characteristic.CharacteristicService;
import br.com.mobiage.mobiage.application.service.characteristic.OptionValueCharacteristicService;
import br.com.mobiage.mobiage.application.service.person.RoleService;
import br.com.mobiage.mobiage.application.service.product.ProductGroupService;
import br.com.mobiage.mobiage.domain.model.characteristic.AssociativeCharacteristic;
import br.com.mobiage.mobiage.domain.model.characteristic.Characteristic;
import br.com.mobiage.mobiage.domain.model.characteristic.OptionValueCharacteristic;
import br.com.mobiage.mobiage.domain.model.characteristic.SpecializationOrigin;
import br.com.mobiage.mobiage.domain.model.characteristic.enums.CharacteristicOrigin;
import br.com.mobiage.mobiage.domain.model.characteristic.enums.ValueTypeCharacteristic;
import br.com.mobiage.mobiage.domain.model.person.GroupRoleAttribute;
import br.com.mobiage.mobiage.domain.model.person.Role;
import br.com.mobiage.mobiage.domain.model.person.enums.RoleCategory;
import br.com.mobiage.mobiage.domain.model.product.ProductGroup;
import io.gumga.domain.seed.AppSeed;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import javax.persistence.EntityManager;
import javax.persistence.FlushModeType;
import javax.persistence.PersistenceContext;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

/**
 * Created by gelatti on 17/02/17.
 */
@Component
public class RoleSeed implements AppSeed {

    @Autowired
    private RoleService service;
    @Autowired
    private CharacteristicService characteristicService;
    @Autowired
    private OptionValueCharacteristicService optionValueCharacteristicService;

    @Autowired
    private BuddySeedControlService buddySeedControlService;

    @PersistenceContext
    private EntityManager em;

    @Override
    @Transactional
    public void loadSeed() throws IOException {
        if(service.findAll().isEmpty()){

            create();

        }
    }

    @Transactional
    public void create() {
        FlushModeType mode = this.em.getFlushMode();
        this.em.setFlushMode(FlushModeType.COMMIT);
        if (service.recoverByCategory(RoleCategory.CLIENT).isEmpty()) {
            Role client = new Role("Cliente", RoleCategory.CLIENT);
            client.setColor("#1c84c6");
            client.setIntegrationId(1L);
            this.service.save(client);
            buddySeedControlService.saveSeedIntegrationFromBuddy(client, service);
        }
        this.em.flush();

        if (service.recoverByCategory(RoleCategory.PROVIDER).isEmpty()) {
            Role provider = new Role("Fornecedor", RoleCategory.PROVIDER);
            provider.setColor("#f8ac59");
            provider.setIntegrationId(2L);
            this.service.save(provider);
            buddySeedControlService.saveSeedIntegrationFromBuddy(provider, service);
        }
        this.em.flush();

        if (service.recoverByCategory(RoleCategory.TRANSPORTER).isEmpty()) {
            Role transporter = new Role("Transportadora", RoleCategory.TRANSPORTER);
            transporter.setColor("#23c6c8");
            GroupRoleAttribute dadosVei = new GroupRoleAttribute("Dados Veiculo");
            Characteristic placa = new Characteristic("Placa do Veiculo", ValueTypeCharacteristic.TEXTO, null, CharacteristicOrigin.PERSON);
            this.characteristicService.save(placa);
            buddySeedControlService.saveSeedIntegrationFromBuddy(placa, this.characteristicService);
            AssociativeCharacteristic aplaca = new AssociativeCharacteristic(placa, 0);
            dadosVei.getAttributes().add(aplaca);
            Characteristic cidVeiculo = new Characteristic("Cidade Veiculo", ValueTypeCharacteristic.TEXTO, null, CharacteristicOrigin.PERSON);
            this.characteristicService.save(cidVeiculo);
            buddySeedControlService.saveSeedIntegrationFromBuddy(cidVeiculo, this.characteristicService);
            AssociativeCharacteristic acidVeiculo = new AssociativeCharacteristic(cidVeiculo, 0);
            dadosVei.getAttributes().add(acidVeiculo);
            Characteristic estVeiculo = new Characteristic("Estado Veiculo", ValueTypeCharacteristic.TEXTO, null, CharacteristicOrigin.PERSON);
            this.characteristicService.save(estVeiculo);
            buddySeedControlService.saveSeedIntegrationFromBuddy(estVeiculo, this.characteristicService);
            AssociativeCharacteristic aestVeiculo = new AssociativeCharacteristic(estVeiculo, 0);
            dadosVei.getAttributes().add(aestVeiculo);
            transporter.getGroupAttributes().add(dadosVei);
            transporter.setIntegrationId(3L);
            this.service.save(transporter);
            buddySeedControlService.saveSeedIntegrationFromBuddy(transporter, service);
        }
        this.em.flush();
        Characteristic cargo = null;

        if (service.recoverByCategory(RoleCategory.EMPLOYEE).isEmpty()) {
            Role employee = new Role("Funcionário", RoleCategory.EMPLOYEE);
            employee.setColor("#1ab394");
            GroupRoleAttribute general = new GroupRoleAttribute("Gerais");
            Characteristic setor = new Characteristic("Setor", ValueTypeCharacteristic.TEXTO, null, CharacteristicOrigin.PERSON);
            this.characteristicService.save(setor);
            buddySeedControlService.saveSeedIntegrationFromBuddy(setor, this.characteristicService);
            AssociativeCharacteristic asetor = new AssociativeCharacteristic(setor, 0);
            general.getAttributes().add(asetor);
            cargo = new Characteristic("Cargo", ValueTypeCharacteristic.TEXTO, null, CharacteristicOrigin.PERSON);
            this.characteristicService.save(cargo);
            buddySeedControlService.saveSeedIntegrationFromBuddy(cargo, this.characteristicService);
            AssociativeCharacteristic acargo = new AssociativeCharacteristic(cargo, 0);
            general.getAttributes().add(acargo);
            Characteristic admissao = new Characteristic("Data de Admissão", ValueTypeCharacteristic.DATA, null, CharacteristicOrigin.PERSON);
            this.characteristicService.save(admissao);
            buddySeedControlService.saveSeedIntegrationFromBuddy(admissao, this.characteristicService);
            AssociativeCharacteristic aadmissao = new AssociativeCharacteristic(admissao, 0);
            general.getAttributes().add(aadmissao);
            Characteristic demissao = new Characteristic("Data de Demissão", ValueTypeCharacteristic.DATA, null, CharacteristicOrigin.PERSON);
            this.characteristicService.save(demissao);
            buddySeedControlService.saveSeedIntegrationFromBuddy(demissao, this.characteristicService);
            AssociativeCharacteristic ademissao = new AssociativeCharacteristic(demissao, 0);
            general.getAttributes().add(ademissao);
            employee.getGroupAttributes().add(general);
            GroupRoleAttribute bankdata = new GroupRoleAttribute("Dados Bancárioss");
            Characteristic banco = new Characteristic("Banco", ValueTypeCharacteristic.TEXTO, null, CharacteristicOrigin.PERSON);
            this.characteristicService.save(banco);
            buddySeedControlService.saveSeedIntegrationFromBuddy(banco, this.characteristicService);
            AssociativeCharacteristic abanco = new AssociativeCharacteristic(banco, 0);
            bankdata.getAttributes().add(abanco);
            Characteristic agencia = new Characteristic("Agência", ValueTypeCharacteristic.TEXTO, null, CharacteristicOrigin.PERSON);
            this.characteristicService.save(agencia);
            buddySeedControlService.saveSeedIntegrationFromBuddy(agencia, this.characteristicService);
            AssociativeCharacteristic aagencia = new AssociativeCharacteristic(agencia, 0);
            bankdata.getAttributes().add(aagencia);
            Characteristic conta = new Characteristic("Conta", ValueTypeCharacteristic.TEXTO, null, CharacteristicOrigin.PERSON);
            this.characteristicService.save(conta);
            buddySeedControlService.saveSeedIntegrationFromBuddy(conta, this.characteristicService);
            AssociativeCharacteristic aconta = new AssociativeCharacteristic(conta, 0);
            bankdata.getAttributes().add(aconta);
            employee.getGroupAttributes().add(bankdata);
            GroupRoleAttribute other = new GroupRoleAttribute("Observações");
            Characteristic obs = new Characteristic("Observação", ValueTypeCharacteristic.TEXTO, null, CharacteristicOrigin.PERSON);
            this.characteristicService.save(obs);
            buddySeedControlService.saveSeedIntegrationFromBuddy(obs, this.characteristicService);
            AssociativeCharacteristic aobs = new AssociativeCharacteristic(obs, 0);
            other.getAttributes().add(aobs);
            employee.getGroupAttributes().add(other);
            employee.setIntegrationId(4L);
            this.service.save(employee);
            buddySeedControlService.saveSeedIntegrationFromBuddy(employee, service);
        }
        this.em.flush();
        if (service.recoverByCategory(RoleCategory.OTHER).isEmpty()) {
            Role geral = new Role("Geral", RoleCategory.OTHER);

            geral.setColor("#000000");
            GroupRoleAttribute pj = new GroupRoleAttribute("Dados do Contato", SpecializationOrigin.JURIDICA);
            Characteristic nome = new Characteristic("Nome", ValueTypeCharacteristic.TEXTO, null, CharacteristicOrigin.PERSON);
            this.characteristicService.save(nome);
            buddySeedControlService.saveSeedIntegrationFromBuddy(nome, this.characteristicService);
            AssociativeCharacteristic anome = new AssociativeCharacteristic(nome, 0, SpecializationOrigin.JURIDICA);
            pj.getAttributes().add(anome);

            Characteristic cpf = new Characteristic("CPF", ValueTypeCharacteristic.TEXTO, null, CharacteristicOrigin.PERSON);
            this.characteristicService.save(cpf);
            buddySeedControlService.saveSeedIntegrationFromBuddy(cpf, this.characteristicService);
            AssociativeCharacteristic acpf = new AssociativeCharacteristic(cpf, 0, SpecializationOrigin.JURIDICA);
            pj.getAttributes().add(acpf);

            Characteristic rg = new Characteristic("RG", ValueTypeCharacteristic.TEXTO, null, CharacteristicOrigin.PERSON);
            this.characteristicService.save(rg);
            buddySeedControlService.saveSeedIntegrationFromBuddy(rg, this.characteristicService);
            AssociativeCharacteristic arg = new AssociativeCharacteristic(rg, 0, SpecializationOrigin.JURIDICA);
            pj.getAttributes().add(arg);

            Characteristic nascimento = new Characteristic("Data de Nascimento", ValueTypeCharacteristic.DATA, null, CharacteristicOrigin.PERSON);
            this.characteristicService.save(nascimento);
            buddySeedControlService.saveSeedIntegrationFromBuddy(nascimento, this.characteristicService);
            AssociativeCharacteristic anascimento = new AssociativeCharacteristic(nascimento, 0, SpecializationOrigin.JURIDICA);
            pj.getAttributes().add(anascimento);

            AssociativeCharacteristic acargoj = new AssociativeCharacteristic(cargo, 0, SpecializationOrigin.JURIDICA);
            pj.getAttributes().add(acargoj);

            geral.getGroupAttributes().add(pj);

            GroupRoleAttribute pf = new GroupRoleAttribute("Dados da Pessoa", SpecializationOrigin.FISICA);
            List<OptionValueCharacteristic> civilValue = new ArrayList<>();
            civilValue.add(optionValueCharacteristicService.save(new OptionValueCharacteristic("Solteiro(a)")));
            civilValue.add(optionValueCharacteristicService.save(new OptionValueCharacteristic("Casado(a)")));
            civilValue.add(optionValueCharacteristicService.save(new OptionValueCharacteristic("Separado(a)")));
            civilValue.add(optionValueCharacteristicService.save(new OptionValueCharacteristic("Divorciado(a)")));
            civilValue.add(optionValueCharacteristicService.save(new OptionValueCharacteristic("Viúvo(a)")));
            Characteristic civil = new Characteristic("Estado Civil", ValueTypeCharacteristic.SELECAO, civilValue, CharacteristicOrigin.PERSON);
            this.characteristicService.save(civil);
            buddySeedControlService.saveSeedIntegrationFromBuddy(civil, this.characteristicService);
            civil.getValues().stream().forEach(optionValueCharacteristic -> {
                buddySeedControlService.saveSeedIntegrationFromBuddy(optionValueCharacteristic, optionValueCharacteristic.getId());
            });
            AssociativeCharacteristic acivil = new AssociativeCharacteristic(civil, 0, SpecializationOrigin.FISICA);
            pf.getAttributes().add(acivil);

            Characteristic address = new Characteristic("Naturalidade", ValueTypeCharacteristic.TEXTO, null, CharacteristicOrigin.PERSON);
            this.characteristicService.save(address);
            buddySeedControlService.saveSeedIntegrationFromBuddy(address, this.characteristicService);
            AssociativeCharacteristic aaddress = new AssociativeCharacteristic(address, 0, SpecializationOrigin.FISICA);
            pf.getAttributes().add(aaddress);

            List<OptionValueCharacteristic> naturalValue = new ArrayList<>();
            naturalValue.add(optionValueCharacteristicService.save(new OptionValueCharacteristic("Brasileira")));
            naturalValue.add(optionValueCharacteristicService.save(new OptionValueCharacteristic("Estrangeira")));
            Characteristic natural = new Characteristic("Nacionalidade", ValueTypeCharacteristic.SELECAO, naturalValue, CharacteristicOrigin.PERSON);
            this.characteristicService.save(natural);
            buddySeedControlService.saveSeedIntegrationFromBuddy(natural, this.characteristicService);
            natural.getValues().stream().forEach(optionValueCharacteristic -> {
                buddySeedControlService.saveSeedIntegrationFromBuddy(optionValueCharacteristic, optionValueCharacteristic.getId());
            });
            AssociativeCharacteristic anatural = new AssociativeCharacteristic(natural, 0, SpecializationOrigin.FISICA);
            pf.getAttributes().add(anatural);
            geral.getGroupAttributes().add(pf);
            geral.setIntegrationId(5L);
            this.service.save(geral);
            buddySeedControlService.saveSeedIntegrationFromBuddy(geral, service);
        }
        this.em.flush();
        this.em.setFlushMode(mode);
    }

}

