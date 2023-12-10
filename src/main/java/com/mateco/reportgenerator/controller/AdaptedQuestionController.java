package com.mateco.reportgenerator.controller;

import com.mateco.reportgenerator.service.AdaptedQuestionServiceInterface;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/adapted-question")
public class AdaptedQuestionController {
  private final AdaptedQuestionServiceInterface adaptedQuestionService;

  @Autowired
  public AdaptedQuestionController(AdaptedQuestionServiceInterface adaptedQuestionService) {
    this.adaptedQuestionService = adaptedQuestionService;
  }
}
