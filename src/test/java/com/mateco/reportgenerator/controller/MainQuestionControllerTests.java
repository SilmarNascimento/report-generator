package com.mateco.reportgenerator.controller;

import com.mateco.reportgenerator.service.ImageServiceInterface;
import com.mateco.reportgenerator.service.implementation.AdaptedQuestionService;
import com.mateco.reportgenerator.service.implementation.MainQuestionService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.web.servlet.MockMvc;

@SpringBootTest
@AutoConfigureMockMvc
public class MainQuestionControllerTests {
  @Autowired
  MockMvc mockMvc;

  @MockBean
  private MainQuestionService mainQuestionService;
  @MockBean
  private AdaptedQuestionService adaptedQuestionService;
  @MockBean
  private ImageServiceInterface imageService;

  @Test
  @DisplayName("")
  public void nomeDoTest() {

  }
}
