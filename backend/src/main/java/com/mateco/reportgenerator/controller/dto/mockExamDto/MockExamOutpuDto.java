package com.mateco.reportgenerator.controller.dto.mockExamDto;

import com.mateco.reportgenerator.controller.dto.questionDto.MainQuestionOutputDto;
import com.mateco.reportgenerator.model.entity.MainQuestion;
import com.mateco.reportgenerator.model.entity.MockExam;
import com.mateco.reportgenerator.model.entity.Subject;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

public record MockExamOutpuDto(
    UUID id,
    String name,
    List<String> className,
    List<Subject> subjects,
    int releasedYear,
    int number,
    Map<Integer, MainQuestionOutputDto> mockExamQuestions
) {
  public static MockExamOutpuDto parseDto(MockExam mockExam) {
    return new MockExamOutpuDto(
        mockExam.getId(),
        mockExam.getName(),
        mockExam.getClassName(),
        mockExam.getSubjects(),
        mockExam.getReleasedYear(),
        mockExam.getNumber(),
        MockExamOutpuDto.parseMapDto(mockExam.getMockExamQuestions())
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
              MockExamOutpuDto.parseMapDto(mockExam.getMockExamQuestions())
          )
        ).collect(Collectors.toList());
  }

  private static Map<Integer, MainQuestionOutputDto> parseMapDto(Map<Integer, MainQuestion> questionsMap) {
    Map<Integer, MainQuestionOutputDto> mainQuestionsOutputExam = new HashMap<>();

    for (Map.Entry<Integer, MainQuestion> entry : questionsMap.entrySet()) {
      Integer questionNumber = entry.getKey();
      MainQuestion mainQuestion = entry.getValue();

      if (mainQuestion != null) {
        MainQuestionOutputDto outputDto = MainQuestionOutputDto.parseDto(mainQuestion);
        mainQuestionsOutputExam.put(questionNumber, outputDto);
      } else {
        mainQuestionsOutputExam.put(questionNumber, null);
      }
    }

    return mainQuestionsOutputExam;
  }
}
