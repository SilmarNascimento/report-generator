package com.mateco.reportgenerator.controller.dto;

import com.mateco.reportgenerator.model.entity.Alternative;
import java.util.List;

public record AlternativeOutputDto(
    String description,
    String image
) {
  public static AlternativeOutputDto parseDto(Alternative alternative) {
    return new AlternativeOutputDto(
        alternative.getDescription(),
        alternative.getImage()
    );
  }

  public static List<AlternativeOutputDto> parseDto(List<Alternative> alternatives) {
    return alternatives.stream()
        .map((Alternative alternative) -> new AlternativeOutputDto(
          alternative.getDescription(),
          alternative.getImage()))
        .toList();
  }
}
