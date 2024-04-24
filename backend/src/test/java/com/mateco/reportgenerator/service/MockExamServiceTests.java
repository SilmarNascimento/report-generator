package com.mateco.reportgenerator.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertInstanceOf;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;

import com.mateco.reportgenerator.model.entity.AdaptedQuestion;
import com.mateco.reportgenerator.model.entity.Alternative;
import com.mateco.reportgenerator.model.entity.MainQuestion;
import com.mateco.reportgenerator.model.entity.MockExam;
import com.mateco.reportgenerator.model.entity.MockExamResponse;
import com.mateco.reportgenerator.model.entity.Subject;
import com.mateco.reportgenerator.model.repository.MainQuestionRepository;
import com.mateco.reportgenerator.model.repository.MockExamRepository;
import com.mateco.reportgenerator.model.repository.MockExamResponseRepository;
import com.mateco.reportgenerator.model.repository.SubjectRepository;
import com.mateco.reportgenerator.service.exception.ConflictDataException;
import com.mateco.reportgenerator.service.exception.NotFoundException;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;
import org.assertj.core.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mockito;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.test.context.ActiveProfiles;

@SpringBootTest
@ActiveProfiles("test")
@ExtendWith(MockitoExtension.class)
public class MockExamServiceTests {
  @Autowired
  private MockExamServiceInterface mockExamService;

  @MockBean
  private MockExamRepository mockExamRepository;
  @MockBean
  private MockExamResponseRepository mockExamResponseRepository;
  @MockBean
  private SubjectRepository subjectRepository;
  @MockBean
  private MainQuestionRepository mainQuestionRepository;

  private UUID mockExamId01;
  private UUID mockExamId02;
  private UUID mockExamId03;
  private UUID mockSubjectId01;
  private UUID mockSubjectId02;
  private UUID mockMainQuestionId01;
  private UUID mockMainQuestionId02;
  private UUID mockMainQuestionId03;
  private MainQuestion mockMainQuestion01;
  private MainQuestion mockMainQuestion02;
  private MainQuestion mockMainQuestion03;
  private MockExamResponse mockExamResponse01;
  private MockExamResponse mockExamResponse02;
  private MockExamResponse mockExamResponse03;
  private MockExam mockExam01;
  private MockExam mockExam02;
  private MockExam mockExam03;
  private Subject mockSubject01;
  private Subject mockSubject02;

  @BeforeEach
  public void setUp() {
    mockExamId01 = UUID.randomUUID();
    mockExamId02 = UUID.randomUUID();
    mockExamId03 = UUID.randomUUID();
    mockSubjectId01 = UUID.randomUUID();
    mockSubjectId02 = UUID.randomUUID();
    UUID mockResponseId01 = UUID.randomUUID();
    UUID mockResponseId02 = UUID.randomUUID();
    UUID mockResponseId03 = UUID.randomUUID();
    mockMainQuestionId01 = UUID.randomUUID();
    mockMainQuestionId02 = UUID.randomUUID();
    mockMainQuestionId03 = UUID.randomUUID();

    Alternative mockFalseAlternative = new Alternative(
        "descrição da alternativa 01",
        List.of("imagem alternativa 01"),
        false
    );
    Alternative mockTrueAlternative = new Alternative(
        "descrição da alternativa 02",
        List.of("imagem alternativa 02"),
        true
    );

    mockSubject01 = new Subject("Geometria");
    mockSubject01.setId(mockSubjectId01);

    mockSubject02 = new Subject("Algebra");
    mockSubject02.setId(mockSubjectId02);

    AdaptedQuestion mockAdaptedQuestion01 = new AdaptedQuestion(
        "titulo da questão adaptada 01",
        "médio",
        new ArrayList<>(),
        List.of(mockTrueAlternative, mockFalseAlternative, mockFalseAlternative)
    );
    AdaptedQuestion mockAdaptedQuestion02 = new AdaptedQuestion(
        "titulo da questão adaptada 02",
        "difícil",
        new ArrayList<>(),
        List.of(mockTrueAlternative, mockFalseAlternative, mockFalseAlternative)
    );

    mockMainQuestion01 = new MainQuestion(
        "título questão 01",
        new ArrayList<>(),
        "difícil",
        List.of("imagem 01 da questão"),
        List.of(mockTrueAlternative, mockFalseAlternative, mockFalseAlternative),
        new ArrayList<>(),
        new ArrayList<>(),
        new ArrayList<>()
    );
    mockMainQuestion01.setId(mockMainQuestionId01);
    mockMainQuestion01.getSubjects().add(mockSubject01);
    mockMainQuestion01.getAdaptedQuestions()
        .addAll(List.of(mockAdaptedQuestion01, mockAdaptedQuestion02));

    mockMainQuestion02 = new MainQuestion(
        "título questão 02",
        new ArrayList<>(),
        "difícil",
        List.of("imagem 01 da questão"),
        List.of(mockFalseAlternative, mockTrueAlternative, mockFalseAlternative),
        new ArrayList<>(),
        new ArrayList<>(),
        new ArrayList<>()
    );
    mockMainQuestion02.setId(mockMainQuestionId02);
    mockMainQuestion02.getSubjects().add(mockSubject02);
    mockMainQuestion02.getAdaptedQuestions()
        .addAll(List.of(mockAdaptedQuestion01, mockAdaptedQuestion02));

    mockMainQuestion03 = new MainQuestion(
        "título questão 02",
        new ArrayList<>(),
        "difícil",
        List.of("imagem 01 da questão"),
        List.of(mockFalseAlternative, mockTrueAlternative),
        new ArrayList<>(),
        new ArrayList<>(),
        new ArrayList<>()
    );
    mockMainQuestion03.setId(mockMainQuestionId03);
    mockMainQuestion03.getAdaptedQuestions()
        .addAll(List.of(mockAdaptedQuestion01, mockAdaptedQuestion02));

    mockExamResponse01 = new MockExamResponse(
        "Cainã",
        "caina.juca@gmail.com",
        2,
        List.of("A", "B"),
        "achei muito fácil",
        LocalDateTime.now()
    );
    mockExamResponse01.setId(mockResponseId01);

    mockExamResponse02 = new MockExamResponse(
        "Igor",
        "igor.santos@gmail.com",
        2,
        List.of("B", "B"),
        "sem comentários",
        LocalDateTime.now()
    );
    mockExamResponse02.setId(mockResponseId02);

    mockExamResponse03 = new MockExamResponse(
        "Charles",
        "charles.alcantara@gmail.com",
        2,
        List.of("B", "A"),
        "sangue de cristo",
        LocalDateTime.now()
    );
    mockExamResponse03.setId(mockResponseId03);

    mockExam01 = new MockExam(
        "primeiro simulado",
        List.of("intensivo", "extensivo"),
        new ArrayList<>(),
        2024,
        1
    );
    mockExam01.setId(mockExamId01);

    mockExam02 = new MockExam(
        "segundo simulado",
        List.of("extensivo"),
        new ArrayList<>(),
        2024,
        1
    );
    mockExam02.getSubjects().add(mockSubject01);
    Map<Integer, MainQuestion> mockExamQuestions = new HashMap<>();
    mockExamQuestions.put(136, mockMainQuestion01);
    mockExamQuestions.put(137, mockMainQuestion02);
    mockExam02.setMockExamQuestions(mockExamQuestions);

    mockExam03 = new MockExam(
        "terceiro simulado",
        List.of("intensivo", "extensivo"),
        new ArrayList<>(),
        2024,
        1
    );
    Map<Integer, MainQuestion> mockExamQuestions03 = new HashMap<>();
    for (int index = 136; index <= 180; index ++) {
      mockExamQuestions03.put(index, new MainQuestion());
    }
    mockExam03.setMockExamQuestions(mockExamQuestions03);
  }

  @Test
  @DisplayName("Verifica se é retornado uma lista de todas as entidades MockExam")
  public void findAllMockExamTest() {
    int pageNumber = 0;
    int pageSize = 2;
    Pageable mockPageable = PageRequest.of(pageNumber, pageSize);
    Page<MockExam> page = Mockito.mock(Page.class);

    Mockito
        .when(page.getContent())
        .thenReturn(List.of(mockExam01, mockExam02));

    Mockito
        .when(mockExamRepository.findAll(mockPageable))
        .thenReturn(page);

    Page<MockExam> serviceResponse = mockExamService.findAllMockExams(pageNumber, pageSize);

    assertFalse(serviceResponse.isEmpty());
    assertInstanceOf(Page.class, serviceResponse);
    assertEquals(pageNumber, serviceResponse.getNumber());
    assertEquals(pageSize, serviceResponse.getContent().size());
    assertTrue(serviceResponse.getContent().contains(mockExam01));
    assertTrue(serviceResponse.getContent().contains(mockExam02));

    Mockito
        .verify(mockExamRepository, Mockito.times(1))
        .findAll(any(Pageable.class));
  }

  @Test
  @DisplayName("Verifica se é retornado a entidade MockExam por seu Id")
  public void findMockExamByIdTest() {
    Mockito
        .when(mockExamRepository.findById(mockExamId01))
        .thenReturn(Optional.of(mockExam01));

    MockExam serviceResponse = mockExamService.findMockExamById(mockExamId01);

    assertNotNull(serviceResponse);
    assertEquals(serviceResponse, mockExam01);

    Mockito.verify(mockExamRepository, Mockito.times(1))
        .findById(any(UUID.class));
  }

  @Test
  @DisplayName("Verifica se ocorre o disparo de uma exceção caso não se encontre uma entidade MockExam por seu Id")
  public void findMockExamByIdTestNotFoundError() {
    Mockito
        .when(mockExamRepository.findById(mockExamId01))
        .thenReturn(Optional.empty());

    assertThrows(
        NotFoundException.class,
        () -> mockExamService.findMockExamById(mockExamId01)
    );

    Mockito.verify(mockExamRepository, Mockito.times(1))
        .findById(any(UUID.class));
  }

  @Test
  @DisplayName("Verifica se é criada uma entidade MockExam")
  public void createMockExamTest() {
    Mockito
        .when(mockExamRepository.save(any(MockExam.class)))
        .thenAnswer(invocation -> invocation.getArgument(0));

    MockExam serviceResponse = mockExamService.createMockExam(mockExam01);

    assertNotNull(serviceResponse);
    assertNotNull(serviceResponse.getId());
    assertEquals(serviceResponse.getName(), mockExam01.getName());
    assertInstanceOf(List.class, serviceResponse.getClassName());
    assertEquals(serviceResponse.getClassName(), mockExam01.getClassName());
    assertEquals(serviceResponse.getReleasedYear(), mockExam01.getReleasedYear());
    assertEquals(serviceResponse.getNumber(), mockExam01.getNumber());
    assertInstanceOf(List.class, serviceResponse.getSubjects());
    assertInstanceOf(Map.class, serviceResponse.getMockExamQuestions());

    Mockito
        .verify(mockExamRepository, Mockito.times(1))
        .save(any(MockExam.class));
  }

  @Test
  @DisplayName("Verifica se é retornado a entidade MockExam atualizada por seu Id")
  public void updateMockExamByIdTest() {
    Mockito
        .when(mockExamRepository.findById(any(UUID.class)))
        .thenReturn(Optional.of(mockExam01));

    Mockito
        .when(mockExamRepository.save(any(MockExam.class)))
        .thenAnswer(invocation -> invocation.getArgument(0));

    MockExam serviceResponse = mockExamService
        .updateMockExamById(
            mockExamId01,
            mockExam02
        );

    assertNotNull(serviceResponse);
    assertNotNull(serviceResponse.getId());
    assertEquals(serviceResponse.getId(), mockExam01.getId());
    assertEquals(serviceResponse.getName(), mockExam02.getName());
    assertInstanceOf(List.class, serviceResponse.getClassName());
    assertEquals(serviceResponse.getClassName(), mockExam01.getClassName());
    assertEquals(serviceResponse.getReleasedYear(), mockExam02.getReleasedYear());
    assertEquals(serviceResponse.getNumber(), mockExam02.getNumber());
    assertInstanceOf(List.class, serviceResponse.getSubjects());
    assertEquals(serviceResponse.getSubjects(), mockExam01.getSubjects());
    assertInstanceOf(Map.class, serviceResponse.getMockExamQuestions());
    assertEquals(serviceResponse.getMockExamQuestions(), mockExam01.getMockExamQuestions());


    Mockito.verify(mockExamRepository, Mockito.times(1))
        .findById(any(UUID.class));
    Mockito.verify(mockExamRepository, Mockito.times(1))
        .save(any(MockExam.class));
  }

  @Test
  @DisplayName("Verifica  se ocorre o disparo de uma exceção caso não se encontre uma entidade MockExam")
  public void updateMockExamByIdTestError() {
    Mockito
        .when(mockExamRepository.findById(any(UUID.class)))
        .thenReturn(Optional.empty());

    assertThrows(
        NotFoundException.class,
        () -> mockExamService.updateMockExamById(
            mockExamId01,
            mockExam02
        )
    );

    Mockito.verify(mockExamRepository, Mockito.times(1))
        .findById(any(UUID.class));
  }

  @Test
  @DisplayName("Verifica se é adicionado uma lista de entidades Subject à uma MockExam")
  public void addSubjectTest() {
    Mockito
        .when(mockExamRepository.findById(any(UUID.class)))
        .thenReturn(Optional.of(mockExam01));

    Mockito
        .when(subjectRepository.findAllById(any(List.class)))
        .thenReturn(List.of(mockSubject01, mockSubject02));

    Mockito
        .when(mockExamRepository.save(any(MockExam.class)))
        .thenAnswer(invocation -> invocation.getArgument(0));

    MockExam serviceResponse = mockExamService
        .addSubject(
            mockExamId01,
            List.of(mockSubjectId01, mockSubjectId02)
        );

    assertNotNull(serviceResponse);

    List<Subject> subjectResponseList = serviceResponse.getSubjects();
    assertEquals(2, subjectResponseList.size());
    assertTrue(subjectResponseList.contains(mockSubject01));
    assertTrue(subjectResponseList.contains(mockSubject02));

    Mockito.verify(mockExamRepository, Mockito.times(1))
        .findById(any(UUID.class));
    Mockito.verify(subjectRepository, Mockito.times(1))
        .findAllById(any(List.class));
    Mockito.verify(mockExamRepository, Mockito.times(1))
        .save(any(MockExam.class));
  }

  @Test
  @DisplayName("Verifica se é adicionado uma lista de entidades Subject à uma MockExam sem repetições")
  public void addSubjectWithDuplicatesTest() {
    Mockito
        .when(mockExamRepository.findById(any(UUID.class)))
        .thenReturn(Optional.of(mockExam02));

    Mockito
        .when(subjectRepository.findAllById(any(List.class)))
        .thenReturn(List.of(mockSubject01, mockSubject02));

    Mockito
        .when(mockExamRepository.save(any(MockExam.class)))
        .thenAnswer(invocation -> invocation.getArgument(0));

    MockExam serviceResponse = mockExamService
        .addSubject(
            mockExamId02,
            List.of(mockSubjectId01, mockSubjectId02)
        );

    assertNotNull(serviceResponse);

    List<Subject> subjectResponseList = serviceResponse.getSubjects();
    assertEquals(2, subjectResponseList.size());
    assertTrue(subjectResponseList.contains(mockSubject01));
    assertTrue(subjectResponseList.contains(mockSubject02));

    Mockito.verify(mockExamRepository, Mockito.times(1))
        .findById(any(UUID.class));
    Mockito.verify(subjectRepository, Mockito.times(1))
        .findAllById(any(List.class));
    Mockito.verify(mockExamRepository, Mockito.times(1))
        .save(any(MockExam.class));
  }

  @Test
  @DisplayName("Verifica se ocorre o disparo de uma exceção caso não se encontre uma entidade MockExam por seu Id")
  public void addSubjectTestNotFoundMockExamError() {
    Mockito
        .when(mockExamRepository.findById(any(UUID.class)))
        .thenReturn(Optional.empty());

    assertThrows(
        NotFoundException.class,
        () -> mockExamService
            .addSubject(mockExamId01, List.of(mockSubjectId01, mockSubjectId02))
    );

    Mockito.verify(mockExamRepository, Mockito.times(1))
        .findById(any(UUID.class));
  }

  @Test
  @DisplayName("Verifica se ocorre o disparo de uma exceção caso não se encontre uma lista de Subject por seus Ids")
  public void addSubjectTestNotFoundListSubjectError() {
    Mockito
        .when(mockExamRepository.findById(mockExamId01))
        .thenReturn(Optional.of(mockExam01));

    Mockito
        .when(subjectRepository.findAllById(any(List.class)))
        .thenReturn(new ArrayList<>());

    assertThrows(
        NotFoundException.class,
        () -> mockExamService
            .addSubject(mockExamId01, List.of(mockSubjectId01, mockSubjectId02))
    );

    Mockito.verify(mockExamRepository, Mockito.times(1))
        .findById(any(UUID.class));
    Mockito.verify(subjectRepository, Mockito.times(1))
        .findAllById(any(List.class));
  }

  @Test
  @DisplayName("Verifica se é removido uma lista de entidades Subject de uma MockExam")
  public void removeSubjectTest() {
    Mockito
        .when(mockExamRepository.findById(mockExamId01))
        .thenReturn(Optional.of(mockExam02));

    Mockito
        .when(mockExamRepository.save(any(MockExam.class)))
        .thenAnswer(invocation -> invocation.getArgument(0));

    MockExam serviceResponse = mockExamService.removeSubject(
        mockExamId01,
        List.of(mockSubjectId01)
    );

    assertEquals(serviceResponse, mockExam02);
    assertEquals(0, serviceResponse.getSubjects().size());
    assertFalse(serviceResponse.getSubjects().contains(mockSubject01));

    Mockito.verify(mockExamRepository, Mockito.times(1))
        .findById(any(UUID.class));
    Mockito.verify(mockExamRepository, Mockito.times(1))
        .save(any(MockExam.class));
  }

  @Test
  @DisplayName("Verifica se ocorre o disparo de uma exceção caso não se encontre uma entidade MainQuestion por seu Id")
  public void removeSubjectTestNotFoundError() {
    Mockito
        .when(mockExamRepository.findById(mockExamId01))
        .thenReturn(Optional.empty());

    assertThrows(
        NotFoundException.class,
        () -> mockExamService
            .removeSubject(mockExamId01, List.of(mockSubjectId01, mockSubjectId02))
    );

    Mockito.verify(mockExamRepository, Mockito.times(1))
        .findById(any(UUID.class));
  }

  @Test
  @DisplayName("Verifica se é adicionado uma entidade MainQuestion à entidade MockExam")
  public void addMainQuestionTest() {
    Mockito
        .when(mockExamRepository.findById(any(UUID.class)))
        .thenReturn(Optional.of(mockExam01));

    Mockito
        .when(mainQuestionRepository.findAllById(any(List.class)))
        .thenReturn(List.of(mockMainQuestion01, mockMainQuestion02, mockMainQuestion03));

    Mockito
        .when(mockExamRepository.save(any(MockExam.class)))
        .thenAnswer(invocation -> invocation.getArgument(0));

    MockExam serviceResponse = mockExamService
        .addMainQuestion(
            mockExamId01,
            List.of(mockMainQuestionId01, mockMainQuestionId02, mockMainQuestionId03)
        );

    assertNotNull(serviceResponse);

    Map<Integer, MainQuestion> mainQuestionResponseMap = serviceResponse.getMockExamQuestions();
    assertEquals(45, mainQuestionResponseMap.size());
    assertEquals(mainQuestionResponseMap.get(136), mockMainQuestion01);
    assertEquals(mainQuestionResponseMap.get(137), mockMainQuestion02);
    assertEquals(mainQuestionResponseMap.get(138), mockMainQuestion03);

    Assertions.assertThat(serviceResponse.getMockExamQuestions()).isNotNull()
        .allSatisfy((questionNumber, mainQuestion) -> {
          Assertions.assertThat(questionNumber).isInstanceOf(Integer.class);
          if (questionNumber >= 136 && questionNumber <= 138) {
            Assertions.assertThat(mainQuestion.getId()).isNotNull();
            Assertions.assertThat(mainQuestion.getTitle()).isInstanceOf(String.class);
            Assertions.assertThat(mainQuestion.getLevel()).isInstanceOf(String.class);
            Assertions.assertThat(mainQuestion.getSubjects()).isInstanceOf(List.class);
            Assertions.assertThat(mainQuestion.getImages()).isInstanceOf(List.class);
            Assertions.assertThat(mainQuestion.getAlternatives()).isInstanceOf(List.class);
            Assertions.assertThat(mainQuestion.getAdaptedQuestions()).isInstanceOf(List.class);
            Assertions.assertThat(mainQuestion.getMockExams()).isInstanceOf(List.class);
            Assertions.assertThat(mainQuestion.getHandout()).isInstanceOf(List.class);
          } else {
            Assertions.assertThat(mainQuestion).isNull();
          }
        });

    Mockito.verify(mockExamRepository, Mockito.times(1))
        .findById(any(UUID.class));
    Mockito.verify(mainQuestionRepository, Mockito.times(1))
        .findAllById(any(List.class));
    Mockito.verify(mockExamRepository, Mockito.times(1))
        .save(any(MockExam.class));
  }

  @Test
  @DisplayName("Verifica se ocorre o disparo de uma exceção caso não se encontre uma entidade MockExam por seu Id")
  public void addMainQuestionTestMockExamNotFoundError() {
    Mockito
        .when(mockExamRepository.findById(any(UUID.class)))
        .thenReturn(Optional.empty());

    assertThrows(
        NotFoundException.class,
        () -> mockExamService
            .addMainQuestion(
                mockExamId01,
                List.of(mockMainQuestionId01, mockMainQuestionId02, mockMainQuestionId03)
            )
    );

    Mockito.verify(mockExamRepository).findById(any(UUID.class));
  }

  @Test
  @DisplayName("Verifica se ocorre o disparo de uma exceção caso não se encontre uma lista de MainQuestion por seus Ids")
  public void addMainQuestionTestNotFoundListMainQuestionError() {
    Mockito
        .when(mockExamRepository.findById(any(UUID.class)))
        .thenReturn(Optional.of(mockExam01));

    Mockito
        .when(mainQuestionRepository.findAllById(any(List.class)))
        .thenReturn(new ArrayList<>());

    assertThrows(
        NotFoundException.class,
        () -> mockExamService
            .addMainQuestion(
                mockExamId01,
                List.of(UUID.randomUUID(), UUID.randomUUID())
            )
    );

    Mockito.verify(mockExamRepository, Mockito.times(1))
        .findById(any(UUID.class));
    Mockito.verify(mainQuestionRepository, Mockito.times(1))
        .findAllById(any(List.class));
  }

  @Test
  @DisplayName("Verifica se ocorre o disparo de uma exceção caso o map de questões esteja completo")
  public void addMainQuestionTestMainQuestionsMapFullError() {
    Mockito
        .when(mockExamRepository.findById(any(UUID.class)))
        .thenReturn(Optional.of(mockExam03));

    Mockito
        .when(mainQuestionRepository.findAllById(any(List.class)))
        .thenReturn(List.of(mockMainQuestion01, mockMainQuestion02, mockMainQuestion03));

    assertThrows(
        ConflictDataException.class,
        () -> mockExamService
            .addMainQuestion(
                mockExamId03,
                List.of(UUID.randomUUID(), UUID.randomUUID())
            )
    );

    Mockito.verify(mockExamRepository, Mockito.times(1))
        .findById(any(UUID.class));
    Mockito.verify(mainQuestionRepository, Mockito.times(1))
        .findAllById(any(List.class));
  }

  @Test
  @DisplayName("Verifica se ocorre o disparo de uma exceção caso o map de questões não suporte adicionar todas as questões solicitadas")
  public void addMainQuestionTestMainQuestionListGraterThanFreeSlotsError() {
    Mockito
        .when(mockExamRepository.findById(any(UUID.class)))
        .thenReturn(Optional.of(mockExam02));

    Mockito
        .when(mainQuestionRepository.findAllById(any(List.class)))
        .thenReturn(Collections.nCopies(45, new MainQuestion()));

    assertThrows(
        ConflictDataException.class,
        () -> mockExamService
            .addMainQuestion(
                mockExamId02,
                Collections.nCopies(45, UUID.randomUUID())
            )
    );

    Mockito.verify(mockExamRepository, Mockito.times(1))
        .findById(any(UUID.class));
    Mockito.verify(mainQuestionRepository, Mockito.times(1))
        .findAllById(any(List.class));
  }

  @Test
  @DisplayName("Verifica se ocorre o disparo de uma exceção caso o map de questões não tenha a questão a ser removida")
  public void addMainQuestionTestMainQuestionAlreadyInMockExamError() {
    Mockito
        .when(mockExamRepository.findById(any(UUID.class)))
        .thenReturn(Optional.of(mockExam02));

    Mockito
        .when(mainQuestionRepository.findAllById(any(List.class)))
        .thenReturn(List.of(mockMainQuestion01, mockMainQuestion02));

    assertThrows(
        ConflictDataException.class,
        () -> mockExamService
            .addMainQuestion(
                mockExamId02,
                List.of(mockMainQuestionId01, mockMainQuestionId02)
            )
    );

    Mockito.verify(mockExamRepository, Mockito.times(1))
        .findById(any(UUID.class));
    Mockito.verify(mainQuestionRepository, Mockito.times(1))
        .findAllById(any(List.class));
  }

  @Test
  @DisplayName("Verifica se é removido uma entidade MainQuestion de uma MockExam")
  public void removeMainQuestionTest() {
    Mockito
        .when(mockExamRepository.findById(any(UUID.class)))
        .thenReturn(Optional.of(mockExam02));

    Mockito
        .when(mainQuestionRepository.findAllById(any(List.class)))
        .thenReturn(List.of(mockMainQuestion01));

    Mockito
        .when(mockExamRepository.save(any(MockExam.class)))
        .thenAnswer(invocation -> invocation.getArgument(0));

    mockExamService.removeMainQuestion(
        mockExamId02,
        List.of(mockMainQuestionId01)
    );

    Map<Integer, MainQuestion> mainQuestionMap = mockExam02.getMockExamQuestions();
    assertNull(mainQuestionMap.get(136));
    assertEquals(mainQuestionMap.get(137), mockMainQuestion02);

    Mockito.verify(mockExamRepository, Mockito.times(1))
        .findById(any(UUID.class));
    Mockito.verify(mockExamRepository, Mockito.times(1))
        .save(any(MockExam.class));
  }

  @Test
  @DisplayName("Verifica se ocorre o disparo de uma exceção caso não se encontre uma entidade MockExam por seu Id")
  public void removeMainQuestionTestMockExamNotFoundError() {
    Mockito
        .when(mockExamRepository.findById(any(UUID.class)))
        .thenReturn(Optional.empty());

    assertThrows(
        NotFoundException.class,
        () -> mockExamService
            .removeMainQuestion(
                mockExamId01,
                List.of(mockMainQuestionId01)
            )
    );

    Mockito.verify(mockExamRepository, Mockito.times(1))
        .findById(any(UUID.class));
  }

  @Test
  @DisplayName("Verifica se ocorre o disparo de uma exceção caso não se encontre uma lista entidades MainQuestion por seu Id")
  public void removeMainQuestionTestMainQuestionListNotFoundError() {
    Mockito
        .when(mockExamRepository.findById(any(UUID.class)))
        .thenReturn(Optional.of(mockExam01));

    Mockito
        .when(mainQuestionRepository.findAllById(any(List.class)))
        .thenReturn(new ArrayList<>());

    assertThrows(
        NotFoundException.class,
        () -> mockExamService
            .removeMainQuestion(
                mockExamId01,
                List.of(mockMainQuestionId01)
            )
    );

    Mockito.verify(mockExamRepository, Mockito.times(1))
        .findById(any(UUID.class));
  }

  @Test
  @DisplayName("Verifica se ocorre o disparo de uma exceção caso não se encontre a entidade a ser deletada no map de MainQuestions")
  public void removeMainQuestionTestMainQuestionNotPresentError() {
    Mockito
        .when(mockExamRepository.findById(any(UUID.class)))
        .thenReturn(Optional.of(mockExam01));

    Mockito
        .when(mainQuestionRepository.findAllById(any(List.class)))
        .thenReturn(List.of(mockMainQuestion01));

    assertThrows(
        ConflictDataException.class,
        () -> mockExamService
            .removeMainQuestion(
                mockExamId01,
                List.of(mockMainQuestionId01)
            )
    );

    Mockito
        .verify(mockExamRepository, Mockito.times(1))
        .findById(any(UUID.class));
  }

  @Test
  @DisplayName("Verifica se é retornado uma lista de MockExamResponse atualizada")
  public void registerAllMockExamResponsesTest() {
    Mockito
        .when(mockExamRepository.findById(any(UUID.class)))
        .thenReturn(Optional.of(mockExam02));

    Mockito
        .when(mockExamResponseRepository.saveAll(any(List.class)))
        .thenAnswer(invocation -> invocation.getArgument(0));

    List<MockExamResponse> serviceResponse = mockExamService
        .registerAllMockExamResponses(
            mockExamId02,
            List.of(mockExamResponse01, mockExamResponse02, mockExamResponse03)
        );

    assertNotNull(serviceResponse);
    assertInstanceOf(List.class, serviceResponse);
    assertEquals(3, serviceResponse.size());

    Assertions.assertThat(serviceResponse)
        .allSatisfy(examResponse -> {
          Assertions.assertThat(examResponse.getId()).isNotNull();
          Assertions.assertThat(examResponse.getName()).isInstanceOf(String.class);
          Assertions.assertThat(examResponse.getEmail()).isInstanceOf(String.class);
          Assertions.assertThat(examResponse.getMockExam()).isInstanceOf(MockExam.class);
          assertEquals(examResponse.getMockExam(), mockExam02);
          Assertions.assertThat(examResponse.getCorrectAnswers()).isInstanceOf(Integer.class);
          Assertions.assertThat(examResponse.getTotalQuestions()).isInstanceOf(Integer.class);
          assertEquals(2, examResponse.getTotalQuestions());
          Assertions.assertThat(examResponse.getResponses()).isInstanceOf(List.class);
          assertEquals(2, examResponse.getResponses().size());
          Assertions.assertThat(examResponse.getAdaptedQuestionList()).isInstanceOf(List.class);
          Assertions.assertThat(examResponse.getComment()).isInstanceOf(String.class);
          Assertions.assertThat(examResponse.getCreatedAt()).isInstanceOf(LocalDateTime.class);
        });

    MockExamResponse studentResponse01 = serviceResponse.get(0);
    assertEquals(2, studentResponse01.getCorrectAnswers());
    assertEquals(0, studentResponse01.getAdaptedQuestionList().size());

    MockExamResponse studentResponse02 = serviceResponse.get(1);
    assertEquals(1, studentResponse02.getCorrectAnswers());
    assertEquals(1, studentResponse02.getAdaptedQuestionList().size());

    MockExamResponse studentResponse03 = serviceResponse.get(2);
    assertEquals(0, studentResponse03.getCorrectAnswers());
    assertEquals(2, studentResponse03.getAdaptedQuestionList().size());

    Mockito.verify(mockExamRepository, Mockito.times(1))
        .findById(any(UUID.class));
    Mockito.verify(mockExamResponseRepository, Mockito.times(1))
        .saveAll(any(List.class));
  }
}
