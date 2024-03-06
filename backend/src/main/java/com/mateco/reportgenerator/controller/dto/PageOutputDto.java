package com.mateco.reportgenerator.controller.dto;

import java.util.List;
import org.springframework.data.domain.Page;

public record PageOutputDto<Type>(
    int page,
    int itemsNumber,
    int pages,
    List<Type> data
) {
  public static <Type> PageOutputDto<Type> parseDto(Page<Type> page) {
    return new PageOutputDto<>(
        page.getNumber(),
        page.getNumberOfElements(),
        page.getTotalPages(),
        page.getContent()
    );
  }
}
