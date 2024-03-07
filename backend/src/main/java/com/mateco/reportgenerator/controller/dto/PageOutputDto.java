package com.mateco.reportgenerator.controller.dto;

import com.mateco.reportgenerator.controller.dto.mockExamDto.MockExamOutpuDto;
import com.mateco.reportgenerator.controller.dto.questionDto.MainQuestionOutputDto;
import com.mateco.reportgenerator.controller.dto.subjectDto.SubjectOutputDto;
import com.mateco.reportgenerator.model.entity.MainQuestion;
import com.mateco.reportgenerator.model.entity.MockExam;
import com.mateco.reportgenerator.model.entity.Subject;
import java.util.List;
import org.springframework.data.domain.Page;

public record PageOutputDto<Type>(
    int page,
    int itemsNumber,
    int pages,
    List<Type> data
) {
  public static PageOutputDto<SubjectOutputDto> parseSubjectPageDto(Page<Subject> page) {
    return new PageOutputDto<>(
        page.getNumber(),
        page.getNumberOfElements(),
        page.getTotalPages(),
        SubjectOutputDto.parseDto(page.getContent())
    );
  }

  public static PageOutputDto<MainQuestionOutputDto> parseMainQuestionPageDto(Page<MainQuestion> page) {
    return new PageOutputDto<>(
        page.getNumber(),
        page.getNumberOfElements(),
        page.getTotalPages(),
        MainQuestionOutputDto.parseDto(page.getContent())
    );
  }

  public static PageOutputDto<MockExamOutpuDto> parseMockExamPageDto(Page<MockExam> page) {
    return new PageOutputDto<>(
        page.getNumber(),
        page.getNumberOfElements(),
        page.getTotalPages(),
        MockExamOutpuDto.parseDto(page.getContent())
    );
  }
}
