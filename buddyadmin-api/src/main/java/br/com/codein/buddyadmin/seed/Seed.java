package br.com.codein.buddyadmin.seed;

import br.com.mobiage.mobiage.application.service.characteristic.CharacteristicService;
import br.com.mobiage.mobiage.domain.model.operation.Operation;
import br.com.mobiage.mobiage.domain.model.operation.OperationType;
import br.com.mobiage.mobiage.domain.model.product.Product;
import io.gumga.domain.seed.AppSeed;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.context.ApplicationListener;
import org.springframework.context.event.ContextRefreshedEvent;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import javax.persistence.EntityManager;
import javax.persistence.FlushModeType;
import javax.persistence.PersistenceContext;
import java.io.IOException;
import java.util.LinkedList;
import java.util.List;
import java.util.concurrent.atomic.AtomicBoolean;

@Component
public class Seed implements ApplicationListener<ContextRefreshedEvent> {

	private AtomicBoolean started = new AtomicBoolean(false);

//	@Autowired
//	@Qualifier("roleSeed")
//	private RoleSeed roleSeed;
//	@Autowired
//	@Qualifier("characteristicSeed")
//	private CharacteristicSeed characteristicSeed;

	@Autowired
	@Qualifier("genericReportSeed")
	private GenericReportSeed genericReportSeed;

	@Autowired
	@Qualifier("paymentTypeSeed")
	private PaymentTypeSeed paymentTypeSeed;
	@Autowired
	@Qualifier("personGroupSeed")
	private PersonGroupSeed personGroupSeed;
	@Autowired
	@Qualifier("productGroupSeed")
	private ProductGroupSeed productGroupSeed;
	@Autowired
	@Qualifier("operationTypeSeed")
	private OperationTypeSeed operationTypeSeed;
	@Autowired
	@Qualifier("businessRuleSeed")
	private BusinessRuleSeed businessRuleSeed;
	@Autowired
	@Qualifier("formulaSeed")
	private FormulaSeed formulaSeed;
	@Autowired
	@Qualifier("taxationGroupSeed")
	private TaxationGroupSeed taxationGroupSeed;
	@Autowired
	@Qualifier("characteristicSeed")
	private CharacteristicSeed characteristicSeed;
	@Autowired
	@Qualifier("departmentSeed")
	private DepartmentSeed departmentSeed;

	@Autowired
	@Qualifier("roleSeed")
	private RoleSeed roleSeed;
	@Autowired
	@Qualifier("codigosTributaveisSeed")
	private CodigosTributaveisSeed codigosTributaveisSeed;

	@Transactional
	public void onApplicationEvent(ContextRefreshedEvent event) {
		if (started.get()) return;
		System.out.println("deu certo caio!");
		for (AppSeed seed : seeds()) {
			try {
				seed.loadSeed();
			} catch (IOException e) {
				throw new RuntimeException(e);
			}
		}

		started.set(true);
	}
	
	
	private List<AppSeed> seeds() {
		List<AppSeed> list = new LinkedList<>();
		list.add(codigosTributaveisSeed);
		list.add(paymentTypeSeed);
		list.add(personGroupSeed);
		list.add(productGroupSeed);
		list.add(operationTypeSeed);
		list.add(businessRuleSeed);
		list.add(formulaSeed);
		list.add(taxationGroupSeed);
		list.add(characteristicSeed);
		list.add(departmentSeed);
		list.add(roleSeed);
		list.add(genericReportSeed);
		return list;
	}

}
