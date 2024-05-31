package com.mateco.reportgenerator.service.implementation;

import com.mateco.reportgenerator.model.entity.MockExam;
import com.mateco.reportgenerator.model.entity.MockExamResponse;
import com.mateco.reportgenerator.model.repository.MockExamResponseRepository;
import com.mateco.reportgenerator.service.MockExamResponseServiceInterface;
import com.mateco.reportgenerator.service.exception.NotFoundException;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class MockExamResponseService implements MockExamResponseServiceInterface {
  private final MockExamResponseRepository mockExamResponseRepository;

  @Override
  public Page<MockExamResponse> findAllMockExamResponses(int pageNumber, int pageSize) {
    Pageable pageable = PageRequest.of(pageNumber, pageSize);
    return mockExamResponseRepository.findAll(pageable);
  }

  @Override
  public MockExamResponse findMockExamResponseById(UUID mockExamResponseId) {
    return mockExamResponseRepository.findById(mockExamResponseId)
        .orElseThrow(() -> new NotFoundException("Resposta de Simulado não encontrada"));
  }

  @Override
  public void deleteMockExamResponseById(UUID mockExamResponseId) {
    mockExamResponseRepository.deleteById(mockExamResponseId);
  }

}
