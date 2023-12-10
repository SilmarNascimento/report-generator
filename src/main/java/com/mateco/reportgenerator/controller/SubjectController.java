package com.mateco.reportgenerator.controller;

import com.mateco.reportgenerator.service.SubjectServiceInterface;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
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

  public ResponseEntity<>
}
