package com.mateco.reportgenerator.controller;

import com.mateco.reportgenerator.service.MainQuestionServiceInterface;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/main-questions")
public class MainQuestionController {
  private final MainQuestionServiceInterface mainQuestionService;

  @Autowired
  public MainQuestionController(MainQuestionServiceInterface mainQuestionService) {
    this.mainQuestionService = mainQuestionService;
  }
}
