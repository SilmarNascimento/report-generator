package com.mateco.reportgenerator.controller.dto.mockExamDto;

import com.mateco.reportgenerator.controller.dto.questionDto.MainQuestionOutputDto;
import com.mateco.reportgenerator.model.entity.MockExam;
import com.mateco.reportgenerator.model.entity.Subject;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

public record MockExamOutpuDto(
    UUID id,
    String name,
    List<String> className,
    List<Subject> subjects,
    int releasedYear,
    int number,
    List<MainQuestionOutputDto> mockExamQuestions
) {
  public static MockExamOutpuDto parseDto(MockExam mockExam) {
    return new MockExamOutpuDto(
        mockExam.getId(),
        mockExam.getName(),
        mockExam.getClassName(),
        mockExam.getSubjects(),
        mockExam.getReleasedYear(),
        mockExam.getNumber(),
        MainQuestionOutputDto.parseDto(mockExam.getMockExamQuestions())
    );
  }

  public static List<MockExamOutpuDto> parseDto(List<MockExam> mockExams) {
    return mockExams.stream()
        .map(mockExam -> new MockExamOutpuDto(
              mockExam.getId(),
              mockExam.getName(),
              mockExam.getClassName(),
              mockExam.getSubjects(),
              mockExam.getReleasedYear(),
              mockExam.getNumber(),
              MainQuestionOutputDto.parseDto(mockExam.getMockExamQuestions())
          )
        ).collect(Collectors.toList());
  }
}
