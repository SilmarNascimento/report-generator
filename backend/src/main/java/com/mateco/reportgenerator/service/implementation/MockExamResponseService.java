package com.mateco.reportgenerator.service.implementation;

import com.mateco.reportgenerator.controller.dto.sortDto.SortCriteriaDto;
import com.mateco.reportgenerator.model.entity.FileEntity;
import com.mateco.reportgenerator.model.entity.MainQuestion;
import com.mateco.reportgenerator.model.entity.MockExam;
import com.mateco.reportgenerator.model.entity.MockExamResponse;
import com.mateco.reportgenerator.model.repository.MockExamResponseRepository;
import com.mateco.reportgenerator.service.MockExamResponseServiceInterface;
import com.mateco.reportgenerator.service.exception.InvalidDataException;
import com.mateco.reportgenerator.service.exception.NotFoundException;
import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import org.apache.pdfbox.multipdf.PDFMergerUtility;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
@RequiredArgsConstructor
public class MockExamResponseService implements MockExamResponseServiceInterface {
  private final MockExamResponseRepository mockExamResponseRepository;

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

      pdfFilesToMerge.add(mockExam.getCoverPdfFile());
      pdfFilesToMerge.add(personalRecordPdfFileEntity);
      pdfFilesToMerge.add(mockExam.getMatrixPdfFile());
      pdfFilesToMerge.addAll(personalAdaptedQuestionPdfFile);
      pdfFilesToMerge.add(mockExam.getAnswersPdfFile());

      PDDocument mergedPDFDocument = mergePDFs(pdfFilesToMerge);
      String diagnosisFileName = "DIAGNÓSTICO SIMULADO " + String.format("%02d", mockExam.getNumber()) + " - " + examResponseFound.getName().toUpperCase();
      FileEntity diagnosisPdfEntity = new FileEntity(mergedPDFDocument, diagnosisFileName);
      mergedPDFDocument.close();

      examResponseFound.setDiagnosisPdfFile(diagnosisPdfEntity);
      mockExamResponseRepository.save(examResponseFound);
    } catch (IOException e) {
      throw new RuntimeException(e);
    }
  }

  @Override
  public void deleteMockExamResponseById(UUID mockExamResponseId) {
    mockExamResponseRepository.deleteById(mockExamResponseId);
  }

  public PDDocument mergePDFs(List<FileEntity> fileEntities) throws IOException {
    PDFMergerUtility pdfMerger = new PDFMergerUtility();
    PDDocument mergedDocument = new PDDocument();

    for (FileEntity fileEntity : fileEntities) {
      byte[] pdfBytes = fileEntity.getFileContent().getContent();
      ByteArrayInputStream byteArrayInputStream = new ByteArrayInputStream(pdfBytes);
      PDDocument document = PDDocument.load(byteArrayInputStream);

      pdfMerger.appendDocument(mergedDocument, document);
      document.close();
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
}
