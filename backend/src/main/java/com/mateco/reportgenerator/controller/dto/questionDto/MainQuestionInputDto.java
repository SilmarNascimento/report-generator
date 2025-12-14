package com.mateco.reportgenerator.controller.dto.questionDto;

import com.mateco.reportgenerator.controller.dto.alternativeDto.AlternativeInputDto;
import com.mateco.reportgenerator.controller.dto.subjectDto.SubjectInputDto;
import com.mateco.reportgenerator.enums.Pattern;

import java.util.List;

public record MainQuestionInputDto(
        String title,
        List<SubjectInputDto> subjects,
        String level,
        int lerickucas,
        Pattern pattern,
        List<String> images,
        List<AlternativeInputDto> alternatives,
        String videoResolutionUrl
) {}
