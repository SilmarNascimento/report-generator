package com.mateco.reportgenerator.service.implementation;

import net.sf.jasperreports.engine.*;
import org.springframework.stereotype.Service;

import java.io.FileNotFoundException;
import java.io.InputStream;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class JasperReportService {

    private final Map<String, JasperReport> compiledReports = new ConcurrentHashMap<>();

    public byte[] generatePdf(String templateName, Map<String, Object> params, JRDataSource dataSource) {
        try {
            JasperReport jasperReport = compiledReports.computeIfAbsent(templateName, this::compileReportSafely);

            if (dataSource == null) {
                dataSource = new JREmptyDataSource();
            }

            JasperPrint jasperPrint = JasperFillManager.fillReport(jasperReport, params, dataSource);

            return JasperExportManager.exportReportToPdf(jasperPrint);

        } catch (Exception e) {
            throw new RuntimeException("Erro ao processar relatório Jasper: " + templateName, e);
        }
    }

    private JasperReport compileReportSafely(String templateName) {
        try (InputStream reportStream = getClass().getResourceAsStream("/reports/" + templateName)) {
            if (reportStream == null) {
                throw new FileNotFoundException("Arquivo de relatório não encontrado em /resources/reports/" + templateName);
            }
            return JasperCompileManager.compileReport(reportStream);
        } catch (Exception e) {
            throw new RuntimeException("Erro ao compilar relatório Jasper: " + templateName, e);
        }
    }

    public JasperReport compileSubreport(String jrxmlName) {
        return compiledReports.computeIfAbsent(jrxmlName, this::compileReportSafely);
    }
}