package com.mateco.reportgenerator.service.implementation;

import com.mateco.reportgenerator.controller.dto.FileEntityDto.FileDownloadDto;
import com.mateco.reportgenerator.controller.dto.questionDto.QuestionDetailDto;
import com.mateco.reportgenerator.controller.dto.sortDto.SortCriteriaDto;
import com.mateco.reportgenerator.model.entity.*;
import com.mateco.reportgenerator.model.repository.MockExamResponseRepository;
import com.mateco.reportgenerator.service.MockExamResponseServiceInterface;
import com.mateco.reportgenerator.service.exception.InvalidDataException;
import com.mateco.reportgenerator.service.exception.NotFoundException;
import lombok.RequiredArgsConstructor;
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

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

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
        //TODO USAR DiagnosisReportDTO
        MockExamResponse response = mockExamResponseRepository.findById(responseId)
                .orElseThrow(() -> new NotFoundException("Resposta não encontrada para o ID: " + responseId));

        MockExam mockExam = response.getMockExam();

        if (mockExam == null || mockExam.getMockExamQuestions().isEmpty()) {
            throw new InvalidDataException("Simulado não encontrado ou sem questões cadastradas.");
        }

        try {
            List<QuestionDetailDto> detailsList = new ArrayList<>();
            List<String> studentAnswers = response.getResponses();

            Map<Integer, MainQuestion> questionsMap = mockExam.getMockExamQuestions();
            List<Integer> sortedQuestionNumbers = new ArrayList<>(questionsMap.keySet());
            Collections.sort(sortedQuestionNumbers);

            for (int i = 0; i < sortedQuestionNumbers.size(); i++) {
                Integer questionNum = sortedQuestionNumbers.get(i);
                MainQuestion question = questionsMap.get(questionNum);

                String studentAnswer = (i < studentAnswers.size()) ? studentAnswers.get(i) : "-";

                String correctLetter = getCorrectLetterFromAlternatives(question.getAlternatives());

                boolean isCorrect = studentAnswer.equalsIgnoreCase(correctLetter);

                String subjectNames = question.getSubjects().stream()
                        .map(Subject::getName)
                        .collect(Collectors.joining(", "));

                detailsList.add(new QuestionDetailDto(
                        questionNum,
                        subjectNames,
                        question.getLevel(),
                        studentAnswer,
                        correctLetter,
                        isCorrect ? "ACERTOU" : "ERROU",
                        question.getWeight(),
                        question.getPattern() != null ? question.getPattern().toString() : ""
                ));
            }

            Map<String, Object> params = new HashMap<>();
            params.put("studentName", response.getName());

            String formattedDate = (response.getCreatedAt() != null)
                    ? response.getCreatedAt().format(DateTimeFormatter.ofPattern("dd/MM/yyyy"))
                    : LocalDate.now().format(DateTimeFormatter.ofPattern("dd/MM/yyyy"));

            params.put("examDate", formattedDate);
            params.put("finalScore", (double) response.getCorrectAnswers());
            params.put("ipmScore", response.getIpmScore());
            params.put("punishmentScore", response.getPunishmentScore());
            params.put("comment", response.getComment());

            //TODO verificar uso do data source vs params
            byte[] pdfBytes = jasperReportService.generatePdf(
                    "student_diagnosis.jrxml",
                    params,
                    new JRBeanCollectionDataSource(detailsList)
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

    private String getCorrectLetterFromAlternatives(List<Alternative> alternatives) {
        if (alternatives == null) return "?";

        char[] letters = {'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'};

        for (int i = 0; i < alternatives.size(); i++) {
            if (alternatives.get(i).isQuestionAnswer()) {
                if (i < letters.length) {
                    return String.valueOf(letters[i]);
                }
            }
        }
        return "?";
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
}