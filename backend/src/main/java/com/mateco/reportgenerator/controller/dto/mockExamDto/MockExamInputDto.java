package com.mateco.reportgenerator.controller.dto.mockExamDto;

import java.util.List;

public record MockExamInputDto(
    String name,
    List<String> className,
    int releasedYear,
    int number
) {

}
