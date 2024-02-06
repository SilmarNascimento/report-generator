package com.mateco.reportgenerator.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;

import com.mateco.reportgenerator.model.entity.AdaptedQuestion;
import com.mateco.reportgenerator.model.entity.Alternative;
import com.mateco.reportgenerator.model.entity.MainQuestion;
import com.mateco.reportgenerator.model.repository.AdaptedQuestionRepository;
import com.mateco.reportgenerator.model.repository.MainQuestionRepository;
import com.mateco.reportgenerator.model.repository.SubjectRepository;
import com.mateco.reportgenerator.service.exception.ConflictDataException;
import com.mateco.reportgenerator.service.exception.NotFoundException;
import com.mateco.reportgenerator.service.implementation.MainQuestionService;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mockito;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;

@SpringBootTest
@ExtendWith(MockitoExtension.class)
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

  private UUID mockMainQuestionId;
  private MainQuestion mockMainQuestion01;
  private MainQuestion mockMainQuestion02;
  private Alternative mockAlternative01;
  private Alternative mockAlternative02;

  @BeforeEach
  public void setUp() {
    mockMainQuestionId = UUID.randomUUID();
    mockAlternative01 = new Alternative(
      "descrição da alternativa 01",
      List.of("imagem alternativa 01"),
      false
    );
    mockAlternative02 = new Alternative(
        "descrição da alternativa 02",
        List.of("imagem alternativa 02"),
        true
    );

    mockMainQuestion01 = new MainQuestion(
        "título questão 01",
        new ArrayList<>(),
        "difícil",
        List.of("imagem 01 da questão"),
        List.of(mockAlternative01, mockAlternative02),
        new ArrayList<>(),
        new ArrayList<>(),
        new ArrayList<>()
    );
    mockMainQuestion02 = new MainQuestion(
        "título questão 02",
        new ArrayList<>(),
        "difícil",
        List.of("imagem 01 da questão"),
        List.of(mockAlternative01, mockAlternative02),
        new ArrayList<>(),
        new ArrayList<>(),
        new ArrayList<>()
    );
  }
  @Test
  @DisplayName("Verifica se é retornado uma lista de todas as entidades MainQuestion")
  public void findAllMainQuestionsTest() {
    Mockito
        .when(mainQuestionRepository.findAll())
        .thenReturn(List.of(mockMainQuestion01, mockMainQuestion02));

    List<MainQuestion> serviceResponse = mainQuestionService.findAllMainQuestions();

    assertEquals(2, serviceResponse.size());
    assertTrue(serviceResponse.contains(mockMainQuestion01));
    assertTrue(serviceResponse.contains(mockMainQuestion02));

    Mockito.verify(mainQuestionRepository).findAll();
  }

  @Test
  @DisplayName("Verifica se é retornado a entidade AdaptedQuestion por seu Id")
  public void findMainQuestionByIdTest() {
    Mockito
        .when(mainQuestionRepository.findById(mockMainQuestionId))
        .thenReturn(Optional.of(mockMainQuestion01));

    MainQuestion serviceResponse = mainQuestionService.findMainQuestionById(mockMainQuestionId);

    assertNotNull(serviceResponse);
    assertEquals(serviceResponse, mockMainQuestion01);

    Mockito.verify(mainQuestionRepository).findById(mockMainQuestionId);
  }

  @Test
  @DisplayName("Verifica se ocorre o disparo de uma exceção caso não se encontre uma entidade MainQuestion por seu Id")
  public void findMainQuestionByIdTestNotFoundError() {
    Mockito
        .when(mainQuestionRepository.findById(mockMainQuestionId))
        .thenReturn(Optional.empty());

    assertThrows(
        NotFoundException.class,
        () -> mainQuestionService.findMainQuestionById(mockMainQuestionId)
    );

    Mockito.verify(mainQuestionRepository).findById(mockMainQuestionId);
  }

  @Test
  @DisplayName("Verifica se é criada uma entidade MainQuestion")
  public void createMainQuestionTest() {
    Mockito
        .when(mainQuestionRepository.save(any(MainQuestion.class)))
        .thenAnswer(invocation -> invocation.getArgument(0));

    MainQuestion serviceResponse = mainQuestionService.createMainQuestion(
        mockMainQuestion01,
        List.of("imagem descrição", "imagem alternative 01", "imagem alternativa 02")
    );

    assertNotNull(serviceResponse);
    assertEquals(serviceResponse.getTitle(), mockMainQuestion01.getTitle());
    assertEquals(serviceResponse.getLevel(), mockMainQuestion01.getLevel());
    assertEquals(serviceResponse.getImages(), List.of("imagem descrição"));

    List<Alternative> mainQuestionAlternatives = serviceResponse.getAlternatives();
    assertEquals(mainQuestionAlternatives.get(0).getImages(), List.of("imagem alternative 01"));
    assertEquals(mainQuestionAlternatives.get(1).getImages(), List.of("imagem alternativa 02"));

    Mockito.verify(mainQuestionRepository).save(any(MainQuestion.class));
  }

  @Test
  @DisplayName("Verifica se é retornado a entidade MainQuestion atualizada por seu Id")
  public void updateMainQuestionByIdTest() {
    Mockito
        .when(mainQuestionRepository.findById(mockMainQuestionId))
        .thenReturn(Optional.of(mockMainQuestion01));

    Mockito
        .doNothing().when(imageService).deleteImages(any());

    Mockito
        .when(mainQuestionRepository.save(any(MainQuestion.class)))
        .thenAnswer(invocation -> invocation.getArgument(0));

    MainQuestion serviceResponse = mainQuestionService
        .updateMainQuestionById(
            mockMainQuestionId,
            mockMainQuestion02,
            List.of("imagem questão nova 01", "imagem alternativa nova 01", "imagem alternativa nova 02")
        );

    assertNotNull(serviceResponse);
    assertEquals("título questão 02", serviceResponse.getTitle());
    assertEquals("difícil", serviceResponse.getLevel());
    assertEquals(List.of("imagem questão nova 01"), serviceResponse.getImages());

    List<Alternative> alternativeResponse = serviceResponse.getAlternatives();
    assertEquals(List.of("imagem alternativa nova 01"), alternativeResponse.get(0).getImages());
    assertEquals(List.of("imagem alternativa nova 02"), alternativeResponse.get(1).getImages());

    Mockito.verify(mainQuestionRepository).findById(mockMainQuestionId);
    Mockito.verify(imageService, Mockito.times(3)).deleteImages(any());
  }

  @Test
  @DisplayName("Verifica se ocorre o disparo de uma exceção caso não se encontre uma entidade MainQuestion por seu Id")
  public void updateAdaptedQuestionOfMainQuestionByIdTestNotFoundError() {
    Mockito
        .when(mainQuestionRepository.findById(mockMainQuestionId))
        .thenReturn(Optional.empty());

    assertThrows(
        NotFoundException.class,
        () -> mainQuestionService.updateMainQuestionById(
            mockMainQuestionId,
            mockMainQuestion02,
            List.of("imagem questão nova 01", "imagem alternativa nova 01", "imagem alternativa nova 02")
        )
    );

    Mockito.verify(mainQuestionRepository).findById(mockMainQuestionId);
  }

  @Test
  @DisplayName("Verifica se a entidade MainQuestion é deletada por seu Id")
  public void deleteMainQuestionByIdTest() {
    Mockito
        .when(mainQuestionRepository.findById(mockMainQuestionId))
        .thenReturn(Optional.of(mockMainQuestion01));

    Mockito
        .doNothing().when(imageService).deleteImages(any());

    Mockito
        .doNothing().when(mainQuestionRepository).deleteById(any());

    mainQuestionService.deleteMainQuestionById(mockMainQuestionId);

    Mockito.verify(mainQuestionRepository).findById(mockMainQuestionId);
    Mockito.verify(imageService, Mockito.times(1)).deleteImages(any());
    Mockito.verify(mainQuestionRepository).deleteById(mockMainQuestionId);
  }

  @Test
  @DisplayName("Verifica se ocorre o disparo de uma exceção caso não se encontre uma entidade MainQuestion por seu Id")
  public void deleteMainQuestionByIdTestNotFoundError() {
    Mockito
        .when(mainQuestionRepository.findById(mockMainQuestionId))
        .thenReturn(Optional.empty());

    assertThrows(
        NotFoundException.class,
        () -> mainQuestionService.deleteMainQuestionById(mockMainQuestionId)
    );

    Mockito.verify(mainQuestionRepository).findById(mockMainQuestionId);
  }
}
