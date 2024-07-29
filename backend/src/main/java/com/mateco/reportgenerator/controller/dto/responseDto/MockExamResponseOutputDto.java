package com.mateco.reportgenerator.controller.dto.responseDto;

import com.mateco.reportgenerator.controller.dto.FileEntityDto.FileEntityOutputDto;
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
    String examCode,
    String className,
    int correctAnswers,
    List<String> response,
    boolean hasDiagnosisPdfFile,
    String comment,
    LocalDateTime createdAt
) {
  public static MockExamResponseOutputDto parseDto(MockExamResponse examResponse) {
    return new MockExamResponseOutputDto(
      examResponse.getId(),
      examResponse.getName(),
      examResponse.getEmail(),
      examResponse.getMockExam().getId(),
      examResponse.getMockExam().generateCode(),
      examResponse.getMockExam().getClassName().get(0),
      examResponse.getCorrectAnswers(),
      examResponse.getResponses(),
      !(examResponse.getDiagnosisPdfFile() == null),
      examResponse.getComment(),
      examResponse.getCreatedAt()
    );
  }

  public static List<MockExamResponseOutputDto> parseDto(List<MockExamResponse> examResponses) {
    return examResponses.stream()
      .map(examResponse -> new MockExamResponseOutputDto(
          examResponse.getId(),
          examResponse.getName(),
          examResponse.getEmail(),
          examResponse.getMockExam().getId(),
          examResponse.getMockExam().generateCode(),
          examResponse.getMockExam().getClassName().get(0),
          examResponse.getCorrectAnswers(),
          examResponse.getResponses(),
          !(examResponse.getDiagnosisPdfFile() == null),
          examResponse.getComment(),
          examResponse.getCreatedAt()
        )
      ).collect(Collectors.toList());
  }
}
