package com.mateco.reportgenerator.controller.dto.alternativeDto;

import java.util.List;
import org.springframework.web.multipart.MultipartFile;

public record AlternativeInputDto(
    String description,
    boolean questionAnswer
) {

}
