package com.mateco.reportgenerator.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertInstanceOf;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;

import com.mateco.reportgenerator.model.entity.AdaptedQuestion;
import com.mateco.reportgenerator.model.entity.Alternative;
import com.mateco.reportgenerator.model.entity.FileEntity;
import com.mateco.reportgenerator.model.entity.MainQuestion;
import com.mateco.reportgenerator.model.entity.Subject;
import com.mateco.reportgenerator.model.repository.AdaptedQuestionRepository;
import com.mateco.reportgenerator.model.repository.MainQuestionRepository;
import com.mateco.reportgenerator.model.repository.SubjectRepository;
import com.mateco.reportgenerator.service.exception.ConflictDataException;
import com.mateco.reportgenerator.service.exception.NotFoundException;
import java.io.IOException;
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
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.test.context.ActiveProfiles;

@SpringBootTest
@ActiveProfiles("test")
@ExtendWith(MockitoExtension.class)
public class MainQuestionServiceTests {
  @Autowired
  private MainQuestionServiceInterface mainQuestionService;

  @MockBean
  private MainQuestionRepository mainQuestionRepository;
  @MockBean
  private AdaptedQuestionRepository adaptedQuestionRepository;
  @MockBean
  private ImageServiceInterface imageService;
  @MockBean
  private SubjectRepository subjectRepository;

  private UUID mockMainQuestionId01;
  private UUID mockMainQuestionId02;
  private UUID mockAdaptedQuestionId;
  private UUID mockAdaptedQuestionId02;
  private UUID mockSubjectId01;
  private UUID mockSubjectId02;
  private FileEntity mockMainQuestionFile01;
  private FileEntity mockMainQuestionFile02;
  private MainQuestion mockMainQuestion01;
  private MainQuestion mockMainQuestion02;
  private AdaptedQuestion mockAdaptedQuestion01;
  private AdaptedQuestion mockAdaptedQuestion02;
  private Subject mockSubject01;
  private Subject mockSubject02;

  @BeforeEach
  public void setUp() throws IOException {
    mockMainQuestionId01 = UUID.randomUUID();
    mockMainQuestionId02 = UUID.randomUUID();
    mockAdaptedQuestionId = UUID.randomUUID();
    mockSubjectId01 = UUID.randomUUID();
    mockSubjectId02 = UUID.randomUUID();

    MockMultipartFile multipartFile01 = new MockMultipartFile(
        "adaptedQuestionPdfFile01",
        "adaptedQuestionPdfFile01.pdf",
        "application/pdf",
        "adaptedQuestion01".getBytes()
    );
    mockMainQuestionFile01 = new FileEntity(multipartFile01);

    MockMultipartFile multipartFile02 = new MockMultipartFile(
        "adaptedQuestionPdfFile02",
        "adaptedQuestionPdfFile02.pdf",
        "application/pdf",
        "adaptedQuestion02".getBytes()
    );
    mockMainQuestionFile02 = new FileEntity(multipartFile02);

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
        "URL da questão 01",
        new ArrayList<>(),
        mockMainQuestionFile01,
        new ArrayList<>(),
        new ArrayList<>()
    );
    mockMainQuestion01.setId(mockMainQuestionId01);

    mockMainQuestion02 = new MainQuestion(
        "título questão 02",
        new ArrayList<>(),
        "difícil",
        List.of("imagem 01 da questão"),
        List.of(mockAlternative01, mockAlternative02),
        "URL da questão 02",
        new ArrayList<>(),
        mockMainQuestionFile02,
        new ArrayList<>(),
        new ArrayList<>()
    );
    mockMainQuestion02.setId(mockMainQuestionId02);

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
  @DisplayName("Verifica se é retornado uma página com uma lista de todas as entidades MainQuestion sem filtro")
  public void findAllMainQuestionsNullQueryTest() {
    int pageNumber = 0;
    int pageSize = 2;

    Pageable mockPageable = PageRequest.of(pageNumber, pageSize);
    Page<MainQuestion> page = Mockito.mock(Page.class);

    Mockito
        .when(page.getContent())
        .thenReturn(List.of(mockMainQuestion01, mockMainQuestion02));

    Mockito
        .when(mainQuestionRepository.findAll(mockPageable, null))
        .thenReturn(page);

    Page<MainQuestion> serviceResponse = mainQuestionService.findAllMainQuestions(pageNumber, pageSize, null);

    assertFalse(serviceResponse.isEmpty());
    assertInstanceOf(Page.class, serviceResponse);
    assertEquals(pageNumber, serviceResponse.getNumber());
    assertEquals(pageSize, serviceResponse.getContent().size());
    assertTrue(serviceResponse.getContent().contains(mockMainQuestion01));
    assertTrue(serviceResponse.getContent().contains(mockMainQuestion02));

    Mockito
        .verify(mainQuestionRepository)
        .findAll(any(Pageable.class), any());
  }

  @Test
  @DisplayName("Verifica se é retornado uma página com uma lista de todas as entidades MainQuestion com filtro")
  public void findAllMainQuestionsNonNullQueryTest() {
    int pageNumber = 0;
    int pageSize = 2;
    String query = "ome";

    Pageable mockPageable = PageRequest.of(pageNumber, pageSize);
    Page<MainQuestion> page = Mockito.mock(Page.class);

    Mockito
        .when(page.getContent())
        .thenReturn(List.of(mockMainQuestion01));

    Mockito
        .when(mainQuestionRepository.findAll(mockPageable, query))
        .thenReturn(page);

    Page<MainQuestion> serviceResponse = mainQuestionService.findAllMainQuestions(pageNumber, pageSize, query);

    assertFalse(serviceResponse.isEmpty());
    assertInstanceOf(Page.class, serviceResponse);
    assertEquals(pageNumber, serviceResponse.getNumber());
    assertEquals(page.getContent().size(), serviceResponse.getContent().size());
    assertTrue(serviceResponse.getContent().contains(mockMainQuestion01));

    Mockito
        .verify(mainQuestionRepository)
        .findAll(any(Pageable.class), any(String.class));
  }

  @Test
  @DisplayName("Verifica se é retornado uma página com uma lista de todas as entidades MainQuestion sem query filter")
  public void findAllFilteredMainQuestionsNullQueryTest() {
    int pageNumber = 0;
    int pageSize = 2;

    Pageable mockPageable = PageRequest.of(pageNumber, pageSize);
    Page<MainQuestion> page = Mockito.mock(Page.class);

    Mockito
        .when(page.getContent())
        .thenReturn(List.of(mockMainQuestion01, mockMainQuestion02));

    Mockito
        .when(mainQuestionRepository.findAll(mockPageable, null))
        .thenReturn(page);

    Page<MainQuestion> serviceResponse = mainQuestionService.findAllFilteredMainQuestions(pageNumber, pageSize, null, new ArrayList<>());

    assertFalse(serviceResponse.isEmpty());
    assertInstanceOf(Page.class, serviceResponse);
    assertEquals(pageNumber, serviceResponse.getNumber());
    assertEquals(pageSize, serviceResponse.getContent().size());
    assertTrue(serviceResponse.getContent().contains(mockMainQuestion01));
    assertTrue(serviceResponse.getContent().contains(mockMainQuestion02));

    Mockito
        .verify(mainQuestionRepository)
        .findAll(any(Pageable.class), any());
  }

  @Test
  @DisplayName("Verifica se é retornado uma página com uma lista de todas as entidades MainQuestion com query filter")
  public void findAllFilteredMainQuestionsNonNullQueryTest() {
    int pageNumber = 0;
    int pageSize = 2;
    String query = "ome";

    Pageable mockPageable = PageRequest.of(pageNumber, pageSize);
    Page<MainQuestion> page = Mockito.mock(Page.class);

    Mockito
        .when(page.getContent())
        .thenReturn(List.of(mockMainQuestion01));

    Mockito
        .when(mainQuestionRepository.findAll(mockPageable, query))
        .thenReturn(page);

    Page<MainQuestion> serviceResponse = mainQuestionService.findAllFilteredMainQuestions(pageNumber, pageSize, query, new ArrayList<>());

    assertFalse(serviceResponse.isEmpty());
    assertInstanceOf(Page.class, serviceResponse);
    assertEquals(pageNumber, serviceResponse.getNumber());
    assertEquals(page.getContent().size(), serviceResponse.getContent().size());
    assertTrue(serviceResponse.getContent().contains(mockMainQuestion01));

    Mockito
        .verify(mainQuestionRepository)
        .findAll(any(Pageable.class), any(String.class));
  }

  @Test
  @DisplayName("Verifica se é retornado uma página com uma lista de entidades MainQuestion exceto as MainQuestions passadas pela lista")
  public void findAllFilteredMainQuestionsWithExcludedIdListTest() {
    int pageNumber = 0;
    int pageSize = 2;
    List<UUID> excludedQuestions = List.of(mockMainQuestionId01);

    Pageable mockPageable = PageRequest.of(pageNumber, pageSize);
    Page<MainQuestion> page = Mockito.mock(Page.class);

    Mockito
        .when(page.getContent())
        .thenReturn(List.of(mockMainQuestion02));

    Mockito
        .when(mainQuestionRepository.findAll(mockPageable, null, excludedQuestions))
        .thenReturn(page);

    Page<MainQuestion> serviceResponse = mainQuestionService.findAllFilteredMainQuestions(pageNumber, pageSize, null, excludedQuestions);

    assertFalse(serviceResponse.isEmpty());
    assertInstanceOf(Page.class, serviceResponse);
    assertEquals(pageNumber, serviceResponse.getNumber());
    assertEquals(1, serviceResponse.getContent().size());
    assertTrue(serviceResponse.getContent().contains(mockMainQuestion02));

    Mockito
        .verify(mainQuestionRepository)
        .findAll(any(Pageable.class), any(), any(List.class));
  }

  @Test
  @DisplayName("Verifica se é retornado a entidade MainQuestion por seu Id")
  public void findMainQuestionByIdTest() {
    Mockito
        .when(mainQuestionRepository.findById(mockMainQuestionId01))
        .thenReturn(Optional.of(mockMainQuestion01));

    MainQuestion serviceResponse = mainQuestionService.findMainQuestionById(mockMainQuestionId01);

    assertNotNull(serviceResponse);
    assertEquals(serviceResponse, mockMainQuestion01);

    Mockito.verify(mainQuestionRepository).findById(any(UUID.class));
  }

  @Test
  @DisplayName("Verifica se ocorre o disparo de uma exceção caso não se encontre uma entidade MainQuestion por seu Id")
  public void findMainQuestionByIdTestNotFoundError() {
    Mockito
        .when(mainQuestionRepository.findById(mockMainQuestionId01))
        .thenReturn(Optional.empty());

    assertThrows(
        NotFoundException.class,
        () -> mainQuestionService.findMainQuestionById(mockMainQuestionId01)
    );

    Mockito.verify(mainQuestionRepository).findById(any(UUID.class));
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
        .when(mainQuestionRepository.findById(mockMainQuestionId01))
        .thenReturn(Optional.of(mockMainQuestion01));

    Mockito
        .doNothing().when(imageService).deleteImages(any());

    Mockito
        .when(mainQuestionRepository.save(any(MainQuestion.class)))
        .thenAnswer(invocation -> invocation.getArgument(0));

    MainQuestion serviceResponse = mainQuestionService
        .updateMainQuestionById(
            mockMainQuestionId01,
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

    Mockito.verify(mainQuestionRepository).findById(mockMainQuestionId01);
    Mockito.verify(imageService, Mockito.times(3)).deleteImages(any());
    Mockito.verify(mainQuestionRepository).save(any(MainQuestion.class));
  }

  @Test
  @DisplayName("Verifica se ocorre o disparo de uma exceção caso não se encontre uma entidade MainQuestion por seu Id")
  public void updateAdaptedQuestionOfMainQuestionByIdTestNotFoundError() {
    Mockito
        .when(mainQuestionRepository.findById(mockMainQuestionId01))
        .thenReturn(Optional.empty());

    assertThrows(
        NotFoundException.class,
        () -> mainQuestionService.updateMainQuestionById(
            mockMainQuestionId01,
            mockMainQuestion02,
            List.of("imagem questão nova 01", "imagem alternativa nova 01", "imagem alternativa nova 02")
        )
    );

    Mockito.verify(mainQuestionRepository).findById(mockMainQuestionId01);
  }

  @Test
  @DisplayName("Verifica se a entidade MainQuestion é deletada por seu Id")
  public void deleteMainQuestionByIdTest() {
    Mockito
        .when(mainQuestionRepository.findById(mockMainQuestionId01))
        .thenReturn(Optional.of(mockMainQuestion01));

    Mockito
        .doNothing().when(imageService).deleteImages(any());

    Mockito
        .doNothing().when(mainQuestionRepository).deleteById(any());

    mainQuestionService.deleteMainQuestionById(mockMainQuestionId01);

    Mockito.verify(mainQuestionRepository).findById(mockMainQuestionId01);
    Mockito.verify(imageService, Mockito.times(1)).deleteImages(any());
    Mockito.verify(mainQuestionRepository).deleteById(mockMainQuestionId01);
  }

  @Test
  @DisplayName("Verifica se ocorre o disparo de uma exceção caso não se encontre uma entidade MainQuestion por seu Id")
  public void deleteMainQuestionByIdTestNotFoundError() {
    Mockito
        .when(mainQuestionRepository.findById(mockMainQuestionId01))
        .thenReturn(Optional.empty());

    assertThrows(
        NotFoundException.class,
        () -> mainQuestionService.deleteMainQuestionById(mockMainQuestionId01)
    );

    Mockito.verify(mainQuestionRepository).findById(mockMainQuestionId01);
  }

  @Test
  @DisplayName("Verifica se é adicionado uma lista de entidades Subject à uma MainQuestion")
  public void addSubjectTest() {
    Mockito
        .when(mainQuestionRepository.findById(mockMainQuestionId01))
        .thenReturn(Optional.of(mockMainQuestion01));

    Mockito
        .when(subjectRepository.findAllById(List.of(mockSubjectId02)))
        .thenReturn(List.of(mockSubject02));

    Mockito
        .when(mainQuestionRepository.save(any(MainQuestion.class)))
        .thenAnswer(invocation -> invocation.getArgument(0));

    MainQuestion serviceResponse = mainQuestionService
        .addSubject(
            mockMainQuestionId01,
            List.of(mockSubjectId02)
        );

    assertNotNull(serviceResponse);

    List<Subject> subjectResponseList = serviceResponse.getSubjects();
    assertEquals(2, subjectResponseList.size());
    assertTrue(subjectResponseList.contains(mockSubject01));
    assertTrue(subjectResponseList.contains(mockSubject02));

    Mockito.verify(mainQuestionRepository).findById(mockMainQuestionId01);
    Mockito.verify(subjectRepository).findAllById(List.of(mockSubjectId02));
    Mockito.verify(mainQuestionRepository).save(any(MainQuestion.class));
  }

  @Test
  @DisplayName("Verifica se é adicionado uma lista de entidades Subject à uma MainQuestion sem repetições")
  public void addSubjectWithDuplicatesTest() {
    Mockito
        .when(mainQuestionRepository.findById(any(UUID.class)))
        .thenReturn(Optional.of(mockMainQuestion01));

    Mockito
        .when(subjectRepository.findAllById(any(List.class)))
        .thenReturn(List.of(mockSubject01, mockSubject02));

    Mockito
        .when(mainQuestionRepository.save(any(MainQuestion.class)))
        .thenAnswer(invocation -> invocation.getArgument(0));

    MainQuestion serviceResponse = mainQuestionService
        .addSubject(
            mockMainQuestionId01,
            List.of(mockSubjectId01, mockSubjectId02)
        );

    assertNotNull(serviceResponse);

    List<Subject> subjectResponseList = serviceResponse.getSubjects();
    assertEquals(2, subjectResponseList.size());
    assertTrue(subjectResponseList.contains(mockSubject01));
    assertTrue(subjectResponseList.contains(mockSubject02));

    Mockito.verify(mainQuestionRepository, Mockito.times(1))
        .findById(any(UUID.class));
    Mockito.verify(subjectRepository, Mockito.times(1))
        .findAllById(any(List.class));
    Mockito.verify(mainQuestionRepository, Mockito.times(1))
        .save(any(MainQuestion.class));
  }

  @Test
  @DisplayName("Verifica se ocorre o disparo de uma exceção caso não se encontre uma entidade MainQuestion por seu Id")
  public void addSubjectTestNotFoundMainQuestionError() {
    Mockito
        .when(mainQuestionRepository.findById(mockMainQuestionId01))
        .thenReturn(Optional.empty());

    assertThrows(
        NotFoundException.class,
        () -> mainQuestionService
            .addSubject(mockMainQuestionId01, List.of(mockSubjectId01, mockSubjectId02))
    );

    Mockito.verify(mainQuestionRepository).findById(mockMainQuestionId01);
  }

  @Test
  @DisplayName("Verifica se ocorre o disparo de uma exceção caso não se encontre uma lista de Subject por seus Ids")
  public void addSubjectTestNotFoundSubjectError() {
    Mockito
        .when(mainQuestionRepository.findById(mockMainQuestionId01))
        .thenReturn(Optional.of(mockMainQuestion01));

    Mockito
        .when(subjectRepository.findAllById(List.of(mockSubjectId01, mockSubjectId02)))
        .thenReturn(new ArrayList<>());

    assertThrows(
        NotFoundException.class,
        () -> mainQuestionService
            .addSubject(mockMainQuestionId01, List.of(mockSubjectId01, mockSubjectId02))
    );

    Mockito.verify(mainQuestionRepository).findById(any(UUID.class));
    Mockito.verify(subjectRepository).findAllById(any(Collection.class));
  }

  @Test
  @DisplayName("Verifica se é removido uma lista de entidades Subject de uma MainQuestion")
  public void removeSubjectTest() {
    Mockito
        .when(mainQuestionRepository.findById(mockMainQuestionId01))
        .thenReturn(Optional.of(mockMainQuestion01));

    Mockito
        .when(mainQuestionRepository.save(any(MainQuestion.class)))
        .thenAnswer(invocation -> invocation.getArgument(0));

    MainQuestion serviceResponse = mainQuestionService.removeSubject(
        mockMainQuestionId01,
          List.of(mockSubjectId01)
      );

    assertEquals(serviceResponse, mockMainQuestion01);
    assertEquals(0, serviceResponse.getSubjects().size());
    assertFalse(serviceResponse.getSubjects().contains(mockSubject01));

    Mockito
        .verify(mainQuestionRepository, Mockito.times(1))
        .findById(any(UUID.class));
    Mockito
        .verify(mainQuestionRepository, Mockito.times(1))
        .save(any(MainQuestion.class));
  }

  @Test
  @DisplayName("Verifica se ocorre o disparo de uma exceção caso não se encontre uma entidade MainQuestion por seu Id")
  public void removeSubjectTestNotFoundError() {
    Mockito
        .when(mainQuestionRepository.findById(mockMainQuestionId01))
        .thenReturn(Optional.empty());

    assertThrows(
        NotFoundException.class,
        () -> mainQuestionService
            .removeSubject(mockMainQuestionId01, List.of(mockSubjectId01, mockSubjectId02))
    );

    Mockito.verify(mainQuestionRepository).findById(mockMainQuestionId01);
  }

  @Test
  @DisplayName("Verifica se é criado e adicionado uma entidade AdaptedQuestion à uma MainQuestion")
  public void addAdaptedQuestionTest() {
    Mockito
        .when(mainQuestionRepository.findById(mockMainQuestionId01))
        .thenReturn(Optional.of(mockMainQuestion01));

    Mockito
        .when(mainQuestionRepository.save(any(MainQuestion.class)))
        .thenAnswer(invocation -> invocation.getArgument(0));

    MainQuestion serviceResponse = mainQuestionService
        .addAdaptedQuestion(
            mockMainQuestionId01,
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

    Mockito.verify(mainQuestionRepository).findById(mockMainQuestionId01);
    Mockito.verify(mainQuestionRepository).save(any(MainQuestion.class));
  }

  @Test
  @DisplayName("Verifica se ocorre o disparo de uma exceção caso não se encontre uma entidade MainQuestion por seu Id")
  public void addAdaptedQuestionTestNotFoundError() {
    Mockito
        .when(mainQuestionRepository.findById(mockMainQuestionId01))
        .thenReturn(Optional.empty());

    assertThrows(
        NotFoundException.class,
        () -> mainQuestionService
            .addAdaptedQuestion(mockMainQuestionId01, mockAdaptedQuestion01, new ArrayList<>())
    );

    Mockito.verify(mainQuestionRepository).findById(mockMainQuestionId01);
  }

  @Test
  @DisplayName("Verifica se é removido uma entidade AdaptedQuestion de uma MainQuestion")
  public void removeAdaptedQuestionTest() {
    Mockito
        .when(mainQuestionRepository.findById(mockMainQuestionId01))
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
        mockMainQuestionId01,
        mockAdaptedQuestionId02
    );

    List<AdaptedQuestion> adaptedQuestionList = mockMainQuestion01.getAdaptedQuestions();
    assertEquals(0, adaptedQuestionList.size());

    Mockito.verify(mainQuestionRepository).findById(mockMainQuestionId01);
    Mockito.verify(mainQuestionRepository).save(any(MainQuestion.class));
  }

  @Test
  @DisplayName("Verifica se ocorre o disparo de uma exceção caso não se encontre uma entidade MainQuestion por seu Id")
  public void removeAdaptedQuestionTestNotFoundMainQuestionError() {
    Mockito
        .when(mainQuestionRepository.findById(mockMainQuestionId01))
        .thenReturn(Optional.empty());

    assertThrows(
        NotFoundException.class,
        () -> mainQuestionService
            .removeAdaptedQuestion(mockMainQuestionId01, mockAdaptedQuestionId02)
    );

    Mockito.verify(mainQuestionRepository).findById(mockMainQuestionId01);
  }

  @Test
  @DisplayName("Verifica se ocorre o disparo de uma exceção caso não se encontre uma entidade AdaptedQuestion por seu Id")
  public void removeAdaptedQuestionTestNotFoundAdaptedQuestionError() {
    Mockito
        .when(mainQuestionRepository.findById(mockMainQuestionId01))
        .thenReturn(Optional.of(mockMainQuestion01));

    Mockito
        .when(adaptedQuestionRepository.findById(mockAdaptedQuestionId02))
        .thenReturn(Optional.empty());

    assertThrows(
        NotFoundException.class,
        () -> mainQuestionService
            .removeAdaptedQuestion(mockMainQuestionId01, mockAdaptedQuestionId02)
    );

    Mockito.verify(mainQuestionRepository).findById(mockMainQuestionId01);
    Mockito.verify(adaptedQuestionRepository).findById(mockAdaptedQuestionId02);
  }

  @Test
  @DisplayName("Verifica se ocorre o disparo de uma exceção caso as entidades AdaptedQuestion e MainQuestion não estejam relacionadas")
  public void removeAdaptedQuestionTestConflictDataError() {
    Mockito
        .when(mainQuestionRepository.findById(mockMainQuestionId01))
        .thenReturn(Optional.of(mockMainQuestion01));

    Mockito
        .when(adaptedQuestionRepository.findById(mockAdaptedQuestionId))
        .thenReturn(Optional.of(mockAdaptedQuestion01));

    assertThrows(
        ConflictDataException.class,
        () -> mainQuestionService
            .removeAdaptedQuestion(mockMainQuestionId01, mockAdaptedQuestionId)
    );

    Mockito.verify(mainQuestionRepository).findById(mockMainQuestionId01);
    Mockito.verify(adaptedQuestionRepository).findById(mockAdaptedQuestionId);
  }
}
