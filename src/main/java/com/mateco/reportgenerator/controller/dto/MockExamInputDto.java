package com.mateco.reportgenerator.controller.dto;

import java.util.List;

public record MockExamInputDto(
    String name,
    List<String> className,
    int number
) {

}
