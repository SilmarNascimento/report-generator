package com.mateco.reportgenerator.service;

import com.mateco.reportgenerator.model.entity.MockExamResponse;
import java.util.UUID;
import org.springframework.data.domain.Page;

public interface MockExamResponseServiceInterface {
  Page<MockExamResponse> findAllMockExamResponses(int pageNumber, int pageSize);

  MockExamResponse findMockExamResponseById(UUID mockExamResponseId);

  void deleteMockExamResponseById(UUID mockExamResponseId);
}
