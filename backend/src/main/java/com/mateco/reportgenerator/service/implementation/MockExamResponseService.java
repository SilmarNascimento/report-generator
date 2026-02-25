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
                    "diagnostico_simulado.jrxml",
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

    @Transactional
    public void generateAllDiagnosisPdfs(List<UUID> responseIds) throws IOException {
        List<MockExamResponse> responses = mockExamResponseRepository.findAllById(responseIds);

        Map<String, byte[]> imageBytesMap = loadAllImagesToMemory();

        for (MockExamResponse response : responses) {
            try {
                DiagnosisReportDTO reportDto = DiagnosisReportDTO.from(response);

                Map<String, Object> studentParams = new HashMap<>();
                imageBytesMap.forEach((key, bytes) -> {
                    studentParams.put(key, new ByteArrayInputStream(bytes));
                });
                fillStudentParams(studentParams, reportDto);

                studentParams.put("top5Subjects", new JRBeanCollectionDataSource(reportDto.top5Subjects()));
                studentParams.put("areaPerformance", new JRBeanCollectionDataSource(reportDto.areaPerformance()));

                byte[] pdfBytes = jasperReportService.generatePdf(
                        "student_diagnosis.jrxml",
                        studentParams,
                        new JRBeanCollectionDataSource(reportDto.questionTable())
                );

                FileEntity pdfEntity = new FileEntity(
                        pdfBytes,
                        "diagnostico_" + reportDto.studentName().replaceAll("\\s+", "_") + ".pdf",
                        "application/pdf"
                );

                response.setDiagnosisPdfFile(pdfEntity);

            } catch (Exception e) {
                e.printStackTrace();
                throw new RuntimeException("Falha ao gerar o PDF de diagnóstico: " + e.getMessage(), e);
            }
        }

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
}