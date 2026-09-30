package com.mateco.reportgenerator.controller.dto.questionDto;

import com.mateco.reportgenerator.controller.dto.alternativeDto.AlternativeInputDto;
import com.mateco.reportgenerator.enums.Pattern;

import java.util.List;
import java.util.UUID;

public record MainQuestionInputDto(
        String title,
        UUID mainSubjectId,
        List<UUID> secondarySubjectsId,
        String level,
        int lerickucas,
        Pattern pattern,
        List<AlternativeInputDto> alternatives,
        String videoResolutionUrl
) {}
