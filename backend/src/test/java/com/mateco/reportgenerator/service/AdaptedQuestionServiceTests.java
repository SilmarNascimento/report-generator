package com.mateco.reportgenerator.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;

import com.mateco.reportgenerator.model.entity.AdaptedQuestion;
import com.mateco.reportgenerator.model.entity.Alternative;
import com.mateco.reportgenerator.model.entity.MainQuestion;
import com.mateco.reportgenerator.model.repository.AdaptedQuestionRepository;
import com.mateco.reportgenerator.model.repository.MainQuestionRepository;
import com.mateco.reportgenerator.model.repository.SubjectRepository;
import com.mateco.reportgenerator.service.exception.ConflictDataException;
import com.mateco.reportgenerator.service.exception.NotFoundException;
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
import org.springframework.test.context.ActiveProfiles;

@SpringBootTest
@ActiveProfiles("test")
@ExtendWith(MockitoExtension.class)
public class AdaptedQuestionServiceTests {
  @Autowired
  private AdaptedQuestionServiceInterface adaptedQuestionService;

  @MockBean
  private MainQuestionRepository mainQuestionRepository;
  @MockBean
  private AdaptedQuestionRepository adaptedQuestionRepository;
  @MockBean
  private ImageServiceInterface imageService;
  @MockBean
  private SubjectRepository subjectRepository;

  private UUID mockMainQuestionId;
  private UUID mockAdaptedQuestionId;
  private MainQuestion mockMainQuestion;
  private AdaptedQuestion mockAdaptedQuestion01;
  private AdaptedQuestion mockAdaptedQuestion02;

  @BeforeEach
  public void setUp() {
    mockMainQuestionId = UUID.randomUUID();
    mockAdaptedQuestionId = UUID.randomUUID();
    mockMainQuestion = new MainQuestion();
    mockMainQuestion.setId(mockMainQuestionId);
    
    mockAdaptedQuestion01 = new AdaptedQuestion(
        "titulo da questão adaptada 01",
        "médio",
        List.of("imagem 01", "imagem 02"),
        List.of(new Alternative(), new Alternative())
    );
    mockAdaptedQuestion02 = new AdaptedQuestion(
        "titulo da questão adaptada 02",
        "fácil",
        List.of("imagem 03", "imagem 04"),
        List.of(new Alternative(), new Alternative())
    );
    mockAdaptedQuestion01.setMainQuestion(mockMainQuestion);
    mockAdaptedQuestion02.setMainQuestion(mockMainQuestion);
  }

  @Test
  @DisplayName("Verifica se é retornado uma lista de todas as entidades AdaptedQuestions de uma MainQuestion")
  public void findAllAdaptedQuestionFromMainQuestionTest() {
    Mockito
        .when(adaptedQuestionRepository.findAllByMainQuestionId(mockMainQuestionId))
        .thenReturn(List.of(mockAdaptedQuestion01, mockAdaptedQuestion02));

    List<AdaptedQuestion> serviceResponse = adaptedQuestionService.findAllAdaptedQuestionFromMainQuestion(mockMainQuestionId);

    assertEquals(2, serviceResponse.size());
    assertTrue(serviceResponse.contains(mockAdaptedQuestion01));
    assertTrue(serviceResponse.contains(mockAdaptedQuestion02));

    Mockito.verify(adaptedQuestionRepository).findAllByMainQuestionId(mockMainQuestionId);
  }

  @Test
  @DisplayName("Verifica se é retornado a entidade AdaptedQuestion por seu Id")
  public void findAdaptedQuestionsFromMainQuestionByIdTest() {
    Mockito
        .when(adaptedQuestionRepository.findById(mockAdaptedQuestionId))
        .thenReturn(Optional.of(mockAdaptedQuestion01));

    AdaptedQuestion serviceResponse = adaptedQuestionService
        .findAdaptedQuestionsFromMainQuestionById(
            mockMainQuestionId,
            mockAdaptedQuestionId
        );

    assertEquals(serviceResponse, mockAdaptedQuestion01);
    assertEquals(serviceResponse.getMainQuestion(), mockMainQuestion);

    Mockito.verify(adaptedQuestionRepository).findById(mockAdaptedQuestionId);
  }

  @Test
  @DisplayName("Verifica se ocorre o disparo de uma exceção caso não se encontre uma entidade AdaptedQuestion por seu Id")
  public void findAdaptedQuestionsFromMainQuestionByIdTestNotFoundError() {
    Mockito
        .when(adaptedQuestionRepository.findById(mockAdaptedQuestionId))
        .thenReturn(Optional.empty());

    assertThrows(
        NotFoundException.class,
        () -> adaptedQuestionService.findAdaptedQuestionsFromMainQuestionById(mockMainQuestionId, mockAdaptedQuestionId)
    );

    Mockito.verify(adaptedQuestionRepository).findById(mockAdaptedQuestionId);
  }

  @Test
  @DisplayName("Verifica se ocorre o disparo de uma exceção caso não se encontre uma entidade AdaptedQuestion relacionada ao Id da MainQuestion")
  public void findAdaptedQuestionsFromMainQuestionByIdTestConflictDataError() {
    Mockito
        .when(adaptedQuestionRepository.findById(mockAdaptedQuestionId))
        .thenReturn(Optional.of(mockAdaptedQuestion02));

    assertThrows(
        ConflictDataException.class,
        () -> adaptedQuestionService.findAdaptedQuestionsFromMainQuestionById(UUID.randomUUID(), mockAdaptedQuestionId)
    );

    Mockito.verify(adaptedQuestionRepository).findById(mockAdaptedQuestionId);
  }

  @Test
  @DisplayName("Verifica se é retornado a entidade AdaptedQuestion atualizada por seu Id")
  public void updateAdaptedQuestionOfMainQuestionByIdTest() {
    Mockito
        .when(adaptedQuestionRepository.findById(mockAdaptedQuestionId))
        .thenReturn(Optional.of(mockAdaptedQuestion01));

    Mockito
        .doNothing().when(imageService).deleteImages(any());

    Mockito
        .when(adaptedQuestionRepository.save(any(AdaptedQuestion.class)))
        .thenAnswer(invocation -> invocation.getArgument(0));

    AdaptedQuestion serviceResponse = adaptedQuestionService
        .updateAdaptedQuestionOfMainQuestionById(
            mockMainQuestionId,
            mockAdaptedQuestionId,
            mockAdaptedQuestion02,
            List.of("imagem questão nova 01", "imagem alternativa nova 01", "imagem alternativa nova 02")
        );

    assertNotNull(serviceResponse);
    assertEquals(serviceResponse.getMainQuestion(), mockMainQuestion);
    assertEquals("titulo da questão adaptada 02", serviceResponse.getTitle());
    assertEquals("fácil", serviceResponse.getLevel());
    assertEquals(List.of("imagem questão nova 01"), serviceResponse.getImages());

    List<Alternative> alternativeResponse = serviceResponse.getAlternatives();
    assertEquals(List.of("imagem alternativa nova 01"), alternativeResponse.get(0).getImages());
    assertEquals(List.of("imagem alternativa nova 02"), alternativeResponse.get(1).getImages());

    Mockito.verify(adaptedQuestionRepository).findById(mockAdaptedQuestionId);
    Mockito.verify(imageService, Mockito.times(3)).deleteImages(any());
  }

  @Test
  @DisplayName("Verifica se ocorre o disparo de uma exceção caso não se encontre uma entidade AdaptedQuestion por seu Id")
  public void updateAdaptedQuestionOfMainQuestionByIdTestNotFoundError() {
    Mockito
        .when(adaptedQuestionRepository.findById(mockAdaptedQuestionId))
        .thenReturn(Optional.empty());

    assertThrows(
        NotFoundException.class,
        () -> adaptedQuestionService.updateAdaptedQuestionOfMainQuestionById(
                  mockMainQuestionId,
                  mockAdaptedQuestionId,
                  mockAdaptedQuestion02,
                  List.of("imagem questão nova 01", "imagem alternativa nova 01", "imagem alternativa nova 02")
              )
    );

    Mockito.verify(adaptedQuestionRepository).findById(mockAdaptedQuestionId);
  }

  @Test
  @DisplayName("Verifica se ocorre o disparo de uma exceção caso não se encontre uma entidade AdaptedQuestion por seu Id")
  public void updateAdaptedQuestionOfMainQuestionByIdTestConflictDataError() {
    Mockito
        .when(adaptedQuestionRepository.findById(mockAdaptedQuestionId))
        .thenReturn(Optional.of(mockAdaptedQuestion02));

    assertThrows(
        ConflictDataException.class,
        () -> adaptedQuestionService.updateAdaptedQuestionOfMainQuestionById(
            UUID.randomUUID(),
            mockAdaptedQuestionId,
            mockAdaptedQuestion02,
            List.of("imagem questão nova 01", "imagem alternativa nova 01", "imagem alternativa nova 02")
        )
    );

    Mockito.verify(adaptedQuestionRepository).findById(mockAdaptedQuestionId);
  }
}
