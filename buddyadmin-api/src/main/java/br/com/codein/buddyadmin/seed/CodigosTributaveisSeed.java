package br.com.codein.buddyadmin.seed;

import br.com.mobiage.mobiage.application.service.product.CestService;
import br.com.mobiage.mobiage.application.service.product.IbptService;
import br.com.mobiage.mobiage.application.service.product.NcmService;
import br.com.mobiage.mobiage.application.service.tributador.CfopService;
import br.com.mobiage.mobiage.application.service.tributador.CodigoEnquadramentoIpiService;
import br.com.mobiage.mobiage.domain.model.fiscal.enums.State;
import br.com.mobiage.mobiage.domain.model.product.Cest;
import br.com.mobiage.mobiage.domain.model.product.Ibpt;
import br.com.mobiage.mobiage.domain.model.product.Ncm;
import br.com.mobiage.mobiage.domain.model.product.enums.ProductControlType;
import br.com.mobiage.mobiage.domain.model.tributador.Cfop;
import br.com.mobiage.mobiage.domain.model.tributador.CodigoEnquadramentoIpi;
import br.com.mobiage.mobiage.domain.util.StringMount;
import io.gumga.core.QueryObject;
import io.gumga.core.SearchResult;
import io.gumga.domain.seed.AppSeed;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileReader;
import java.io.IOException;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;

/**
 * Created by rafael on 06/05/15.
 */
@Component
public class CodigosTributaveisSeed implements AppSeed {

    @Autowired
    private CestService cestService;
    @Autowired
    private NcmService ncmService;
    @Autowired
    private CfopService cfopService;
    @Autowired
    private CodigoEnquadramentoIpiService codigoEnquadramentoIpiService;
    @Autowired
    private IbptService ibptService;

    private HashMap<String, Cest> cests;


    @Transactional
    @Override
    public void loadSeed() throws IOException {
        cests = new HashMap<>();
        saveNcm();
        System.out.println("-----------------NCM");
        saveCest();
        System.out.println("-----------------CEST");
        saveCfop();
        System.out.println("-----------------CFOP");
        saveCodigoIpi();
        System.out.println("-----------------IPI");
        saveIBPT();
        System.out.println("-----------------IBPT");
    }


    public String saveIBPT() {
        if (ibptService.findAll().isEmpty()) {
            try {
                QueryObject qo = new QueryObject();
                qo.setAq("obj.id is not null");
                SearchResult<Ibpt> result = ibptService.pesquisa(qo);
                if (result.getCount() <= 0) {
                    ClassLoader classLoader = getClass().getClassLoader();
                    File file = new File(classLoader.getResource("seedFiles/ibpt_pr.csv").getFile());
                    ibptService.saveAll(file, State.PARANA);
                    file = new File(classLoader.getResource("seedFiles/ibpt_sp.csv").getFile());
                    ibptService.saveAll(file, State.SAO_PAULO);
                    return "Sucesso";
                } else {
                    return "Tabela IBPT já possui dados";
                }
            } catch (Exception e) {
                e.printStackTrace();
                return "Erro!";
            }
        }
        return "Sucesso";
    }


    public void saveCodigoIpi() throws IOException {
        if (codigoEnquadramentoIpiService.findAll().isEmpty()) {
            ClassLoader classLoader = getClass().getClassLoader();
            File file = new File(classLoader.getResource("seedFiles/COD_ENQ_IPI.csv").getFile());
            BufferedReader source = new BufferedReader(new FileReader(file));
            String line;
            while ((line = source.readLine()) != null) {
                String[] parts = line.split(";");
                String descricao = parts[1];

                codigoEnquadramentoIpiService.save(new CodigoEnquadramentoIpi(parts[0], descricao));
            }
            source.close();
        }
    }


    public void saveCfop() throws IOException {
        if (cfopService.findAll().isEmpty()) {
            ClassLoader classLoader = getClass().getClassLoader();
            File file = new File(classLoader.getResource("seedFiles/CFOP.csv").getFile());
            BufferedReader source = new BufferedReader(new FileReader(file));
            String line;
            while ((line = source.readLine()) != null) {
                String[] parts = line.split(";");
                String descricao = parts[1];

                Cfop cfop = new Cfop();
                cfop.setCodigo(parts[0]);
                cfop.setDescricao(descricao);


                cfopService.save(cfop);
            }
            source.close();
        }
    }


    public void saveNcm() throws IOException {
        if (ncmService.findAll().isEmpty()) {
            ClassLoader classLoader = getClass().getClassLoader();
            File file = new File(classLoader.getResource("seedFiles/ncm.csv").getFile());
            BufferedReader source = new BufferedReader(new FileReader(file));
            String line;
            while ((line = source.readLine()) != null) {
                String[] parts = line.split(";");
                Ncm ncm = new Ncm();
                ncm.setCodigo(StringMount.mountWithZero(8, parts[0].replaceAll("\\.", "")));
                ncm.setDescricao(parts[1]);
                ncm.setControlType(ProductControlType.UNID);
                ncmService.save(ncm);
            }
            source.close();
        }
    }


    public void saveCest() throws IOException {
        if (cestService.findAll().isEmpty()) {
            ClassLoader classLoader = getClass().getClassLoader();
            File file = new File(classLoader.getResource("seedFiles/cest.csv").getFile());
            BufferedReader source = new BufferedReader(new FileReader(file));
            String line;
            while ((line = source.readLine()) != null) {
                String[] parts = line.split(";");
                String codigo = StringMount.mountWithZero(7, parts[0].replaceAll("\\.", ""));
                Cest cest = cests.get(codigo);
                if (cest == null) {
                    cest = new Cest();
                    cest.setCodigo(codigo);
                    cest.setDescricao(parts[2]);
                    cest.setNcms(new HashSet<>());
                    cests.put(cest.getCodigo(), cest);
                }
                List<Ncm> list = ncmService.findByCodigoWithLike(parts[1]);
                cest.getNcms().addAll(list);
                cestService.save(cest);
            }
            source.close();
        }
    }

//
//    public void saveCestNcm() throws IOException {
//        ClassLoader classLoader = getClass().getClassLoader();
//        File file = new File(classLoader.getResource("seedFiles/ncmcest.csv").getFile());
//        BufferedReader source = new BufferedReader(new FileReader(file));
//        String line;
//        while ((line = source.readLine()) != null) {
//            String[] parts = line.split(";");
//
//            Cest cest = cests.get(parts[0].replaceAll("\\.", ""));
//            Ncm ncm = ncms.get(parts[1].replaceAll("\\.", ""));
//
//            ncms.keySet().stream().filter(s -> {
//                return s.matches("^".concat(parts[1].replaceAll("\\.", "")));
//            });
//
//            cest.addNcm(ncm);
//            cestService.save(cest);
//        }
//        source.close();
//    }
}
