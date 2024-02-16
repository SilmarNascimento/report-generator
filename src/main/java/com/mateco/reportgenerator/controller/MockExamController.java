package com.mateco.reportgenerator.controller;

import com.mateco.reportgenerator.controller.dto.MainQuestionListInputDto;
import com.mateco.reportgenerator.controller.dto.MainQuestionOutputDto;
import com.mateco.reportgenerator.controller.dto.MockExamInputDto;
import com.mateco.reportgenerator.controller.dto.MockExamOutpuDto;
import com.mateco.reportgenerator.controller.dto.MockExamResponseOutputDto;
import com.mateco.reportgenerator.controller.dto.SubjectListInputDto;
import com.mateco.reportgenerator.model.entity.AdaptedQuestion;
import com.mateco.reportgenerator.model.entity.MainQuestion;
import com.mateco.reportgenerator.model.entity.MockExam;
import com.mateco.reportgenerator.model.entity.MockExamResponse;
import com.mateco.reportgenerator.service.FileServiceInterface;
import com.mateco.reportgenerator.service.MockExamServiceInterface;
import com.mateco.reportgenerator.service.exception.NotFoundException;
import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.IntStream;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

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

  @PostMapping
  public ResponseEntity<MockExamOutpuDto> createMockExam(MockExamInputDto mockExamInputDto) {
    MockExam mockExam = mockExamService.createMockExam(MockExam.parseMockExam(mockExamInputDto));
    return ResponseEntity
        .status(HttpStatus.CREATED)
        .body(MockExamOutpuDto.parseDto(mockExam));
  }

  @PutMapping("/{mockExamId}")
  public ResponseEntity<MockExamOutpuDto> updateMockExamById(
      @RequestParam UUID mockExamId,
      @RequestBody MockExamInputDto examInputDto
  ){
    MockExam updatedMockExam = mockExamService
        .updateMockExamById(mockExamId, MockExam.parseMockExam(examInputDto));

    return ResponseEntity
        .status(HttpStatus.OK)
        .body(MockExamOutpuDto.parseDto(updatedMockExam));
  }

  @DeleteMapping("/{mockExamId}")
  public ResponseEntity<Void> deleteMockExamById(@RequestParam UUID mockExamId) {
    mockExamService.deleteMockExamById(mockExamId);
    return ResponseEntity
        .status(HttpStatus.NO_CONTENT)
        .build();
  }

  @PatchMapping("/{mockExamId}/subject")
  public ResponseEntity<MockExamOutpuDto> addSubjectToMockExam(
      @PathVariable UUID mockExamId,
      @RequestBody SubjectListInputDto subjectIdList
  ) {
    MockExam mockExamUpdated = mockExamService
        .addSubject(mockExamId, subjectIdList.subjectsId());
    return ResponseEntity
        .status(HttpStatus.OK)
        .body(MockExamOutpuDto.parseDto(mockExamUpdated));
  }

  @DeleteMapping("/{mockExamId}/subject")
  public ResponseEntity<Void> removeSubjectFromMockExam(
      @PathVariable UUID mockExamId,
      @RequestBody SubjectListInputDto subjectIdList
  ) {
    mockExamService.removeSubject(mockExamId, subjectIdList.subjectsId());
    return ResponseEntity
        .status(HttpStatus.NO_CONTENT)
        .build();
  }


  @PatchMapping("/{mockExamId}/main-question")
  public ResponseEntity<MockExamOutpuDto> addMainQuestionsToMockExam(
      @PathVariable UUID mockExamId,
      @RequestBody MainQuestionListInputDto mainQuestionList
  ) {
    MockExam mockExamUpdated = mockExamService
        .addMainQuestion(mockExamId, mainQuestionList.mainQuestionsId());
    return ResponseEntity
        .status(HttpStatus.OK)
        .body(MockExamOutpuDto.parseDto(mockExamUpdated));
  }

  @DeleteMapping("/{mockExamId}/main-question")
  public ResponseEntity<Void> removeMainQuestionsFromMockExam(
      @PathVariable UUID mockExamId,
      @RequestBody MainQuestionListInputDto mainQuestionList
  ) {
    mockExamService.removeSubject(mockExamId, mainQuestionList.mainQuestionsId());
    return ResponseEntity
        .status(HttpStatus.NO_CONTENT)
        .build();
  }

  @PostMapping("/mock-exam/{mockExamId}/responses")
  public ResponseEntity<List<MockExamResponseOutputDto>> registerMockExamResponses(
      @RequestPart("studentsMockExamsAnswers") MultipartFile studentsAnswer,
      @RequestParam UUID mockExamId
  ) throws IOException {
    List<MockExamResponse> mockExamResponses= fileService.xlsxReader(studentsAnswer);
    System.out.println(mockExamResponses);

    List<MockExamResponse> examResponses = mockExamService.registerAllMockExamResponses(mockExamResponses, mockExamId);

    return ResponseEntity
        .status(HttpStatus.OK)
        .body(MockExamResponseOutputDto.parseDto(examResponses));
  }
}
