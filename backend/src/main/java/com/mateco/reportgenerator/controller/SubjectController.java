package com.mateco.reportgenerator.controller;

import com.mateco.reportgenerator.controller.dto.PageOutputDto;
import com.mateco.reportgenerator.controller.dto.SubjectInputDto;
import com.mateco.reportgenerator.controller.dto.SubjectOutputDto;
import com.mateco.reportgenerator.model.entity.Subject;
import com.mateco.reportgenerator.service.SubjectServiceInterface;
import java.util.List;
import java.util.UUID;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/subject")
public class SubjectController {
  private final SubjectServiceInterface subjectService;

  @Autowired
  public SubjectController(SubjectServiceInterface subjectService) {
    this.subjectService = subjectService;
  }

  @GetMapping
  public ResponseEntity<PageOutputDto<Subject>> findAllSubjects(
      @RequestParam(required = false, defaultValue = "0") int pageNumber,
      @RequestParam(required = false, defaultValue = "20") int pageSize
  ) {
    Page<Subject> subjectPage = subjectService.findAllSubjects(pageNumber, pageSize);
    return ResponseEntity
        .status(HttpStatus.OK)
        .body(PageOutputDto.parseDto(subjectPage));
  }

  @GetMapping("/{subjectId}")
  public ResponseEntity<SubjectOutputDto> findSubjectById(@PathVariable UUID subjectId) {
    return ResponseEntity
        .status(HttpStatus.OK)
        .body(SubjectOutputDto.parseDto(subjectService.findSubjectById(subjectId)));
  }

  @PostMapping
  public ResponseEntity<SubjectOutputDto> createSubject(@RequestBody SubjectInputDto subjectInputDto) {
    Subject subjectCreated = subjectService.createSubject(Subject.parseSubject(subjectInputDto));
    return ResponseEntity
        .status(HttpStatus.CREATED)
        .body(SubjectOutputDto.parseDto(subjectCreated));
  }

  @PutMapping("/{subjectId}")
  public ResponseEntity<SubjectOutputDto> updateSubjectById(
      @PathVariable UUID subjectId,
      @RequestBody SubjectInputDto subjectInputDto
  ) {
    Subject updatedSubject = subjectService.updateSubject(subjectId, Subject.parseSubject(subjectInputDto));
    return ResponseEntity
        .status(HttpStatus.OK)
        .body(SubjectOutputDto.parseDto(updatedSubject));
  }

  @DeleteMapping("/{subjectId}")
  public ResponseEntity<Void> deleteSubjectById(@PathVariable UUID subjectId) {
    subjectService.deleteSubject(subjectId);
    return ResponseEntity
        .status(HttpStatus.NO_CONTENT)
        .build();
  }
}
