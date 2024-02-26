package com.mateco.reportgenerator.controller.dto;

import com.mateco.reportgenerator.model.entity.AdaptedQuestionWrapper;
import com.mateco.reportgenerator.model.entity.MockExamResponse;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

public record MockExamResponseOutputDto(
    UUID id,
    String name,
    String email,
    UUID mockExamId,
    int correctAnswers,
    List<String> response,
    List<AdaptedQuestionWrapper> adaptedQuestions,
    String comment,
    LocalDateTime createdAt
) {

  public static List<MockExamResponseOutputDto> parseDto(List<MockExamResponse> examResponses) {
    return examResponses.stream()
        .map(examResponse -> new MockExamResponseOutputDto(
                examResponse.getId(),
                examResponse.getName(),
                examResponse.getEmail(),
                examResponse.getMockExam().getId(),
                examResponse.getCorrectAnswers(),
                examResponse.getResponses(),
                examResponse.getAdaptedQuestionList(),
                examResponse.getComment(),
                examResponse.getCreatedAt()
        )).collect(Collectors.toList());
  }
}
