package com.mateco.reportgenerator.controller;

import com.mateco.reportgenerator.controller.dto.SubjectOutputDto;
import com.mateco.reportgenerator.service.SubjectServiceInterface;
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
@RequestMapping("/subjects")
public class SubjectController {
  private final SubjectServiceInterface subjectService;

  @Autowired
  public SubjectController(SubjectServiceInterface subjectService) {
    this.subjectService = subjectService;
  }

  @GetMapping
  public ResponseEntity<List<SubjectOutputDto>> findAllSubject(@PathVariable UUID subjectId) {
    return ResponseEntity
        .status(HttpStatus.OK)
        .body(SubjectOutputDto.parseDto(subjectService.findAllSubjects()));
  }

  @GetMapping("/{subjectId}")
  public ResponseEntity<SubjectOutputDto> findSubjectById(@PathVariable UUID subjectId) {
    return ResponseEntity
        .status(HttpStatus.OK)
        .body(SubjectOutputDto.parseDto(subjectService.findSubjectById(subjectId)));
  }
}
