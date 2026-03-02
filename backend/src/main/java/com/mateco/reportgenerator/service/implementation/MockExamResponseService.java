package com.mateco.reportgenerator.service.implementation;

import com.mateco.reportgenerator.controller.dto.FileEntityDto.FileDownloadDto;
import com.mateco.reportgenerator.controller.dto.jasperReportDto.DiagnosisReportDTO;
import com.mateco.reportgenerator.controller.dto.sortDto.SortCriteriaDto;
import com.mateco.reportgenerator.model.entity.FileEntity;
import com.mateco.reportgenerator.model.entity.MainQuestion;
import com.mateco.reportgenerator.model.entity.MockExam;
import com.mateco.reportgenerator.model.entity.MockExamResponse;
import com.mateco.reportgenerator.model.repository.MockExamResponseRepository;
import com.mateco.reportgenerator.service.MockExamResponseServiceInterface;
import com.mateco.reportgenerator.service.exception.InvalidDataException;
import com.mateco.reportgenerator.service.exception.NotFoundException;
import com.mateco.reportgenerator.utils.ChartGenerator;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import net.sf.jasperreports.engine.JasperReport;
import net.sf.jasperreports.engine.data.JRBeanCollectionDataSource;
import org.apache.pdfbox.multipdf.PDFMergerUtility;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.awt.image.BufferedImage;
import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.*;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class MockExamResponseService implements MockExamResponseServiceInterface {

    private final MockExamResponseRepository mockExamResponseRepository;
    private final JasperReportService jasperReportService;

    @Override
    public Page<MockExamResponse> findAllMockExamResponses(
            int pageNumber,
            int pageSize,
            String query,
            List<SortCriteriaDto> sort
    ) {
        Sort sortOrder = getSort(sort);
        Pageable pageable = PageRequest.of(pageNumber, pageSize, sortOrder);

        if (query != null && !query.isEmpty()) {
            return mockExamResponseRepository.findByQuery(query, pageable);
        }

        return mockExamResponseRepository.findAll(pageable);
    }

    @Override
    public MockExamResponse findMockExamResponseById(UUID mockExamResponseId) {
        return mockExamResponseRepository.findById(mockExamResponseId)
                .orElseThrow(() -> new NotFoundException("Resposta de Simulado não encontrada"));
    }

    @Override
    public void generateCompleteDiagnosisById(
            UUID mockExamResponseId,
            MultipartFile personalRecordPdfFile
    ) {
        if (!("application/pdf").equals(personalRecordPdfFile.getContentType())) {
            throw new InvalidDataException("Formato de arquivo inválido");
        }
        MockExamResponse examResponseFound = mockExamResponseRepository.findById(mockExamResponseId)
                .orElseThrow(() -> new NotFoundException("Resposta de Simulado não encontrada"));

        MockExam mockExam = examResponseFound.getMockExam();
        List<Integer> missedMainQuestionNumbers = examResponseFound.getMissedMainQuestionNumbers();
        Map<Integer, MainQuestion> mainQuestionMap = mockExam.getMockExamQuestions();

        List<FileEntity> personalAdaptedQuestionPdfFile = missedMainQuestionNumbers.stream()
                .map((questionNumber) -> {
                    MainQuestion mainQuestion = mainQuestionMap.get(questionNumber);
                    return mainQuestion.getAdaptedQuestionsPdfFile();
                })
                .toList();

        try {
            List<FileEntity> pdfFilesToMerge = new ArrayList<>();
            FileEntity personalRecordPdfFileEntity = new FileEntity(personalRecordPdfFile);

            if (mockExam.getCoverPdfFile() != null) pdfFilesToMerge.add(mockExam.getCoverPdfFile());
            pdfFilesToMerge.add(personalRecordPdfFileEntity);
            if (mockExam.getMatrixPdfFile() != null) pdfFilesToMerge.add(mockExam.getMatrixPdfFile());
            pdfFilesToMerge.addAll(personalAdaptedQuestionPdfFile);
            if (mockExam.getAnswersPdfFile() != null) pdfFilesToMerge.add(mockExam.getAnswersPdfFile());

            PDDocument mergedPDFDocument = mergePDFs(pdfFilesToMerge);
            String diagnosisFileName = "DIAGNÓSTICO SIMULADO " + String.format("%02d", mockExam.getNumber()) + " - " + examResponseFound.getName().toUpperCase() + ".pdf";

            FileEntity diagnosisPdfEntity = new FileEntity(mergedPDFDocument, diagnosisFileName);
            mergedPDFDocument.close();

            examResponseFound.setDiagnosisPdfFile(diagnosisPdfEntity);
            mockExamResponseRepository.save(examResponseFound);
        } catch (IOException e) {
            throw new RuntimeException("Erro ao mesclar PDFs: " + e.getMessage(), e);
        }
    }

    @Override
    public void deleteMockExamResponseById(UUID mockExamResponseId) {
        mockExamResponseRepository.deleteById(mockExamResponseId);
    }

    @Transactional
    public void generateAndAttachDiagnosisPdf(UUID responseId) {
        MockExamResponse response = mockExamResponseRepository.findById(responseId)
                .orElseThrow(() -> new NotFoundException("Resposta não encontrada para o ID: " + responseId));

        if (response.getMockExam() == null || response.getMockExam().getMockExamQuestions().isEmpty()) {
            throw new InvalidDataException("Simulado não encontrado ou sem questões cadastradas.");
        }

        try {
            DiagnosisReportDTO reportDto = DiagnosisReportDTO.from(response);

            Map<String, byte[]> imageBytesMap = loadAllImagesToMemory();
            Map<String, Object> params = new HashMap<>();

            imageBytesMap.forEach((key, bytes) -> {
                params.put(key, new ByteArrayInputStream(bytes));
            });

            JasperReport top5Subreport = jasperReportService.compileSubreport("top5_chart.jrxml");
            params.put("TOP5_SUBREPORT", top5Subreport);

            fillStudentParams(params, reportDto);

            byte[] pdfBytes = jasperReportService.generatePdf(
                    "student_diagnosis.jrxml",
                    params,
                    new JRBeanCollectionDataSource(reportDto.questionTable())
            );

            FileEntity pdfEntity = new FileEntity(
                    pdfBytes,
                    "diagnostico_" + response.getName().replaceAll("\\s+", "_") + ".pdf",
                    "application/pdf"
            );

            response.setDiagnosisPdfFile(pdfEntity);
            mockExamResponseRepository.save(response);

        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("Falha ao gerar o PDF de diagnóstico: " + e.getMessage(), e);
        }
    }

    //usar sempre os ultimos simulados de VISÃO POR ÁREA
    //usar esse metodo
    @Transactional
    public void generateAllDiagnosisPdfs(List<MockExamResponse> responses) throws IOException {
        // 1. Carrega as imagens para a memória UMA ÚNICA VEZ
        Map<String, byte[]> imageBytesMap = loadAllImagesToMemory();

        // 2. Compila o sub-relatório UMA ÚNICA VEZ fora do loop
        JasperReport top5Subreport;
        try {
            top5Subreport = jasperReportService.compileSubreport("top5_chart.jrxml");
        } catch (Exception e) {
            throw new RuntimeException("Falha ao compilar o sub-relatório do Top 5: " + e.getMessage(), e);
        }

        // 3. Itera gerando os relatórios em lote e mesclando
        for (MockExamResponse response : responses) {
            try {
                DiagnosisReportDTO reportDto = DiagnosisReportDTO.from(response);
                Map<String, Object> studentParams = new HashMap<>();

                // Recria os InputStreams das imagens em memória
                imageBytesMap.forEach((key, bytes) -> {
                    studentParams.put(key, new ByteArrayInputStream(bytes));
                });

                studentParams.put("TOP5_SUBREPORT", top5Subreport);
                fillStudentParams(studentParams, reportDto);

                // ==============================================================
                // PASSO A: GERA O RELATÓRIO DO ALUNO (O "MIOLO" DO PDF)
                // ==============================================================
                byte[] jasperPdfBytes = jasperReportService.generatePdf(
                        "student_diagnosis.jrxml",
                        studentParams,
                        new JRBeanCollectionDataSource(reportDto.questionTable())
                );

                // Transforma o byte[] do Jasper em um FileEntity temporário para o Merge
                FileEntity jasperReportPdfEntity = new FileEntity(
                        jasperPdfBytes,
                        "diagnostico_base_" + reportDto.studentName().replaceAll("\\s+", "_") + ".pdf",
                        "application/pdf"
                );

                // ==============================================================
                // PASSO B: PREPARA A LISTA DE MESCLAGEM (MERGE)
                // ==============================================================
                MockExam mockExam = response.getMockExam();
                List<FileEntity> pdfFilesToMerge = new ArrayList<>();

                // 1. Capa
                if (mockExam.getCoverPdfFile() != null) {
                    pdfFilesToMerge.add(mockExam.getCoverPdfFile());
                }

                // 2. O Relatório Diagnóstico (Gerado agora pelo Jasper)
                pdfFilesToMerge.add(jasperReportPdfEntity);

                // 3. Matriz de Referência
                if (mockExam.getMatrixPdfFile() != null) {
                    pdfFilesToMerge.add(mockExam.getMatrixPdfFile());
                }

                // 4. Questões Adaptadas (baseado nos erros)
                List<Integer> missedNumbers = response.getMissedMainQuestionNumbers();
                Map<Integer, MainQuestion> mainQuestionMap = mockExam.getMockExamQuestions();

                if (missedNumbers != null && mainQuestionMap != null) {
                    for (Integer questionNumber : missedNumbers) {
                        MainQuestion mainQuestion = mainQuestionMap.get(questionNumber);
                        if (mainQuestion != null && mainQuestion.getAdaptedQuestionsPdfFile() != null) {
                            pdfFilesToMerge.add(mainQuestion.getAdaptedQuestionsPdfFile());
                        }
                    }
                }

                // 5. Resoluções/Gabarito
                if (mockExam.getAnswersPdfFile() != null) {
                    pdfFilesToMerge.add(mockExam.getAnswersPdfFile());
                }

                // ==============================================================
                // PASSO C: EXECUTA O MERGE E SALVA NA RESPOSTA
                // ==============================================================
                PDDocument mergedPDFDocument = mergePDFs(pdfFilesToMerge);

                String finalFileName = "DIAGNÓSTICO SIMULADO " + String.format("%02d", mockExam.getNumber()) + " - " + response.getName().toUpperCase() + ".pdf";

                FileEntity finalDiagnosisPdfEntity = new FileEntity(mergedPDFDocument, finalFileName);

                // IMPORTANTE: Fechar o documento para evitar vazamento de memória (Memory Leak)
                mergedPDFDocument.close();

                response.setDiagnosisPdfFile(finalDiagnosisPdfEntity);

            } catch (Exception e) {
                // Se der erro em um aluno, loga o erro mas NÃO QUEBRA o lote inteiro
                log.error("Falha ao gerar e mesclar o PDF de diagnóstico para a resposta ID: {}", response.getId(), e);
            }
        }

        // 4. Salva todas as respostas atualizadas com os PDFs gigantes já mesclados no banco
        mockExamResponseRepository.saveAll(responses);
    }

    private Map<String, byte[]> loadAllImagesToMemory() throws IOException {
        Map<String, byte[]> map = new HashMap<>();
        String[] images = {"LOGO_MATECO", "VISAO_POR_AREA", "O_QUE_REVISAR", "DISTRIBUICAO", "TOP_5_ASSUNTOS", "ERROU_MAS_TA_OK", "NAO_DEVERIA_ERRAR"};

        for (String imgName : images) {
            String path = "/static/images/" + imgName + ".png";
            try (InputStream is = getClass().getResourceAsStream(path)) {
                if (is != null) {
                    map.put(imgName, is.readAllBytes());
                }
            }
        }
        return map;
    }

    private void fillStudentParams(Map<String, Object> params, DiagnosisReportDTO dto) {
        params.put("studentName", dto.studentName());
        params.put("examName", dto.examName());
        params.put("examYear", dto.examYear());
        params.put("correctAnswers", dto.correctAnswers());
        params.put("totalQuestions", dto.totalQuestions());

        BufferedImage ipmChartImage = ChartGenerator.createDoughnutGauge(dto.ipmScore());
        params.put("GRAFICO_IPM", ipmChartImage);
        // ==========================================
        // DADOS DO HISTÓRICO (GERAÇÃO UNIFICADA O(N))
        // ==========================================
        List<MockExamResponse> historicoCompleto = mockExamResponseRepository
                .findAllByNameOrderByCreatedAtAsc(dto.studentName());

        int totalHistorico = historicoCompleto.size();
        int quantidadeMostrar = Math.max(5, Math.min(totalHistorico, 25));
        int startIndex = Math.max(0, totalHistorico - 25);

        List<Map<String, Object>> dadosIpm = new ArrayList<>();
        List<Map<String, Object>> dadosDesempenho = new ArrayList<>();
        List<Map<String, Object>> dadosAritmetica = new ArrayList<>();
        List<Map<String, Object>> dadosAlgebra = new ArrayList<>();
        List<Map<String, Object>> dadosGeometria = new ArrayList<>();

        for (int i = 0; i < quantidadeMostrar; i++) {
            Map<String, Object> mapIpm = new HashMap<>();
            Map<String, Object> mapDes = new HashMap<>();
            Map<String, Object> mapArit = new HashMap<>();
            Map<String, Object> mapAlg = new HashMap<>();
            Map<String, Object> mapGeo = new HashMap<>();

            int indexReal = startIndex + i;

            if (indexReal < totalHistorico) {
                MockExamResponse resp = historicoCompleto.get(indexReal);

                // 1. Labels
                String labelLongo = (quantidadeMostrar > 7) ?
                        "S" + String.format("%02d", indexReal + 1) :
                        "SIMULADO " + String.format("%02d", indexReal + 1);
                String labelCurto = "S" + (indexReal + 1);

                mapIpm.put("label", labelLongo);
                mapDes.put("label", labelLongo);
                mapArit.put("label", labelCurto);
                mapAlg.put("label", labelCurto);
                mapGeo.put("label", labelCurto);

                // 2. Valores
                mapIpm.put("value", resp.getIpmScore() != null ? resp.getIpmScore() : 0.0);
                mapDes.put("value", resp.getCorrectAnswers() != 0 ? resp.getCorrectAnswers() : 0);

                Map<String, String> areaMap = resp.getAreaPerformance();
                mapArit.put("value", parsePorcentagem(areaMap.get("ARITMETICA")));
                mapAlg.put("value", parsePorcentagem(areaMap.get("ALGEBRA")));
                mapGeo.put("value", parsePorcentagem(areaMap.get("GEOMETRIA")));

            } else {
                // 3. Fantasmas (Slots vazios para alinhamento)
                String fantasma = " ".repeat(i + 1);

                mapIpm.put("label", fantasma);
                mapIpm.put("value", null);
                mapDes.put("label", fantasma);
                mapDes.put("value", null);
                mapArit.put("label", fantasma);
                mapArit.put("value", null);
                mapAlg.put("label", fantasma);
                mapAlg.put("value", null);
                mapGeo.put("label", fantasma);
                mapGeo.put("value", null);
            }

            dadosIpm.add(mapIpm);
            dadosDesempenho.add(mapDes);
            dadosAritmetica.add(mapArit);
            dadosAlgebra.add(mapAlg);
            dadosGeometria.add(mapGeo);
        }

        // ==========================================
        // INJEÇÃO NO JASPER
        // ==========================================
        params.put("TOTAL_SIMULADOS", totalHistorico);
        params.put("GRAFICO_HISTORICO_IPM", new JRBeanCollectionDataSource(dadosIpm));
        params.put("GRAFICO_HISTORICO_DESEMPENHO_DATA", new JRBeanCollectionDataSource(dadosDesempenho));

        // As listas de área vão cruas porque o Jasper faz o 'new JRBeanCollectionDataSource' no XML
        params.put("GRAFICO_AREA_ARITMETICA", dadosAritmetica);
        params.put("GRAFICO_AREA_ALGEBRA", dadosAlgebra);
        params.put("GRAFICO_AREA_GEOMETRIA", dadosGeometria);

        // Passa a lista de dados nativa para o Jasper
        params.put("VALOR_IPM", dto.ipmScore());

        String naoDeviaErrarStr = dto.easyMissed().stream()
                .map(String::valueOf)
                .collect(Collectors.joining(" "));

        String errouMasTaOkStr = dto.hardMissed().stream()
                .map(String::valueOf)
                .collect(Collectors.joining(" "));

        params.put("naoDeviaErrar", naoDeviaErrarStr);
        params.put("errouMasTaOk", errouMasTaOkStr);
        params.put("top5Subjects", new JRBeanCollectionDataSource(dto.top5Subjects()));
        params.put("areaPerformance", new JRBeanCollectionDataSource(dto.areaPerformance()));

        String visaoPorAreaText = dto.areaPerformance().stream()
                .map(area -> area.label().toUpperCase() + ": " + area.displayValue())
                .collect(Collectors.joining("\n"));
        params.put("VISAO_POR_AREA_TEXT", visaoPorAreaText);

        String distribuicaoText = dto.distribution().stream()
                .sorted(java.util.Comparator.comparingInt(d -> {
                    String label = d.label().toUpperCase();
                    if (label.contains("FÁCIL") || label.contains("FACIL")) return 1;
                    if (label.contains("MÉDIO") || label.contains("MEDIO")) return 2;
                    if (label.contains("DIFÍCIL") || label.contains("DIFICIL")) return 3;
                    return 4;
                }))
                .map(d -> d.label().toUpperCase() + ": " + d.displayValue())
                .collect(Collectors.joining("\n"));
        params.put("DISTRIBUICAO_TEXT", distribuicaoText);

        List<String> assuntosParaRevisar = dto.subjectsToReview();
        params.put("REVISAR_1", !assuntosParaRevisar.isEmpty() ? "1 - " + assuntosParaRevisar.get(0).toUpperCase() : "");
        params.put("REVISAR_2", assuntosParaRevisar.size() > 1 ? "2 - " + assuntosParaRevisar.get(1).toUpperCase() : "");
        params.put("REVISAR_3", assuntosParaRevisar.size() > 2 ? "3 - " + assuntosParaRevisar.get(2).toUpperCase() : "");
    }

    public PDDocument mergePDFs(List<FileEntity> fileEntities) throws IOException {
        PDFMergerUtility pdfMerger = new PDFMergerUtility();
        PDDocument mergedDocument = new PDDocument();

        for (FileEntity fileEntity : fileEntities) {
            if (fileEntity != null && fileEntity.getFileContent() != null) {
                byte[] pdfBytes = fileEntity.getFileContent().getContent();
                ByteArrayInputStream byteArrayInputStream = new ByteArrayInputStream(pdfBytes);
                PDDocument document = PDDocument.load(byteArrayInputStream);

                pdfMerger.appendDocument(mergedDocument, document);
                document.close();
            }
        }

        return mergedDocument;
    }

    private Sort getSort(List<SortCriteriaDto> sortCriteria) {
        if (sortCriteria == null || sortCriteria.isEmpty()) {
            return Sort.unsorted();
        }

        List<Sort.Order> orders = sortCriteria.stream()
                .map(criteria -> new Sort.Order(criteria.direction(), criteria.property()))
                .collect(Collectors.toList());

        return Sort.by(orders);
    }

    public FileDownloadDto getDiagnosisPdfFile(UUID responseId) {
        MockExamResponse response = mockExamResponseRepository.findById(responseId)
                .orElseThrow(() -> new NotFoundException("Resposta não encontrada"));

        FileEntity fileEntity = response.getDiagnosisPdfFile();

        if (fileEntity == null || fileEntity.getFileContent() == null) {
            throw new NotFoundException("O arquivo de diagnóstico ainda não foi gerado.");
        }

        return new FileDownloadDto(
                fileEntity.getFileName(),
                "application/pdf",
                fileEntity.getFileContent().getContent()
        );
    }

    private InputStream getImageFromResources(String imageName) {
        return getClass().getResourceAsStream("/static/images/" + imageName + ".png");
    }

    private double parsePorcentagem(String val) {
        if (val == null || !val.contains("(")) return 0.0;
        try {
            return Double.parseDouble(val.substring(val.indexOf("(") + 1, val.indexOf("%")));
        } catch (Exception e) {
            return 0.0;
        }
    }
}