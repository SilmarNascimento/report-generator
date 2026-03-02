package com.mateco.reportgenerator.controller;

import com.mateco.reportgenerator.controller.dto.PageOutputDto;
import com.mateco.reportgenerator.controller.dto.responseDto.MockExamResponseOutputDto;
import com.mateco.reportgenerator.controller.dto.sortDto.SortCriteriaDto;
import com.mateco.reportgenerator.model.entity.FileEntity;
import com.mateco.reportgenerator.model.entity.MockExamResponse;
import com.mateco.reportgenerator.service.MockExamResponseServiceInterface;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/students-response")
@RequiredArgsConstructor
public class MockExamResponseController {
    private final MockExamResponseServiceInterface mockExamResponseService;

    @GetMapping
    public ResponseEntity<PageOutputDto<MockExamResponseOutputDto>> findAllMockExamsResponse(
            @RequestParam(required = false, defaultValue = "0") int pageNumber,
            @RequestParam(required = false, defaultValue = "20") int pageSize,
            @RequestParam(required = false) String query,
            @RequestParam(required = false) List<String> sort
    ) {
        List<String> sortParams = (sort == null) ? new ArrayList<>() : sort;

        Page<MockExamResponse> mockExamResponsePage = mockExamResponseService
                .findAllMockExamResponses(pageNumber, pageSize, query, SortCriteriaDto.parseSortCriteria(sortParams));

        return ResponseEntity
                .status(HttpStatus.OK)
                .body(PageOutputDto.parseDto(
                        mockExamResponsePage,
                        MockExamResponseOutputDto::parseDto
                ));
    }

    @GetMapping("/{mockExamResponseId}")
    public ResponseEntity<MockExamResponseOutputDto> findMockExamResponseById(
            @PathVariable UUID mockExamResponseId
    ) {
        MockExamResponse mockExamResponse = mockExamResponseService
                .findMockExamResponseById(mockExamResponseId);

        return ResponseEntity
                .status(HttpStatus.OK)
                .body(MockExamResponseOutputDto
                        .parseDto(mockExamResponse));
    }

    @PatchMapping("/{mockExamResponseId}")
    public ResponseEntity<Void> generateCompleteDiagnosisById(
            @PathVariable UUID mockExamResponseId,
            @RequestPart(value = "personalRecordPdfFile") MultipartFile personalRecordPdfFile
    ) {
        mockExamResponseService.generateCompleteDiagnosisById(mockExamResponseId, personalRecordPdfFile);

        return ResponseEntity
                .status(HttpStatus.OK)
                .build();
    }

    @GetMapping("/{mockExamResponseId}/download")
    public ResponseEntity<byte[]> downloadStudentDiagnosisByResponseId(
            @PathVariable UUID mockExamResponseId
    ) {
        MockExamResponse mockExamResponse = mockExamResponseService
                .findMockExamResponseById(mockExamResponseId);

        FileEntity fileEntity = mockExamResponse.getDiagnosisPdfFile();
        byte[] pdfContent = fileEntity.getFileContent().getContent();

        ContentDisposition contentDisposition = ContentDisposition.attachment()
                .filename(fileEntity.getFileName(), StandardCharsets.UTF_8)
                .build();

        return ResponseEntity
                .status(HttpStatus.OK)
                .contentType(MediaType.APPLICATION_PDF)
                .header(HttpHeaders.CONTENT_DISPOSITION, contentDisposition.toString())
                .header(HttpHeaders.ACCESS_CONTROL_EXPOSE_HEADERS, HttpHeaders.CONTENT_DISPOSITION)
                .body(pdfContent);
    }

    @DeleteMapping("/{mockExamResponseId}")
    public ResponseEntity<Void> deleteMockExamResponseById(@PathVariable UUID mockExamResponseId) {
        mockExamResponseService.deleteMockExamResponseById(mockExamResponseId);
        return ResponseEntity
                .status(HttpStatus.NO_CONTENT)
                .build();
    }
}
