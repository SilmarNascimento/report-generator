package com.mateco.reportgenerator.controller.dto;

import com.mateco.reportgenerator.model.entity.AdaptedQuestion;
import com.mateco.reportgenerator.model.entity.Alternative;
import java.util.List;
import java.util.UUID;

public record AdaptedQuestionOutputDto(
    UUID id,
    String title,
    String level,
    List<AttachmentOutputDto> images,
    List<Alternative>alternatives

) {
  public static AdaptedQuestionOutputDto parseDto(AdaptedQuestion adaptedQuestion) {
    return new AdaptedQuestionOutputDto(
        adaptedQuestion.getId(),
        adaptedQuestion.getTitle(),
        adaptedQuestion.getLevel(),
        AttachmentOutputDto.parseDto(adaptedQuestion.getImages()),
        adaptedQuestion.getAlternatives()
    );
  }

  public static List<AdaptedQuestionOutputDto> parseDto(List<AdaptedQuestion> adaptedQuestionList) {
    return adaptedQuestionList.stream()
        .map((AdaptedQuestion adaptedQuestion) -> new AdaptedQuestionOutputDto(
          adaptedQuestion.getId(),
          adaptedQuestion.getTitle(),
          adaptedQuestion.getLevel(),
          AttachmentOutputDto.parseDto(adaptedQuestion.getImages()),
          adaptedQuestion.getAlternatives()
        )).toList();
  }
}
