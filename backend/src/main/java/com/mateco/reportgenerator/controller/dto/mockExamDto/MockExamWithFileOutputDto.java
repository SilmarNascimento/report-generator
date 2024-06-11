package com.mateco.reportgenerator.controller.dto.mockExamDto;

import com.mateco.reportgenerator.controller.dto.FileEntityDto.FileEntityOutputDto;
import com.mateco.reportgenerator.controller.dto.subjectDto.SubjectOutputDto;
import com.mateco.reportgenerator.model.entity.MockExam;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

public record MockExamWithFileOutputDto(
    UUID id,
    String name,
    List<String> className,
    List<SubjectOutputDto> subjects,
    FileEntityOutputDto coverPdfFile,
    FileEntityOutputDto matrixPdfFile,
    FileEntityOutputDto answersPdfFile,
    int releasedYear,
    int number
) {
  public static MockExamWithFileOutputDto parseDto(MockExam mockExam) {
    return new MockExamWithFileOutputDto(
        mockExam.getId(),
        mockExam.getName(),
        mockExam.getClassName(),
        SubjectOutputDto.parseDto(mockExam.getSubjects()),
        FileEntityOutputDto.parseDto(mockExam.getCoverPdfFile()),
        FileEntityOutputDto.parseDto(mockExam.getMatrixPdfFile()),
        FileEntityOutputDto.parseDto(mockExam.getAnswersPdfFile()),
        mockExam.getReleasedYear(),
        mockExam.getNumber()
    );
  }

  public static List<MockExamWithFileOutputDto> parseDto(List<MockExam> mockExams) {
    return mockExams.stream()
        .map(mockExam -> new MockExamWithFileOutputDto(
            mockExam.getId(),
            mockExam.getName(),
            mockExam.getClassName(),
            SubjectOutputDto.parseDto(mockExam.getSubjects()),
            FileEntityOutputDto.parseDto(mockExam.getCoverPdfFile()),
            FileEntityOutputDto.parseDto(mockExam.getMatrixPdfFile()),
            FileEntityOutputDto.parseDto(mockExam.getAnswersPdfFile()),
            mockExam.getReleasedYear(),
            mockExam.getNumber()
            )
        ).collect(Collectors.toList());
  }
}
