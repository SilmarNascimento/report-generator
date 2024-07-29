package com.mateco.reportgenerator.controller.dto.mockExamDto;

import com.mateco.reportgenerator.model.entity.MockExam;
import com.mateco.reportgenerator.model.entity.Subject;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

public record MockExamListOutputDto(
    UUID id,
    String name,
    List<String> className,
    List<Subject> subjects,
    int releasedYear,
    int number
) {
  public static MockExamListOutputDto parseDto(MockExam mockExam) {
    return new MockExamListOutputDto(
        mockExam.getId(),
        mockExam.getName(),
        mockExam.getClassName(),
        mockExam.getSubjects(),
        mockExam.getReleasedYear(),
        mockExam.getNumber()
    );
  }

  public static List<MockExamListOutputDto> parseDto(List<MockExam> mockExams) {
    return mockExams.stream()
        .map(mockExam -> new MockExamListOutputDto(
                mockExam.getId(),
                mockExam.getName(),
                mockExam.getClassName(),
                mockExam.getSubjects(),
                mockExam.getReleasedYear(),
                mockExam.getNumber()
            )
        ).collect(Collectors.toList());
  }
}
