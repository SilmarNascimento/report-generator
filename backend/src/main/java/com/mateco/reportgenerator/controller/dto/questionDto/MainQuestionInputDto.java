package com.mateco.reportgenerator.controller.dto.questionDto;

import com.mateco.reportgenerator.controller.dto.alternativeDto.AlternativeInputDto;
import com.mateco.reportgenerator.controller.dto.subjectDto.SubjectInputDto;
import java.util.List;

public record MainQuestionInputDto(
    String title,
    List<SubjectInputDto> subjects,
    String level,
    List<String> images,
    List<AlternativeInputDto> alternatives
) {

}
