package com.mateco.reportgenerator.controller.dto;

import com.mateco.reportgenerator.controller.dto.mockExamDto.MockExamOutpuDto;
import com.mateco.reportgenerator.controller.dto.questionDto.MainQuestionOutputDto;
import com.mateco.reportgenerator.controller.dto.subjectDto.SubjectOutputDto;
import com.mateco.reportgenerator.model.entity.MainQuestion;
import com.mateco.reportgenerator.model.entity.MockExam;
import com.mateco.reportgenerator.model.entity.Subject;
import java.util.List;
import java.util.function.Function;
import java.util.stream.Collectors;
import org.springframework.data.domain.Page;

public record PageOutputDto<Type>(
    int page,
    int itemsNumber,
    int pages,
    List<Type> data
) {
  public static <Type, Dto> PageOutputDto<Dto> parseDto(Page<Type> page, Function<Type, Dto> dtoConverter) {
    return new PageOutputDto<>(
        page.getNumber(),
        page.getNumberOfElements(),
        page.getTotalPages(),
        page.getContent().stream()
            .map(dtoConverter)
            .collect(Collectors.toList())
    );
  }
}
