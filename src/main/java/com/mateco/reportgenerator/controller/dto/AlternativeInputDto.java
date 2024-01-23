package com.mateco.reportgenerator.controller.dto;

import java.util.List;
import org.springframework.web.multipart.MultipartFile;

public record AlternativeInputDto(
    String description,
    List<MultipartFile> image,
    boolean questionAnswer
) {

}
