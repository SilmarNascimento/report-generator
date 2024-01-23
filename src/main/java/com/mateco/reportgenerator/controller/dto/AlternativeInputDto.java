package com.mateco.reportgenerator.controller.dto;

import org.springframework.web.multipart.MultipartFile;

public record AlternativeInputDto(
    String description,
    MultipartFile image,
    boolean questionAnswer
) {

}
