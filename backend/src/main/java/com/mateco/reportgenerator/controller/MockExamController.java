package com.mateco.reportgenerator.controller;

import com.mateco.reportgenerator.controller.dto.FileEntityDto.FileDownloadDto;
import com.mateco.reportgenerator.controller.dto.PageOutputDto;
import com.mateco.reportgenerator.controller.dto.mockExamDto.MockExamInputDto;
import com.mateco.reportgenerator.controller.dto.mockExamDto.MockExamOutputDto;
import com.mateco.reportgenerator.controller.dto.mockExamDto.MockExamWithFileOutputDto;
import com.mateco.reportgenerator.controller.dto.questionDto.MainQuestionListInputDto;
import com.mateco.reportgenerator.controller.dto.responseDto.MockExamResponseOutputDto;
import com.mateco.reportgenerator.controller.dto.subjectDto.SubjectListInputDto;
import com.mateco.reportgenerator.model.entity.MockExam;
import com.mateco.reportgenerator.model.entity.MockExamResponse;
import com.mateco.reportgenerator.service.FileServiceInterface;
import com.mateco.reportgenerator.service.MockExamServiceInterface;
import com.mateco.reportgenerator.service.implementation.MockExamResponseService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/mock-exam")
@RequiredArgsConstructor
public class MockExamController {
    private final MockExamServiceInterface mockExamService;
    private final FileServiceInterface fileService;

    private final MockExamResponseService mockExamResponseService;

    @GetMapping
    public ResponseEntity<PageOutputDto<MockExamOutputDto>> findAllMockExams(
            @RequestParam(required = false, defaultValue = "0") int pageNumber,
            @RequestParam(required = false, defaultValue = "20") int pageSize
    ) {
        Page<MockExam> mockExamsPage = mockExamService.findAllMockExams(pageNumber, pageSize);
        return ResponseEntity
                .status(HttpStatus.OK)
                .body(PageOutputDto.parseDto(
                        mockExamsPage,
                        MockExamOutputDto::parseDto
                ));
    }

    @GetMapping("/{mockExamId}")
    public ResponseEntity<MockExamWithFileOutputDto> findCompleteMockExamById(@PathVariable UUID mockExamId) {
        MockExam mockExam = mockExamService.findMockExamById(mockExamId);

        return ResponseEntity
                .status(HttpStatus.OK)
                .body(MockExamWithFileOutputDto
                        .parseDto(mockExam));
    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<MockExamOutputDto> createMockExam(
            @RequestPart(value = "mockExamInputDto") MockExamInputDto mockExamInputDto,
            @RequestPart(value = "coverPdfFile") MultipartFile coverPdfFile,
            @RequestPart(value = "matrixPdfFile") MultipartFile matrixPdfFile,
            @RequestPart(value = "answersPdfFile") MultipartFile answersPdfFile
    ) throws IOException {
        MockExam mockExam = mockExamService.createMockExam(
                MockExam.parseMockExam(mockExamInputDto),
                coverPdfFile,
                matrixPdfFile,
                answersPdfFile
        );

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(MockExamOutputDto.parseDto(mockExam));
    }

    @PutMapping(value = "/{mockExamId}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<MockExamOutputDto> updateMockExamById(
            @PathVariable UUID mockExamId,
            @RequestPart(value = "mockExamInputDto") MockExamInputDto mockExamInputDto,
            @RequestPart(value = "coverPdfFile", required = false) MultipartFile coverPdfFile,
            @RequestPart(value = "matrixPdfFile", required = false) MultipartFile matrixPdfFile,
            @RequestPart(value = "answersPdfFile", required = false) MultipartFile answersPdfFile
    ) throws IOException {
        MockExam updatedMockExam = mockExamService
                .updateMockExamById(
                        mockExamId,
                        MockExam.parseMockExam(mockExamInputDto),
                        coverPdfFile,
                        matrixPdfFile,
                        answersPdfFile
                );

        return ResponseEntity
                .status(HttpStatus.OK)
                .body(MockExamOutputDto.parseDto(updatedMockExam));
    }

    @DeleteMapping("/{mockExamId}")
    public ResponseEntity<Void> deleteMockExamById(@PathVariable UUID mockExamId) {
        mockExamService.deleteMockExamById(mockExamId);
        return ResponseEntity
                .status(HttpStatus.NO_CONTENT)
                .build();
    }

    @PatchMapping("/{mockExamId}/subject")
    public ResponseEntity<MockExamOutputDto> addSubjectToMockExam(
            @PathVariable UUID mockExamId,
            @RequestBody SubjectListInputDto subjectIdList
    ) {
        MockExam mockExamUpdated = mockExamService
                .addSubject(mockExamId, subjectIdList.subjectsId());
        return ResponseEntity
                .status(HttpStatus.OK)
                .body(MockExamOutputDto.parseDto(mockExamUpdated));
    }

    @DeleteMapping("/{mockExamId}/subject")
    public ResponseEntity<MockExamOutputDto> removeSubjectFromMockExam(
            @PathVariable UUID mockExamId,
            @RequestBody SubjectListInputDto subjectIdList
    ) {
        MockExam mockExamUpdated = mockExamService.removeSubject(mockExamId, subjectIdList.subjectsId());
        return ResponseEntity
                .status(HttpStatus.OK)
                .body(MockExamOutputDto.parseDto(mockExamUpdated));
    }


    @PatchMapping("/{mockExamId}/main-question")
    public ResponseEntity<MockExamOutputDto> addMainQuestionsToMockExam(
            @PathVariable UUID mockExamId,
            @RequestBody MainQuestionListInputDto mainQuestionList
    ) {
        MockExam mockExamUpdated = mockExamService
                .addMainQuestion(mockExamId, mainQuestionList.mainQuestionsId());
        return ResponseEntity
                .status(HttpStatus.OK)
                .body(MockExamOutputDto.parseDto(mockExamUpdated));
    }

    @DeleteMapping("/{mockExamId}/main-question")
    public ResponseEntity<MockExamOutputDto> removeMainQuestionsFromMockExam(
            @PathVariable UUID mockExamId,
            @RequestBody MainQuestionListInputDto mainQuestionList
    ) {
        MockExam mockExamUpdated = mockExamService.removeMainQuestion(mockExamId, mainQuestionList.mainQuestionsId());
        return ResponseEntity
                .status(HttpStatus.OK)
                .body(MockExamOutputDto.parseDto(mockExamUpdated));
    }

    @PostMapping(value = "/{mockExamId}/responses", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<List<MockExamResponseOutputDto>> registerIncompleteMockExamResponses(
            @RequestPart("studentsMockExamsAnswers") MultipartFile studentsAnswer,
            @PathVariable UUID mockExamId
    ) throws IOException {
        List<MockExamResponse> mockExamResponses = fileService.xlsxReader(studentsAnswer);

        List<MockExamResponse> examResponses = mockExamService.registerAllMockExamResponses(mockExamId, mockExamResponses);

        return ResponseEntity
                .status(HttpStatus.OK)
                .body(MockExamResponseOutputDto.parseDto(examResponses));
    }

    @PostMapping("/{id}/generate-diagnosis")
    public ResponseEntity<Void> generateDiagnosis(@PathVariable UUID id) {
        mockExamResponseService.generateAndAttachDiagnosisPdf(id);
        return ResponseEntity.noContent().build();
    }
    
    @PostMapping("/generate-diagnosis/batch")
    public ResponseEntity<Void> generateDiagnosisBatch(@RequestBody List<UUID> ids) {
        try {
            mockExamResponseService.generateAllDiagnosisPdfs(ids);
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            // Caso ocorra um erro de I/O ou outro problema grave que pare todo o lote
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping("/{id}/download-diagnosis")
    public ResponseEntity<byte[]> downloadDiagnosis(@PathVariable UUID id) {
        FileDownloadDto fileDto = mockExamResponseService.getDiagnosisPdfFile(id);
        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(fileDto.contentType()))
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + fileDto.fileName() + "\"")
                .body(fileDto.content());
    }
}
