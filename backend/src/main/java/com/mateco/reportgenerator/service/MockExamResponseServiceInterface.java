package com.mateco.reportgenerator.service;

import com.mateco.reportgenerator.model.entity.MockExamResponse;
import java.util.UUID;
import org.springframework.data.domain.Page;
import org.springframework.web.multipart.MultipartFile;

public interface MockExamResponseServiceInterface {
  Page<MockExamResponse> findAllMockExamResponses(int pageNumber, int pageSize);

  MockExamResponse findMockExamResponseById(UUID mockExamResponseId);

  MockExamResponse generateCompleteDiagnosisById(UUID mockExamResponseId, MultipartFile personalInsightPdfFile);

  void deleteMockExamResponseById(UUID mockExamResponseId);
}
