package com.mateco.reportgenerator.service;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;

import com.mateco.reportgenerator.model.entity.MainQuestion;
import com.mateco.reportgenerator.model.repository.AdaptedQuestionRepository;
import com.mateco.reportgenerator.model.repository.MainQuestionRepository;
import com.mateco.reportgenerator.model.repository.SubjectRepository;
import com.mateco.reportgenerator.service.implementation.MainQuestionService;
import java.util.Optional;
import java.util.UUID;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;

@SpringBootTest
public class MainQuestionServiceTests {
  @Autowired
  private MainQuestionService mainQuestionService;

  @MockBean
  private MainQuestionRepository mainQuestionRepository;
  @MockBean
  private AdaptedQuestionRepository adaptedQuestionRepository;
  @MockBean
  private ImageServiceInterface imageService;
  @MockBean
  private SubjectRepository subjectRepository;

  @Test
  @DisplayName("")
  public void nomeDoTest() {

    Mockito
        .when(mainQuestionRepository.findById(any()))
        .thenReturn(Optional.of(new MainQuestion()));

    Mockito.verify(mainQuestionRepository).findById(eq(any()));
  }
}
