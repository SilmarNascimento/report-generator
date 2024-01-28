package com.mateco.reportgenerator.controller.dto;

import com.mateco.reportgenerator.model.entity.Alternative;
import java.util.List;
import org.springframework.web.multipart.MultipartFile;

public record QuestionInputDto(
    String title,
    String level,
    List<AlternativeInputDto> alternatives
) {

}
