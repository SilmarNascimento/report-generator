package com.mateco.reportgenerator.controller.dto.responseDto;

import com.mateco.reportgenerator.controller.dto.FileEntityDto.FileEntityOutputDto;
import com.mateco.reportgenerator.model.entity.MockExamResponse;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

public record MockExamResponseWithFileOutputDto(
    UUID id,
    String name,
    String email,
    UUID mockExamId,
    String examCode,
    String className,
    int correctAnswers,
    List<String> response,
    FileEntityOutputDto diagnosisPdfFile,
    String comment,
    LocalDateTime createdAt
) {
  public static MockExamResponseWithFileOutputDto parseDto(MockExamResponse examResponse) {
    return new MockExamResponseWithFileOutputDto(
        examResponse.getId(),
        examResponse.getName(),
        examResponse.getEmail(),
        examResponse.getMockExam().getId(),
        examResponse.getMockExam().generateCode(),
        examResponse.getMockExam().getClassName().get(0),
        examResponse.getCorrectAnswers(),
        examResponse.getResponses(),
        FileEntityOutputDto.parseDto(examResponse.getDiagnosisPdfFile()),
        examResponse.getComment(),
        examResponse.getCreatedAt()
    );
  }

  public static List<MockExamResponseWithFileOutputDto> parseDto(List<MockExamResponse> examResponses) {
    return examResponses.stream()
        .map(examResponse -> new MockExamResponseWithFileOutputDto(
            examResponse.getId(),
            examResponse.getName(),
            examResponse.getEmail(),
            examResponse.getMockExam().getId(),
            examResponse.getMockExam().generateCode(),
            examResponse.getMockExam().getClassName().get(0),
            examResponse.getCorrectAnswers(),
            examResponse.getResponses(),
            FileEntityOutputDto.parseDto(examResponse.getDiagnosisPdfFile()),
            examResponse.getComment(),
            examResponse.getCreatedAt()
          )
        ).collect(Collectors.toList());
  }
}
