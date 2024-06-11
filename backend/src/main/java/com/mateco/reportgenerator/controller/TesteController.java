package com.mateco.reportgenerator.controller;

import com.mateco.reportgenerator.controller.dto.mockExamDto.MockExamOutputDto;
import com.mateco.reportgenerator.controller.dto.mockExamDto.MockExamWithFileOutputDto;
import com.mateco.reportgenerator.controller.dto.questionDto.MainQuestionOutputDto;
import com.mateco.reportgenerator.model.entity.MockExam;
import com.mateco.reportgenerator.model.repository.FileEntityRepository;
import com.mateco.reportgenerator.service.MockExamServiceInterface;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/tests")
@RequiredArgsConstructor
public class TesteController {
  private final FileEntityRepository fileEntityRepository;
  private final MockExamServiceInterface mockExamService;


  @GetMapping(value = "/{mockExamId}", produces = MediaType.MULTIPART_FORM_DATA_VALUE)
  public ResponseEntity<MultiValueMap<String, Object>> getMockExam(@PathVariable UUID mockExamId) {
    MockExam mockExam = mockExamService.findMockExamById(mockExamId);
    System.out.println(mockExam.getMockExamQuestions().size());

    MultiValueMap<String, Object> body = new LinkedMultiValueMap<>();

    HttpHeaders mockExamDtoHeaders = new HttpHeaders();
    mockExamDtoHeaders.set(HttpHeaders.CONTENT_TYPE, "application/json; charset=UTF-8");
    body.add("mockExamOutputDto", new HttpEntity<>(MockExamOutputDto.parseDto(mockExam), mockExamDtoHeaders));

    HttpHeaders coverFileHeaders = new HttpHeaders();
    coverFileHeaders.setContentDispositionFormData("coverPdfFile", "cover.pdf");
    coverFileHeaders.set(HttpHeaders.CONTENT_TYPE, "application/pdf; charset=UTF-8");
    body.add(
        "coverPdfFile",
        new HttpEntity<>(new ByteArrayResource(mockExam.getCoverPdfFile().getFileContent().getContent()), coverFileHeaders)
    );
    ByteArrayResource exemplo = new ByteArrayResource(mockExam.getCoverPdfFile().getFileContent().getContent());
    System.out.println(exemplo.contentLength());

    HttpHeaders matrixFileHeaders = new HttpHeaders();
    matrixFileHeaders.setContentDispositionFormData("matrixPdfFile", "matrix.pdf");
    matrixFileHeaders.set(HttpHeaders.CONTENT_TYPE, "application/pdf; charset=UTF-8");
    body.add(
        "matrixPdfFile",
        new HttpEntity<>(new ByteArrayResource(mockExam.getMatrixPdfFile().getFileContent().getContent()), matrixFileHeaders)
    );

    HttpHeaders answersFileHeaders = new HttpHeaders();
    answersFileHeaders.setContentDispositionFormData("answersPdfFile", "answers.pdf");
    answersFileHeaders.set(HttpHeaders.CONTENT_TYPE, "application/pdf; charset=UTF-8");
    body.add(
        "answersPdfFile",
        new HttpEntity<>(new ByteArrayResource(mockExam.getAnswersPdfFile().getFileContent().getContent()), answersFileHeaders)
    );

    return new ResponseEntity<>(body, HttpStatus.OK);
  }

  @GetMapping("/{mockExamId}/complete")
  public ResponseEntity<MockExamWithFileOutputDto> findCompleteMockExamById(@PathVariable UUID mockExamId) {
    MockExam mockExam = mockExamService.findMockExamById(mockExamId);

    return ResponseEntity
        .status(HttpStatus.OK)
        .body(MockExamWithFileOutputDto
            .parseDto(mockExam));
  }
}

