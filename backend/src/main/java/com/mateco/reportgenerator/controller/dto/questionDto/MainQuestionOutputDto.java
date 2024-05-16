package com.mateco.reportgenerator.controller.dto.questionDto;

import com.mateco.reportgenerator.controller.dto.alternativeDto.AlternativeOutputDto;
import com.mateco.reportgenerator.controller.dto.mockExamDto.MockExamListOutputDto;
import com.mateco.reportgenerator.controller.dto.subjectDto.SubjectOutputDto;
import com.mateco.reportgenerator.model.entity.Handout;
import com.mateco.reportgenerator.model.entity.MainQuestion;
import com.mateco.reportgenerator.model.entity.MockExam;
import java.util.List;
import java.util.UUID;

public record MainQuestionOutputDto(
    UUID id,
    String title,
    List<SubjectOutputDto> subjects,
    String level,
    List<String> images,
    List<AlternativeOutputDto> alternatives,
    List<AdaptedQuestionOutputDto> adaptedQuestions,
    List<MockExamListOutputDto> mockExams,
    List<Handout> handouts
) {
  public static MainQuestionOutputDto parseDto (MainQuestion mainQuestion) {
    return new MainQuestionOutputDto(
        mainQuestion.getId(),
        mainQuestion.getTitle(),
        SubjectOutputDto.parseDto(mainQuestion.getSubjects()),
        mainQuestion.getLevel(),
        mainQuestion.getImages(),
        AlternativeOutputDto.parseDto(mainQuestion.getAlternatives()),
        AdaptedQuestionOutputDto.parseDto(mainQuestion.getAdaptedQuestions()),
        MockExamListOutputDto.parseDto(mainQuestion.getMockExams()),
        mainQuestion.getHandout()
    );
  }

  public static List<MainQuestionOutputDto> parseDto (List<MainQuestion> mainQuestionList) {
    return mainQuestionList.stream()
        .map((MainQuestion mainQuestion) -> new MainQuestionOutputDto(
          mainQuestion.getId(),
          mainQuestion.getTitle(),
          SubjectOutputDto.parseDto(mainQuestion.getSubjects()),
          mainQuestion.getLevel(),
          mainQuestion.getImages(),
          AlternativeOutputDto.parseDto(mainQuestion.getAlternatives()),
          AdaptedQuestionOutputDto.parseDto(mainQuestion.getAdaptedQuestions()),
            MockExamListOutputDto.parseDto(mainQuestion.getMockExams()),
          mainQuestion.getHandout()
        )).toList();
  }
}
