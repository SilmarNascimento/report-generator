package com.mateco.reportgenerator.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;

import com.mateco.reportgenerator.model.entity.AdaptedQuestion;
import com.mateco.reportgenerator.model.entity.Alternative;
import com.mateco.reportgenerator.model.entity.MainQuestion;
import com.mateco.reportgenerator.model.entity.Subject;
import com.mateco.reportgenerator.model.repository.AdaptedQuestionRepository;
import com.mateco.reportgenerator.model.repository.MainQuestionRepository;
import com.mateco.reportgenerator.model.repository.SubjectRepository;
import com.mateco.reportgenerator.service.exception.ConflictDataException;
import com.mateco.reportgenerator.service.exception.NotFoundException;
import com.mateco.reportgenerator.service.implementation.MainQuestionService;
import java.util.ArrayList;
import java.util.Collection;
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
  private UUID mockAdaptedQuestionId;
  private UUID mockAdaptedQuestionId02;
  private UUID mockSubjectId01;
  private UUID mockSubjectId02;
  private MainQuestion mockMainQuestion01;
  private MainQuestion mockMainQuestion02;
  private AdaptedQuestion mockAdaptedQuestion01;
  private AdaptedQuestion mockAdaptedQuestion02;
  private Subject mockSubject01;
  private Subject mockSubject02;

  @BeforeEach
  public void setUp() {
    mockMainQuestionId = UUID.randomUUID();
    mockAdaptedQuestionId = UUID.randomUUID();
    mockSubjectId01 = UUID.randomUUID();
    mockSubjectId02 = UUID.randomUUID();

    Alternative mockAlternative01 = new Alternative(
        "descrição da alternativa 01",
        List.of("imagem alternativa 01"),
        false
    );
    Alternative mockAlternative02 = new Alternative(
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

    mockSubject01 = new Subject("Geometria");
    mockSubject01.setId(mockSubjectId01);
    mockMainQuestion01.getSubjects().add(mockSubject01);

    mockSubject02 = new Subject("Algebra");
    mockSubject02.setId(mockSubjectId02);

    mockAdaptedQuestion01 = new AdaptedQuestion(
        "titulo da questão adaptada 01",
        "médio",
        new ArrayList<>(),
        List.of(mockAlternative01, mockAlternative02)
    );
    mockAdaptedQuestion01.setMainQuestion(mockMainQuestion02);
    mockAdaptedQuestion01.setId(mockAdaptedQuestionId);

    mockAdaptedQuestion02 = new AdaptedQuestion(
        "titulo da questão adaptada 01",
        "médio",
        new ArrayList<>(),
        List.of(mockAlternative01, mockAlternative02)
    );
    mockAdaptedQuestionId02 = UUID.randomUUID();
    mockAdaptedQuestion02.setId(mockAdaptedQuestionId02);
    mockMainQuestion01.getAdaptedQuestions().add(mockAdaptedQuestion02);
    mockAdaptedQuestion02.setMainQuestion(mockMainQuestion01);
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

  @Test
  @DisplayName("Verifica se é adicionado uma lista de entidades Subject à uma MainQuestion")
  public void addSubjectTest() {
    Mockito
        .when(mainQuestionRepository.findById(mockMainQuestionId))
        .thenReturn(Optional.of(mockMainQuestion01));

    Mockito
        .when(subjectRepository.findAllById(List.of(mockSubjectId02)))
        .thenReturn(List.of(mockSubject02));

    Mockito
        .when(mainQuestionRepository.save(any(MainQuestion.class)))
        .thenAnswer(invocation -> invocation.getArgument(0));

    MainQuestion serviceResponse = mainQuestionService
        .addSubject(
            mockMainQuestionId,
            List.of(mockSubjectId02)
        );

    assertNotNull(serviceResponse);

    List<Subject> subjectResponseList = serviceResponse.getSubjects();
    assertEquals(2, subjectResponseList.size());
    assertTrue(subjectResponseList.contains(mockSubject01));
    assertTrue(subjectResponseList.contains(mockSubject02));

    Mockito.verify(mainQuestionRepository).findById(mockMainQuestionId);
    Mockito.verify(subjectRepository).findAllById(List.of(mockSubjectId02));
    Mockito.verify(mainQuestionRepository).save(any(MainQuestion.class));
  }

  @Test
  @DisplayName("Verifica se é adicionado uma lista de entidades Subject à uma MainQuestion sem repetições")
  public void addSubjectWithDuplicatesTest() {
    Mockito
        .when(mainQuestionRepository.findById(mockMainQuestionId))
        .thenReturn(Optional.of(mockMainQuestion01));

    Mockito
        .when(subjectRepository.findAllById(List.of(mockSubjectId01, mockSubjectId02)))
        .thenReturn(List.of(mockSubject01, mockSubject02));

    Mockito
        .when(mainQuestionRepository.save(any(MainQuestion.class)))
        .thenAnswer(invocation -> invocation.getArgument(0));

    MainQuestion serviceResponse = mainQuestionService
        .addSubject(
            mockMainQuestionId,
            List.of(mockSubjectId01, mockSubjectId02)
        );

    assertNotNull(serviceResponse);

    List<Subject> subjectResponseList = serviceResponse.getSubjects();
    assertEquals(2, subjectResponseList.size());
    assertTrue(subjectResponseList.contains(mockSubject01));
    assertTrue(subjectResponseList.contains(mockSubject02));

    Mockito.verify(mainQuestionRepository).findById(mockMainQuestionId);
    Mockito.verify(subjectRepository).findAllById(List.of(mockSubjectId01, mockSubjectId02));
    Mockito.verify(mainQuestionRepository).save(any(MainQuestion.class));
  }

  @Test
  @DisplayName("Verifica se ocorre o disparo de uma exceção caso não se encontre uma entidade MainQuestion por seu Id")
  public void addSubjectTestNotFoundMainQuestionError() {
    Mockito
        .when(mainQuestionRepository.findById(mockMainQuestionId))
        .thenReturn(Optional.empty());

    assertThrows(
        NotFoundException.class,
        () -> mainQuestionService
            .addSubject(mockMainQuestionId, List.of(mockSubjectId01, mockSubjectId02))
    );

    Mockito.verify(mainQuestionRepository).findById(mockMainQuestionId);
  }

  @Test
  @DisplayName("Verifica se ocorre o disparo de uma exceção caso não se encontre uma lista de Subject por seus Ids")
  public void addSubjectTestNotFoundSubjectError() {
    Mockito
        .when(mainQuestionRepository.findById(mockMainQuestionId))
        .thenReturn(Optional.of(mockMainQuestion01));

    Mockito
        .when(subjectRepository.findAllById(List.of(mockSubjectId01, mockSubjectId02)))
        .thenReturn(new ArrayList<>());

    assertThrows(
        NotFoundException.class,
        () -> mainQuestionService
            .addSubject(mockMainQuestionId, List.of(mockSubjectId01, mockSubjectId02))
    );

    Mockito.verify(mainQuestionRepository).findById(mockMainQuestionId);
    Mockito.verify(subjectRepository).findAllById(any(Collection.class));
  }

  @Test
  @DisplayName("Verifica se é removido uma lista de entidades Subject de uma MainQuestion")
  public void removeSubjectTest() {
    Mockito
        .when(mainQuestionRepository.findById(mockMainQuestionId))
        .thenReturn(Optional.of(mockMainQuestion01));

    Mockito
        .when(mainQuestionRepository.save(any(MainQuestion.class)))
        .thenAnswer(invocation -> invocation.getArgument(0));

    mainQuestionService.removeSubject(
          mockMainQuestionId,
          List.of(mockSubjectId01)
      );

    List<Subject> subjectList = mockMainQuestion01.getSubjects();
    assertEquals(0, subjectList.size());
    assertFalse(subjectList.contains(mockSubject01));

    Mockito.verify(mainQuestionRepository).findById(mockMainQuestionId);
    Mockito.verify(mainQuestionRepository).save(any(MainQuestion.class));
  }

  @Test
  @DisplayName("Verifica se ocorre o disparo de uma exceção caso não se encontre uma entidade MainQuestion por seu Id")
  public void removeSubjectTestNotFoundError() {
    Mockito
        .when(mainQuestionRepository.findById(mockMainQuestionId))
        .thenReturn(Optional.empty());

    assertThrows(
        NotFoundException.class,
        () -> mainQuestionService
            .addSubject(mockMainQuestionId, List.of(mockSubjectId01, mockSubjectId02))
    );

    Mockito.verify(mainQuestionRepository).findById(mockMainQuestionId);
  }

  @Test
  @DisplayName("Verifica se é criado e adicionado uma entidade AdaptedQuestion à uma MainQuestion")
  public void addAdaptedQuestionTest() {
    Mockito
        .when(mainQuestionRepository.findById(mockMainQuestionId))
        .thenReturn(Optional.of(mockMainQuestion01));

    Mockito
        .when(mainQuestionRepository.save(any(MainQuestion.class)))
        .thenAnswer(invocation -> invocation.getArgument(0));

    MainQuestion serviceResponse = mainQuestionService
        .addAdaptedQuestion(
            mockMainQuestionId,
            mockAdaptedQuestion01,
            List.of("imagem da questão adaptada", "imagem da alternativa 01", "imagem da alternativa 02")
        );

    assertNotNull(serviceResponse);

    List<AdaptedQuestion> adaptedQuestionResponseList = serviceResponse.getAdaptedQuestions();
    assertEquals(2, adaptedQuestionResponseList.size());
    assertTrue(adaptedQuestionResponseList.contains(mockAdaptedQuestion01));

    AdaptedQuestion adaptedQuestionAdded = adaptedQuestionResponseList
        .get(adaptedQuestionResponseList.size() - 1);
    assertEquals(mockMainQuestion01, adaptedQuestionAdded.getMainQuestion());
    assertEquals(mockAdaptedQuestion01.getTitle(), adaptedQuestionAdded.getTitle());
    assertEquals(mockAdaptedQuestion01.getLevel(), adaptedQuestionAdded.getLevel());
    assertEquals(List.of("imagem da questão adaptada"), adaptedQuestionAdded.getImages());

    List<Alternative> alternativeList = adaptedQuestionAdded.getAlternatives();
    assertEquals(List.of("imagem da alternativa 01"), alternativeList.get(0).getImages());
    assertEquals(List.of("imagem da alternativa 02"), alternativeList.get(1).getImages());

    Mockito.verify(mainQuestionRepository).findById(mockMainQuestionId);
    Mockito.verify(mainQuestionRepository).save(any(MainQuestion.class));
  }

  @Test
  @DisplayName("Verifica se ocorre o disparo de uma exceção caso não se encontre uma entidade MainQuestion por seu Id")
  public void addAdaptedQuestionTestNotFoundError() {
    Mockito
        .when(mainQuestionRepository.findById(mockMainQuestionId))
        .thenReturn(Optional.empty());

    assertThrows(
        NotFoundException.class,
        () -> mainQuestionService
            .addAdaptedQuestion(mockMainQuestionId, mockAdaptedQuestion01, new ArrayList<>())
    );

    Mockito.verify(mainQuestionRepository).findById(mockMainQuestionId);
  }

  @Test
  @DisplayName("Verifica se é removido uma entidade AdaptedQuestion de uma MainQuestion")
  public void removeAdaptedQuestionTest() {
    Mockito
        .when(mainQuestionRepository.findById(mockMainQuestionId))
        .thenReturn(Optional.of(mockMainQuestion01));

    Mockito
        .when(adaptedQuestionRepository.findById(mockAdaptedQuestionId02))
        .thenReturn(Optional.of(mockAdaptedQuestion02));

    Mockito
        .doNothing().when(imageService).deleteImages(any());

    Mockito
        .when(mainQuestionRepository.save(any(MainQuestion.class)))
        .thenAnswer(invocation -> invocation.getArgument(0));

    mainQuestionService.removeAdaptedQuestion(
        mockMainQuestionId,
        mockAdaptedQuestionId02
    );

    List<AdaptedQuestion> adaptedQuestionList = mockMainQuestion01.getAdaptedQuestions();
    assertEquals(0, adaptedQuestionList.size());

    Mockito.verify(mainQuestionRepository).findById(mockMainQuestionId);
    Mockito.verify(mainQuestionRepository).save(any(MainQuestion.class));
  }

  @Test
  @DisplayName("Verifica se ocorre o disparo de uma exceção caso não se encontre uma entidade MainQuestion por seu Id")
  public void removeAdaptedQuestionTestNotFoundMainQuestionError() {
    Mockito
        .when(mainQuestionRepository.findById(mockMainQuestionId))
        .thenReturn(Optional.empty());

    assertThrows(
        NotFoundException.class,
        () -> mainQuestionService
            .removeAdaptedQuestion(mockMainQuestionId, mockAdaptedQuestionId02)
    );

    Mockito.verify(mainQuestionRepository).findById(mockMainQuestionId);
  }

  @Test
  @DisplayName("Verifica se ocorre o disparo de uma exceção caso não se encontre uma entidade AdaptedQuestion por seu Id")
  public void removeAdaptedQuestionTestNotFoundAdaptedQuestionError() {
    Mockito
        .when(mainQuestionRepository.findById(mockMainQuestionId))
        .thenReturn(Optional.of(mockMainQuestion01));

    Mockito
        .when(adaptedQuestionRepository.findById(mockAdaptedQuestionId02))
        .thenReturn(Optional.empty());

    assertThrows(
        NotFoundException.class,
        () -> mainQuestionService
            .removeAdaptedQuestion(mockMainQuestionId, mockAdaptedQuestionId02)
    );

    Mockito.verify(mainQuestionRepository).findById(mockMainQuestionId);
    Mockito.verify(adaptedQuestionRepository).findById(mockAdaptedQuestionId02);
  }

  @Test
  @DisplayName("Verifica se ocorre o disparo de uma exceção caso as entidades AdaptedQuestion e MainQuestion não estejam relacionadas")
  public void removeAdaptedQuestionTestConflictDataError() {
    Mockito
        .when(mainQuestionRepository.findById(mockMainQuestionId))
        .thenReturn(Optional.of(mockMainQuestion01));

    Mockito
        .when(adaptedQuestionRepository.findById(mockAdaptedQuestionId))
        .thenReturn(Optional.of(mockAdaptedQuestion01));

    assertThrows(
        ConflictDataException.class,
        () -> mainQuestionService
            .removeAdaptedQuestion(mockMainQuestionId, mockAdaptedQuestionId)
    );

    Mockito.verify(mainQuestionRepository).findById(mockMainQuestionId);
    Mockito.verify(adaptedQuestionRepository).findById(mockAdaptedQuestionId);
  }
}
