package br.com.codein.buddyadmin.seed;

import io.gumga.domain.seed.AppSeed;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.context.ApplicationListener;
import org.springframework.context.event.ContextRefreshedEvent;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.util.LinkedList;
import java.util.List;
import java.util.concurrent.atomic.AtomicBoolean;

@Component
public class Seed implements ApplicationListener<ContextRefreshedEvent> {

	private AtomicBoolean started = new AtomicBoolean(false);

	@Autowired
	@Qualifier("roleSeed")
	private RoleSeed roleSeed;
	@Autowired
	@Qualifier("characteristicSeed")
	private CharacteristicSeed characteristicSeed;

	public void onApplicationEvent(ContextRefreshedEvent event) {
		if (started.get()) return;
		
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
		list.add(roleSeed);
		list.add(characteristicSeed);
		return list;
	}

}
