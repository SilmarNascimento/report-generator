package com.mateco.reportgenerator.service.implementation;

import net.sf.jasperreports.engine.*;
import org.springframework.stereotype.Service;

import java.io.FileNotFoundException;
import java.io.InputStream;
import java.util.Map;

@Service
public class JasperReportService {

    public byte[] generatePdf(String templateName, Map<String, Object> params, JRDataSource dataSource) {
        try {
            InputStream reportStream = getClass().getResourceAsStream("/reports/" + templateName);

            if (reportStream == null) {
                throw new FileNotFoundException("Arquivo de relatório não encontrado em /resources/reports/" + templateName);
            }

            JasperReport jasperReport = JasperCompileManager.compileReport(reportStream);

            if (dataSource == null) {
                dataSource = new JREmptyDataSource();
            }

            JasperPrint jasperPrint = JasperFillManager.fillReport(jasperReport, params, dataSource);

            return JasperExportManager.exportReportToPdf(jasperPrint);

        } catch (Exception e) {
            throw new RuntimeException("Erro ao processar relatório Jasper: " + templateName, e);
        }
    }
}