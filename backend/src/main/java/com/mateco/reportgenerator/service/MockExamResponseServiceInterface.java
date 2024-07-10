package com.mateco.reportgenerator.service;

import com.mateco.reportgenerator.controller.dto.sortDto.SortCriteriaDto;
import com.mateco.reportgenerator.model.entity.MockExamResponse;
import java.util.List;
import java.util.UUID;
import org.springframework.data.domain.Page;
import org.springframework.web.multipart.MultipartFile;

public interface MockExamResponseServiceInterface {
  Page<MockExamResponse> findAllMockExamResponses(int pageNumber, int pageSize, String query, List<SortCriteriaDto> sortCriteria);

  MockExamResponse findMockExamResponseById(UUID mockExamResponseId);

  void generateCompleteDiagnosisById(UUID mockExamResponseId, MultipartFile personalInsightPdfFile);

  void deleteMockExamResponseById(UUID mockExamResponseId);
}
