package com.mateco.reportgenerator.controller.dto;

import com.mateco.reportgenerator.model.entity.AdaptedQuestion;
import com.mateco.reportgenerator.model.entity.Alternative;
import com.mateco.reportgenerator.model.entity.Handout;
import com.mateco.reportgenerator.model.entity.MainQuestion;
import com.mateco.reportgenerator.model.entity.MockExam;
import com.mateco.reportgenerator.model.entity.Subject;
import java.util.List;
import java.util.UUID;

public record MainQuestionOutputDto(
    UUID id,
    String title,
    List<SubjectOutputDto> subjects,
    String level,
    List<AttachmentOutputDto> images,
    List<AlternativeOutputDto> alternatives,
    List<AdaptedQuestionOutputDto> adaptedQuestions,
    List<MockExam> mockExams,
    List<Handout> handout
) {
  public static MainQuestionOutputDto parseDto (MainQuestion mainQuestion) {
    return new MainQuestionOutputDto(
        mainQuestion.getId(),
        mainQuestion.getTitle(),
        SubjectOutputDto.parseDto(mainQuestion.getSubjects()),
        mainQuestion.getLevel(),
        AttachmentOutputDto.parseDto(mainQuestion.getImages()),
        AlternativeOutputDto.parseDto(mainQuestion.getAlternatives()),
        AdaptedQuestionOutputDto.parseDto(mainQuestion.getAdaptedQuestions()),
        mainQuestion.getMockExams(),
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
          AttachmentOutputDto.parseDto(mainQuestion.getImages()),
          AlternativeOutputDto.parseDto(mainQuestion.getAlternatives()),
          AdaptedQuestionOutputDto.parseDto(mainQuestion.getAdaptedQuestions()),
          mainQuestion.getMockExams(),
          mainQuestion.getHandout()
        )).toList();
  }
}
