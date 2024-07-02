package com.mateco.reportgenerator.controller;

import com.mateco.reportgenerator.controller.dto.mockExamDto.MockExamInputDto;
import com.mateco.reportgenerator.controller.dto.responseDto.MockExamResponseOutputDto;
import com.mateco.reportgenerator.controller.dto.PageOutputDto;
import com.mateco.reportgenerator.controller.dto.responseDto.MockExamResponseWithFileOutputDto;
import com.mateco.reportgenerator.model.entity.MockExamResponse;
import com.mateco.reportgenerator.service.MockExamResponseServiceInterface;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/students-response")
@RequiredArgsConstructor
public class MockExamResponseController {
  private final MockExamResponseServiceInterface mockExamResponseService;

  @GetMapping
  public ResponseEntity<PageOutputDto<MockExamResponseOutputDto>> findAllMockExams(
      @RequestParam(required = false, defaultValue = "0") int pageNumber,
      @RequestParam(required = false, defaultValue = "20") int pageSize
  ) {
    Page<MockExamResponse> mockExamResponsePage = mockExamResponseService
        .findAllMockExamResponses(pageNumber, pageSize);

    return ResponseEntity
        .status(HttpStatus.OK)
        .body(PageOutputDto.parseDto(
            mockExamResponsePage,
            MockExamResponseOutputDto::parseDto
        ));
  }

  @GetMapping("/{mockExamResponseId}")
  public ResponseEntity<MockExamResponseOutputDto> findMockExamById(
      @PathVariable UUID mockExamResponseId
  ) {
    MockExamResponse mockExamResponse = mockExamResponseService
        .findMockExamResponseById(mockExamResponseId);

    return ResponseEntity
        .status(HttpStatus.OK)
        .body(MockExamResponseOutputDto
            .parseDto(mockExamResponse));
  }

  @GetMapping("/{mockExamResponseId}/download")
  public ResponseEntity<byte[]> downloadStudentDiagnosisByResponseId(
      @PathVariable UUID mockExamResponseId
  ) {
    MockExamResponse mockExamResponse = mockExamResponseService
        .findMockExamResponseById(mockExamResponseId);
    byte[] pdfContent = mockExamResponse.getDiagnosisPdfFile().getFileContent().getContent();

    return ResponseEntity
        .status(HttpStatus.OK)
        .contentType(MediaType.APPLICATION_PDF)
        .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + mockExamResponse.getDiagnosisPdfFile().getFileName() + "\"")
        .body(pdfContent);
  }

  @PatchMapping("/{mockExamResponseId}")
  public ResponseEntity<Void> generateCompleteDiagnosisById(
      @PathVariable UUID mockExamResponseId,
      @RequestPart(value = "personalInsightPdfFile") MultipartFile personalRecordPdfFile
  ) {
    mockExamResponseService.generateCompleteDiagnosisById(mockExamResponseId, personalRecordPdfFile);

    return ResponseEntity
        .status(HttpStatus.OK)
        .build();
  }

  @DeleteMapping("/{mockExamResponseId}")
  public ResponseEntity<Void> deleteMockExamById(@PathVariable UUID mockExamResponseId) {
    mockExamResponseService.deleteMockExamResponseById(mockExamResponseId);
    return ResponseEntity
        .status(HttpStatus.NO_CONTENT)
        .build();
  }
}
