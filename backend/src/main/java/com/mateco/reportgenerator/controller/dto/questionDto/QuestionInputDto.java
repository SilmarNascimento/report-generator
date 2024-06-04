package com.mateco.reportgenerator.controller.dto.questionDto;

import com.mateco.reportgenerator.controller.dto.alternativeDto.AlternativeInputDto;
import java.util.List;

public record QuestionInputDto(
    String title,
    String level,
    List<AlternativeInputDto> alternatives,
    String videoResolutionUrl
) {

}
