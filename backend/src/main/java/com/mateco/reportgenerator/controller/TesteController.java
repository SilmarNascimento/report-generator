package com.mateco.reportgenerator.controller;

import com.mateco.reportgenerator.model.entity.MockExamResponse;
import com.mateco.reportgenerator.service.FileServiceInterface;
import com.mateco.reportgenerator.service.MockExamServiceInterface;
import java.io.IOException;
import java.util.List;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/tests")
@RequiredArgsConstructor
public class TesteController {
  private final FileServiceInterface fileService;
  private final MockExamServiceInterface mockExamService;


  @GetMapping("/{mockExamId}")
  public ResponseEntity<List<MockExamResponse>> getMockExam(
      @RequestPart("studentsMockExamsAnswers") MultipartFile studentsAnswer,
      @PathVariable UUID mockExamId
  ) throws IOException {
    List<MockExamResponse> mockExamResponses= fileService.xlsxReader(studentsAnswer);

    List<MockExamResponse> examResponses = mockExamService.registerAllMockExamResponses(mockExamId, mockExamResponses);
    return ResponseEntity.ok().body(examResponses);
  }
}

