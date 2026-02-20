package com.mateco.reportgenerator.controller.dto.questionDto;

import com.mateco.reportgenerator.controller.dto.alternativeDto.AlternativeInputDto;
import com.mateco.reportgenerator.enums.Pattern;

import java.util.List;

public record QuestionInputDto(
        String title,
        String level,
        int lerickucas,
        Pattern pattern,
        List<AlternativeInputDto> alternatives,
        String videoResolutionUrl
) {}
