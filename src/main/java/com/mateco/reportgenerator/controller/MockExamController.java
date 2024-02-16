package com.mateco.reportgenerator.controller;

import com.mateco.reportgenerator.controller.dto.MockExamOutpuDto;
import com.mateco.reportgenerator.model.entity.MockExam;
import com.mateco.reportgenerator.service.FileServiceInterface;
import com.mateco.reportgenerator.service.MockExamServiceInterface;
import java.util.List;
import java.util.UUID;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/mock-exams")
public class MockExamController {
  private final MockExamServiceInterface mockExamService;
  private final FileServiceInterface fileService;

  @Autowired
  public MockExamController(MockExamServiceInterface mockExamService,
      FileServiceInterface fileService) {
    this.mockExamService = mockExamService;
    this.fileService = fileService;
  }

  @GetMapping
  public ResponseEntity<List<MockExamOutpuDto>> findAllMockExams() {
    List<MockExam> mockExams = mockExamService.findAllMockExams();
    return ResponseEntity
        .status(HttpStatus.OK)
        .body(MockExamOutpuDto
            .parseDto(mockExams));
  }

  @GetMapping("/{mockExamId}")
  public ResponseEntity<MockExamOutpuDto> findMockExambyId(
      @PathVariable UUID mockExamId
  ) {
    MockExam mockExams = mockExamService.findMockExamById(mockExamId);
    return ResponseEntity
        .status(HttpStatus.OK)
        .body(MockExamOutpuDto
            .parseDto(mockExams));
  }
}
