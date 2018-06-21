package br.com.codein.buddyadmin.seed;

import br.com.mobiage.mobiage.application.service.buddyseed.BuddySeedControlService;
import br.com.mobiage.mobiage.application.service.genericreport.GenericReportService;
import br.com.mobiage.mobiage.domain.model.genericreport.GenericReport;
import br.com.mobiage.mobiage.domain.model.genericreport.enums.ReportType;
import io.gumga.domain.seed.AppSeed;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.io.*;
import java.nio.charset.StandardCharsets;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.Date;

/**
 * Created by rafael on 06/05/15.
 */
@Component
public class GenericReportSeed implements AppSeed {

    @Autowired
    private GenericReportService service;

    @Autowired
    private BuddySeedControlService buddySeedControlService;



    @Override
    @Transactional
    public void loadSeed() throws IOException {
        try {
            ClassLoader classLoader = getClass().getClassLoader();
            File file = new File(classLoader.getResource("seedFiles/genericreport.csv").getFile());
            BufferedReader source = new BufferedReader(new InputStreamReader(new FileInputStream(file), StandardCharsets.UTF_8));
            String line;
            while ((line = source.readLine()) != null) {
                String[] parts = line.split(";");
                String filename = parts[0];
                String tipo = parts[1];
                String name = parts[2];

                DateFormat formatter = new SimpleDateFormat("dd-MM-yyyy HH:mm");
                Date lastAlteration = formatter.parse(parts[3]);

                ReportType type = ReportType.valueOf(tipo);

                GenericReport defaultReport = service.getPublicReport(type,name);
                if (defaultReport == null || defaultReport.getImportationDate() == null ||defaultReport.getImportationDate().before(lastAlteration)){
                    File report = new File(classLoader.getResource("seedFiles/reports/"+filename).getFile());
                    BufferedReader reportSource = new BufferedReader(new InputStreamReader(new FileInputStream(report), StandardCharsets.UTF_8));
                    String json = reportSource.readLine();

                    if (defaultReport != null){
                        defaultReport.setImportationDate(lastAlteration);
                        defaultReport.setJsonReport(json);
                    } else {
                        defaultReport = new GenericReport(name,type,json,lastAlteration);
                    }
                    this.service.save(defaultReport);
                    buddySeedControlService.saveSeedIntegrationFromBuddy(defaultReport, service);
                }
            }

        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
