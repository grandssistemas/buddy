package br.com.codein.buddyadmin.seed;

import br.com.codein.buddycharacteristic.application.service.characteristic.CharacteristicService;
import br.com.codein.buddycharacteristic.domain.characteristic.Characteristic;
import br.com.codein.buddycharacteristic.domain.characteristic.OptionValueCharacteristic;
import br.com.codein.buddycharacteristic.domain.characteristic.enums.CharacteristicOrigin;
import br.com.codein.buddycharacteristic.domain.characteristic.enums.ValueTypeCharacteristic;
import io.gumga.domain.seed.AppSeed;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileReader;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

/**
 * Created by gelatti on 17/02/17.
 */
@Component
public class CharacteristicSeed implements AppSeed {

    @Autowired
    private CharacteristicService characteristicService;


    @Transactional
    public void processaLinhaCharacteristic(String[] args) {
        String type = args[1];
        if (characteristicService.recoveryByName(args[0]) == null) {
            List<OptionValueCharacteristic> values = new ArrayList<>();
            for (int i = 1; i < args.length; i++) {
                values.add(new OptionValueCharacteristic(args[i]));
            }
            characteristicService.save(new Characteristic(args[0], ValueTypeCharacteristic.MULTISELECAO, values, CharacteristicOrigin.PRODUCT));
        }
    }

    @Override
    @Transactional
    public void loadSeed() throws IOException {
        ClassLoader classLoader = getClass().getClassLoader();
        File file = new File(classLoader.getResource("seedFiles/GRID_CHARACTERISTIC.csv").getFile());
        BufferedReader source = new BufferedReader(new FileReader(file));
        String line;
        line = source.readLine();
        String[] parts = line.split(";");
        processaLinhaCharacteristic(parts);
        line = source.readLine();
        parts = line.split(";");
        processaLinhaCharacteristic(parts);
        source.close();

        file = new File(classLoader.getResource("seedFiles/MODA_GRID.csv").getFile());
        source = new BufferedReader(new FileReader(file));

        line = source.readLine();
        parts = line.split(";");
        processaLinhaCharacteristic(parts);
        line = source.readLine();
        parts = line.split(";");
        processaLinhaCharacteristic(parts);
        source.close();
    }
}
