package com.mateco.reportgenerator.controller.dto;

import com.mateco.reportgenerator.controller.dto.mockExamDto.MockExamOutputDto;
import com.mateco.reportgenerator.model.entity.AdaptedQuestion;
import com.mateco.reportgenerator.model.entity.MainQuestion;
import com.mateco.reportgenerator.model.entity.MockExamResponse;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

public record MockExamResponseOutputDto(
    UUID id,
    String name,
    String email,
    MockExamOutputDto mockExam,
    int correctAnswers,
    List<String> response,
    List<List<AdaptedQuestion>> adaptedQuestionsList,
    String comment,
    LocalDateTime createdAt
) {

  public static List<MockExamResponseOutputDto> parseDto(List<MockExamResponse> examResponses) {

    return examResponses.stream()
        .map(examResponse -> {
            Map<Integer, MainQuestion> mockExamQuestions = examResponse.getMockExam().getMockExamQuestions();

            List<Integer> missedMainQuestionsNumbers = examResponse.getMissedMainQuestionNumbers();
            List<List<AdaptedQuestion>> listOfAdaptedQuestionList = missedMainQuestionsNumbers.stream()
                .map(questionIndex -> {
                  MainQuestion mainQuestion = mockExamQuestions.get(questionIndex);
                  return mainQuestion.getAdaptedQuestions();
                })
                .toList();

            return new MockExamResponseOutputDto(
                examResponse.getId(),
                examResponse.getName(),
                examResponse.getEmail(),
                MockExamOutputDto.parseDto(examResponse.getMockExam()),
                examResponse.getCorrectAnswers(),
                examResponse.getResponses(),
                listOfAdaptedQuestionList,
                examResponse.getComment(),
                examResponse.getCreatedAt()
            );
        }).collect(Collectors.toList());
  }
}
