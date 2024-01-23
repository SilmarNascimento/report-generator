package com.mateco.reportgenerator.controller.dto;

import com.mateco.reportgenerator.model.entity.Alternative;
import java.util.List;
import java.util.UUID;

public record AlternativeOutputDto(
    UUID id,
    String description,
    List<AttachmentOutputDto> images,
    boolean questionAnswer
) {
  public static AlternativeOutputDto parseDto(Alternative alternative) {
    return new AlternativeOutputDto(
        alternative.getId(),
        alternative.getDescription(),
        AttachmentOutputDto.parseDto(alternative.getImage()),
        alternative.isQuestionAnswer()
    );
  }

  public static List<AlternativeOutputDto> parseDto(List<Alternative> alternatives) {
    return alternatives.stream()
        .map((Alternative alternative) -> new AlternativeOutputDto(
          alternative.getId(),
          alternative.getDescription(),
          AttachmentOutputDto.parseDto(alternative.getImage()),
          alternative.isQuestionAnswer()))
        .toList();
  }
}
