package com.mateco.reportgenerator.controller.dto;

import com.mateco.reportgenerator.model.entity.Alternative;
import java.util.List;
import java.util.UUID;

public record AdaptedQuestionInputDto(
    String title,
    String level,
    String image,
    List<Alternative>alternatives,
    Alternative answer
) {

}
