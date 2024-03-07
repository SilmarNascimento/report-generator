package com.mateco.reportgenerator.controller;

import com.mateco.reportgenerator.controller.dto.questionDto.MainQuestionListInputDto;
import com.mateco.reportgenerator.controller.dto.mockExamDto.MockExamInputDto;
import com.mateco.reportgenerator.controller.dto.mockExamDto.MockExamOutpuDto;
import com.mateco.reportgenerator.controller.dto.MockExamResponseOutputDto;
import com.mateco.reportgenerator.controller.dto.PageOutputDto;
import com.mateco.reportgenerator.controller.dto.questionDto.MainQuestionOutputDto;
import com.mateco.reportgenerator.controller.dto.subjectDto.SubjectListInputDto;
import com.mateco.reportgenerator.model.entity.MockExam;
import com.mateco.reportgenerator.model.entity.MockExamResponse;
import com.mateco.reportgenerator.service.FileServiceInterface;
import com.mateco.reportgenerator.service.MockExamServiceInterface;
import java.io.IOException;
import java.util.List;
import java.util.UUID;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
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
@RequestMapping("/mock-exam")
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
  public ResponseEntity<PageOutputDto<MockExamOutpuDto>> findAllMockExams(
      @RequestParam(required = false, defaultValue = "0") int pageNumber,
      @RequestParam(required = false, defaultValue = "20") int pageSize
  ) {
    Page<MockExam> mockExamsPage = mockExamService.findAllMockExams(pageNumber, pageSize);
    return ResponseEntity
        .status(HttpStatus.OK)
        .body(PageOutputDto.parseDto(
            mockExamsPage,
            mockExam -> MockExamOutpuDto.parseDto(mockExam)
        ));
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
  public ResponseEntity<MockExamOutpuDto> createMockExam(@RequestBody MockExamInputDto mockExamInputDto) {
    MockExam mockExam = mockExamService.createMockExam(MockExam.parseMockExam(mockExamInputDto));
    return ResponseEntity
        .status(HttpStatus.CREATED)
        .body(MockExamOutpuDto.parseDto(mockExam));
  }

  @PutMapping("/{mockExamId}")
  public ResponseEntity<MockExamOutpuDto> updateMockExamById(
      @PathVariable UUID mockExamId,
      @RequestBody MockExamInputDto examInputDto
  ){
    MockExam updatedMockExam = mockExamService
        .updateMockExamById(mockExamId, MockExam.parseMockExam(examInputDto));

    return ResponseEntity
        .status(HttpStatus.OK)
        .body(MockExamOutpuDto.parseDto(updatedMockExam));
  }

  @DeleteMapping("/{mockExamId}")
  public ResponseEntity<Void> deleteMockExamById(@PathVariable UUID mockExamId) {
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
    mockExamService.removeMainQuestion(mockExamId, mainQuestionList.mainQuestionsId());
    return ResponseEntity
        .status(HttpStatus.NO_CONTENT)
        .build();
  }

  @PostMapping("/{mockExamId}/responses")
  public ResponseEntity<List<MockExamResponseOutputDto>> registerMockExamResponses(
      @RequestPart("studentsMockExamsAnswers") MultipartFile studentsAnswer,
      @PathVariable UUID mockExamId
  ) throws IOException {
    List<MockExamResponse> mockExamResponses= fileService.xlsxReader(studentsAnswer);

    List<MockExamResponse> examResponses = mockExamService.registerAllMockExamResponses(mockExamId, mockExamResponses);

    return ResponseEntity
        .status(HttpStatus.OK)
        .body(MockExamResponseOutputDto.parseDto(examResponses));
  }
}
