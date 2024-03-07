package com.mateco.reportgenerator.controller;

import static org.hamcrest.Matchers.isA;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.anyInt;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.multipart;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.patch;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import static org.mockito.ArgumentMatchers.any;


import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.mateco.reportgenerator.controller.dto.questionDto.MainQuestionListInputDto;
import com.mateco.reportgenerator.controller.dto.mockExamDto.MockExamInputDto;
import com.mateco.reportgenerator.controller.dto.subjectDto.SubjectListInputDto;
import com.mateco.reportgenerator.model.entity.Alternative;
import com.mateco.reportgenerator.model.entity.MainQuestion;
import com.mateco.reportgenerator.model.entity.MockExam;
import com.mateco.reportgenerator.model.entity.MockExamResponse;
import com.mateco.reportgenerator.model.entity.Subject;
import com.mateco.reportgenerator.service.FileServiceInterface;
import com.mateco.reportgenerator.service.MockExamServiceInterface;
import com.mateco.reportgenerator.service.exception.NotFoundException;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.ResultActions;
import org.springframework.web.multipart.MultipartFile;

@SpringBootTest
@AutoConfigureMockMvc
public class MockExamCrontollerTests {
  @Autowired
  MockMvc mockMvc;

  @MockBean
  private MockExamServiceInterface mockExamService;
  @MockBean
  private FileServiceInterface fileService;

  private String baseUrl;
  private ObjectMapper objectMapper;
  private UUID mockExamId01;
  private UUID mockExamId02;
  private UUID mockSubjectId01;
  private UUID mockSubjectId02;
  private UUID mockMainQuestionId01;
  private UUID mockMainQuestionId02;
  private UUID mockResponseId01;
  private UUID mockResponseId02;
  private MockExam mockExam01;
  private MockExam mockExam02;
  private Subject mockSubject01;
  private Subject mockSubject02;
  private MainQuestion mockMainQuestion01;
  private MainQuestion mockMainQuestion02;
  private MockExamResponse mockExamResponse01;
  private MockExamResponse mockExamResponse02;
  private MockExamResponse updatedMockExamResponse01;
  private MockExamResponse updatedMockExamResponse02;

  @BeforeEach
  public void setUp() throws JsonProcessingException {
    baseUrl = "/mock-exam";
    objectMapper = new ObjectMapper();

    mockExamId01 = UUID.randomUUID();
    mockExamId02 = UUID.randomUUID();
    mockSubjectId01 = UUID.randomUUID();
    mockSubjectId02 = UUID.randomUUID();
    mockMainQuestionId01 = UUID.randomUUID();
    mockMainQuestionId02 = UUID.randomUUID();
    mockResponseId01 = UUID.randomUUID();
    mockResponseId02 = UUID.randomUUID();

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

    mockMainQuestion01 = new MainQuestion(
        "título questão 01",
        new ArrayList<>(),
        "difícil",
        List.of("imagem da questão 01"),
        List.of(mockTrueAlternative, mockFalseAlternative),
        new ArrayList<>(),
        new ArrayList<>(),
        new ArrayList<>()
    );
    mockMainQuestion01.setId(mockMainQuestionId01);

    mockMainQuestion02 = new MainQuestion(
        "título questão 02",
        List.of(mockSubject01, mockSubject02),
        "difícil",
        List.of("imagem da questão 02"),
        List.of(mockFalseAlternative, mockTrueAlternative),
        new ArrayList<>(),
        new ArrayList<>(),
        new ArrayList<>()
    );
    mockMainQuestion02.setId(mockMainQuestionId02);

    mockExam01 = new MockExam(
        "primeiro simulado",
        List.of("intensivo", "extensivo"),
        new ArrayList<>(),
        1,
        new ArrayList<>()
    );
    mockExam01.setId(mockExamId01);

    mockExam02 = new MockExam(
        "segundo simulado",
        List.of("extensivo"),
        new ArrayList<>(),
        1,
        new ArrayList<>()
    );
    mockExam02.setId(mockExamId02);
    mockExam02.getSubjects().addAll(List.of(mockSubject01, mockSubject02));
    mockExam02.getMockExamQuestions().addAll(List.of(mockMainQuestion01, mockMainQuestion02));

    mockExamResponse01 = new MockExamResponse(
        "Cainã Jucá",
        "caina.juca@gmail.com",
        2,
        List.of("A", "B"),
        "easy",
        LocalDateTime.now()
    );
    updatedMockExamResponse01 = new MockExamResponse(
        mockResponseId01,
        mockExamResponse01.getName(),
        mockExamResponse01.getEmail(),
        mockExam01,
        2,
        mockExamResponse01.getTotalQuestions(),
        mockExamResponse01.getResponses(),
        new ArrayList<>(),
        mockExamResponse01.getComment(),
        mockExamResponse01.getCreatedAt()
    );

    mockExamResponse02 = new MockExamResponse(
        "Charles Alcantara",
        "charles.alcantara@gmail.com",
        2,
        List.of("B", "A"),
        "puts",
        LocalDateTime.now()
    );
    updatedMockExamResponse02 = new MockExamResponse(
        mockResponseId02,
        mockExamResponse02.getName(),
        mockExamResponse02.getEmail(),
        mockExam01,
        0,
        mockExamResponse02.getTotalQuestions(),
        mockExamResponse02.getResponses(),
        new ArrayList<>(),
        mockExamResponse02.getComment(),
        mockExamResponse02.getCreatedAt()
    );

  }

  @Test
  @DisplayName("Verifica se é retornado uma lista paginada das entidades MockExam com default parameters")
  public void findAllMockExamsDefaultParametersTest() throws Exception {
    int pageNumber = 0;
    int pageSize = 20;
    Page<MockExam> page = Mockito.mock(Page.class);

    Mockito
        .when(page.getNumber())
        .thenReturn(pageNumber);
    Mockito
        .when(page.getNumberOfElements())
        .thenReturn(pageSize);
    Mockito
        .when(page.getTotalPages())
        .thenReturn(1);
    Mockito
        .when(page.getContent())
        .thenReturn(List.of(mockExam01, mockExam02));

    Mockito
        .when(mockExamService.findAllMockExams(anyInt(), anyInt()))
        .thenReturn(page);

    ResultActions httpResponse = mockMvc
        .perform(get(baseUrl));

    httpResponse
        .andExpect(status().is(200))
        .andExpect(jsonPath("$.page").value(pageNumber))
        .andExpect(jsonPath("$.itemsNumber").value(pageSize))
        .andExpect(jsonPath("$.pages").value(1))
        .andExpect(jsonPath("$.data", isA(List.class)))
        .andExpect(jsonPath("$.data.[0].id").value(mockExamId01.toString()))
        .andExpect(jsonPath("$.data.[0].name").value(mockExam01.getName()))
        .andExpect(jsonPath("$.data.[0].className", isA(List.class)))
        .andExpect(jsonPath("$.data.[0].subjects", isA(List.class)))
        .andExpect(jsonPath("$.data.[0].number").value(1))
        .andExpect(jsonPath("$.data.[0].mockExamQuestions", isA(List.class)))
        .andExpect(jsonPath("$.data.[1].id").value(mockExamId02.toString()))
        .andExpect(jsonPath("$.data.[1].name").value(mockExam02.getName()))
        .andExpect(jsonPath("$.data.[1].className", isA(List.class)))
        .andExpect(jsonPath("$.data.[1].subjects", isA(List.class)))
        .andExpect(jsonPath("$.data.[1].number").value(1))
        .andExpect(jsonPath("$.data.[1].mockExamQuestions", isA(List.class)));

    ArgumentCaptor<Integer> pageNumberCaptor = ArgumentCaptor.forClass(Integer.class);
    ArgumentCaptor<Integer> pageSizeCaptor = ArgumentCaptor.forClass(Integer.class);
    Mockito
        .verify(mockExamService, Mockito.times(1))
        .findAllMockExams(pageNumberCaptor.capture(), pageSizeCaptor.capture());

    assertEquals(pageNumber, pageNumberCaptor.getValue());
    assertEquals(pageSize, pageSizeCaptor.getValue());
  }

  @Test
  @DisplayName("Verifica se é retornado uma lista paginada das entidades MockExam com query parameters")
  public void findAllMockExamsQueryParametersTest() throws Exception {
    int pageNumber = 0;
    int pageSize = 2;
    Page<MockExam> page = Mockito.mock(Page.class);

    Mockito
        .when(page.getNumber())
        .thenReturn(pageNumber);
    Mockito
        .when(page.getNumberOfElements())
        .thenReturn(pageSize);
    Mockito
        .when(page.getTotalPages())
        .thenReturn(1);
    Mockito
        .when(page.getContent())
        .thenReturn(List.of(mockExam01, mockExam02));

    Mockito
        .when(mockExamService.findAllMockExams(anyInt(), anyInt()))
        .thenReturn(page);

    String endpoint = baseUrl + "?pageNumber=" + pageNumber + "&pageSize=" + pageSize;
    ResultActions httpResponse = mockMvc.perform(get(endpoint));

    httpResponse
        .andExpect(status().is(200))
        .andExpect(jsonPath("$.page").value(pageNumber))
        .andExpect(jsonPath("$.itemsNumber").value(pageSize))
        .andExpect(jsonPath("$.pages").value(1))
        .andExpect(jsonPath("$.data", isA(List.class)))
        .andExpect(jsonPath("$.data.[0].id").value(mockExamId01.toString()))
        .andExpect(jsonPath("$.data.[0].name").value(mockExam01.getName()))
        .andExpect(jsonPath("$.data.[0].className", isA(List.class)))
        .andExpect(jsonPath("$.data.[0].subjects", isA(List.class)))
        .andExpect(jsonPath("$.data.[0].number").value(1))
        .andExpect(jsonPath("$.data.[0].mockExamQuestions", isA(List.class)))
        .andExpect(jsonPath("$.data.[1].id").value(mockExamId02.toString()))
        .andExpect(jsonPath("$.data.[1].name").value(mockExam02.getName()))
        .andExpect(jsonPath("$.data.[1].className", isA(List.class)))
        .andExpect(jsonPath("$.data.[1].subjects", isA(List.class)))
        .andExpect(jsonPath("$.data.[1].number").value(1))
        .andExpect(jsonPath("$.data.[1].mockExamQuestions", isA(List.class)));

    ArgumentCaptor<Integer> pageNumberCaptor = ArgumentCaptor.forClass(Integer.class);
    ArgumentCaptor<Integer> pageSizeCaptor = ArgumentCaptor.forClass(Integer.class);
    Mockito
        .verify(mockExamService, Mockito.times(1))
        .findAllMockExams(pageNumberCaptor.capture(), pageSizeCaptor.capture());

    assertEquals(pageNumber, pageNumberCaptor.getValue());
    assertEquals(pageSize, pageSizeCaptor.getValue());
  }

  @Test
  @DisplayName("Verifica se é retornado uma MockExam por seu id")
  public void findMockExamByIdTest() throws Exception {
    Mockito
        .when(mockExamService.findMockExamById(mockExamId01))
        .thenReturn(mockExam01);

    String endpoint = baseUrl + "/" + mockExamId01.toString();

    ResultActions httpResponse = mockMvc
        .perform(get(endpoint));

    httpResponse
        .andExpect(status().is(200))
        .andExpect(jsonPath("$.id").value(mockExamId01.toString()))
        .andExpect(jsonPath("$.name").value(mockExam01.getName()))
        .andExpect(jsonPath("$.className", isA(List.class)))
        .andExpect(jsonPath("$.subjects", isA(List.class)))
        .andExpect(jsonPath("$.number").value(1))
        .andExpect(jsonPath("$.mockExamQuestions", isA(List.class)));

    Mockito.verify(mockExamService, Mockito.times(1))
        .findMockExamById(any(UUID.class));
  }

  @Test
  @DisplayName("Verifica se é retornado uma MockExam por seu id")
  public void findMockExamByIdTestNotFoundError() throws Exception {
    Mockito
        .when(mockExamService.findMockExamById(mockExamId01))
        .thenThrow(new NotFoundException("Simulado não encontrado!"));

    String endpoint = baseUrl + "/" + mockExamId01.toString();

    ResultActions httpResponse = mockMvc
        .perform(get(endpoint));

    httpResponse
        .andExpect(status().is(404))
        .andExpect(jsonPath("$").value("Simulado não encontrado!"));

    Mockito.verify(mockExamService, Mockito.times(1))
        .findMockExamById(any(UUID.class));
  }

  @Test
  @DisplayName("Verifica se criado uma entidade MockExam")
  public void createMockExamTest() throws Exception {
    Mockito
        .when(mockExamService.createMockExam(
            any(MockExam.class)
        )).thenReturn(mockExam01);

    MockExamInputDto mockExamInputDto = new MockExamInputDto(
        "nome do simulado",
        List.of("intensivo"),
        1
    );

    ResultActions httpResponse = mockMvc
        .perform(post(baseUrl)
            .contentType(MediaType.APPLICATION_JSON)
            .content(objectMapper.writeValueAsString(mockExamInputDto))
        );

    httpResponse
        .andExpect(status().is(201))
        .andExpect(jsonPath("$.id").value(mockExamId01.toString()))
        .andExpect(jsonPath("$.name").value(mockExam01.getName()))
        .andExpect(jsonPath("$.className", isA(List.class)))
        .andExpect(jsonPath("$.subjects", isA(List.class)))
        .andExpect(jsonPath("$.number").value(mockExam01.getNumber()))
        .andExpect(jsonPath("$.mockExamQuestions", isA(List.class)));

    Mockito.verify(mockExamService, Mockito.times(1))
        .createMockExam(any(MockExam.class));
  }

  @Test
  @DisplayName("Verifica se uma entidade MockExam é atualizada pelo seu id")
  public void updateMockExamByIdTest() throws Exception {
    Mockito
        .when(mockExamService.updateMockExamById(any(UUID.class), any(MockExam.class)))
        .thenReturn(mockExam01);

    MockExamInputDto mockExamInputDto = new MockExamInputDto(
        "nomde do simulado alterado",
        new ArrayList<>(),
        1
    );

    String endpoint = baseUrl + "/" + mockExamId01.toString();

    ResultActions httpResponse = mockMvc
        .perform(put(endpoint)
            .contentType(MediaType.APPLICATION_JSON)
            .content(objectMapper.writeValueAsString(mockExamInputDto)));

    httpResponse
        .andExpect(status().is(200))
        .andExpect(jsonPath("$.id").value(mockExamId01.toString()))
        .andExpect(jsonPath("$.name").value(mockExam01.getName()))
        .andExpect(jsonPath("$.className", isA(List.class)))
        .andExpect(jsonPath("$.subjects", isA(List.class)))
        .andExpect(jsonPath("$.number").value(mockExam01.getNumber()))
        .andExpect(jsonPath("$.mockExamQuestions", isA(List.class)));

    Mockito.verify(mockExamService, Mockito.times(1))
        .updateMockExamById(any(UUID.class), any(MockExam.class));
  }

  @Test
  @DisplayName("Verifica se é disparado uma exceção quando uma entidade MockExam não é encontrada pelo seu id")
  public void updateMockExamByIdTestNotFoundError() throws Exception {
    Mockito
        .when(mockExamService.updateMockExamById(any(UUID.class), any(MockExam.class)))
        .thenThrow(new NotFoundException("Simulado não encontrado!"));

    MockExamInputDto mockExamInputDto = new MockExamInputDto(
        "nomde do simulado alterado",
        new ArrayList<>(),
        1
    );

    String endpoint = baseUrl + "/" + mockExamId01.toString();

    ResultActions httpResponse = mockMvc
        .perform(put(endpoint)
            .contentType(MediaType.APPLICATION_JSON)
            .content(objectMapper.writeValueAsString(mockExamInputDto)));

    httpResponse
        .andExpect(status().is(404))
        .andExpect(jsonPath("$").value("Simulado não encontrado!"));

    Mockito.verify(mockExamService, Mockito.times(1))
        .updateMockExamById(any(UUID.class), any(MockExam.class));
  }

  @Test
  @DisplayName("Verifica se a entidade Subject é adicionada a uma MockExam")
  public void addSubjectToMockExamTest() throws Exception {
    Mockito
        .when(mockExamService.addSubject(any(UUID.class), any(List.class)))
        .thenReturn(mockExam02);

    String endpoint = baseUrl
        + "/"
        + mockExamId02.toString()
        + "/subject";

    SubjectListInputDto subjectIdListinput = new SubjectListInputDto(
        List.of(mockSubjectId01, mockSubjectId02)
    );

    ResultActions httpResponse = mockMvc.perform(
        patch(endpoint)
            .contentType(MediaType.APPLICATION_JSON)
            .content(objectMapper.writeValueAsString(subjectIdListinput))
    );

    httpResponse
        .andExpect(status().is(200))
        .andExpect(jsonPath("$.id").value(mockExamId02.toString()))
        .andExpect(jsonPath("$.name").value(mockExam02.getName()))
        .andExpect(jsonPath("$.className", isA(List.class)))
        .andExpect(jsonPath("$.subjects", isA(List.class)))
        .andExpect(jsonPath("$.subjects.[*].id").exists())
        .andExpect(jsonPath("$.subjects.[0].id").value(mockSubjectId01.toString()))
        .andExpect(jsonPath("$.subjects.[0].name").value(mockSubject01.getName()))
        .andExpect(jsonPath("$.subjects.[1].id").value(mockSubjectId02.toString()))
        .andExpect(jsonPath("$.subjects.[1].name").value(mockSubject02.getName()))
        .andExpect(jsonPath("$.number").value(mockExam02.getNumber()))
        .andExpect(jsonPath("$.mockExamQuestions", isA(List.class)));

    Mockito.verify(mockExamService, Mockito.times(1))
        .addSubject(any(UUID.class), any(List.class));
  }

  @Test
  @DisplayName("Verifica se é disparado uma exceção quando uma entidade MockExam não é encotnrada")
  public void addSubjectToMockExamTestNotFoundMockExamError() throws Exception {
    Mockito
        .when(mockExamService.addSubject(any(UUID.class), any(List.class)))
        .thenThrow(new NotFoundException("Simulado não encontrado!"));

    String endpoint = baseUrl
        + "/"
        + mockExamId02.toString()
        + "/subject";

    SubjectListInputDto subjectIdListinput = new SubjectListInputDto(
        List.of(mockSubjectId01, mockSubjectId02)
    );

    ResultActions httpResponse = mockMvc.perform(
        patch(endpoint)
            .contentType(MediaType.APPLICATION_JSON)
            .content(objectMapper.writeValueAsString(subjectIdListinput))
    );

    httpResponse
        .andExpect(status().is(404))
        .andExpect(jsonPath("$").value("Simulado não encontrado!"));

    Mockito.verify(mockExamService, Mockito.times(1))
        .addSubject(any(UUID.class), any(List.class));
  }

  @Test
  @DisplayName("Verifica se é disparado uma exceção quando não é retornado uma lista de Subjects pelos seus ids")
  public void addSubjectToMockExamTestNotFoundSubjectLisError() throws Exception {
    Mockito
        .when(mockExamService.addSubject(any(UUID.class), any(List.class)))
        .thenThrow(new NotFoundException("Nenhum assunto encontrado com os IDs fornecidos!"));

    String endpoint = baseUrl
        + "/"
        + mockExamId02.toString()
        + "/subject";

    SubjectListInputDto subjectIdListinput = new SubjectListInputDto(
        List.of(mockSubjectId01, mockSubjectId02)
    );

    ResultActions httpResponse = mockMvc.perform(
        patch(endpoint)
            .contentType(MediaType.APPLICATION_JSON)
            .content(objectMapper.writeValueAsString(subjectIdListinput))
    );

    httpResponse
        .andExpect(status().is(404))
        .andExpect(jsonPath("$").value("Nenhum assunto encontrado com os IDs fornecidos!"));

    Mockito.verify(mockExamService, Mockito.times(1))
        .addSubject(any(UUID.class), any(List.class));
  }

  @Test
  @DisplayName("Verifica se a entidade Subject é removida de uma MockExam")
  public void removeSubjectFromMockExamTest() throws Exception {
    Mockito
        .doNothing()
        .when(mockExamService).removeSubject(any(UUID.class), any(List.class));

    String endpoint = baseUrl
        + "/"
        + mockExamId01.toString()
        + "/subject";

    SubjectListInputDto subjectIdListinput = new SubjectListInputDto(
        List.of(mockSubjectId01, mockSubjectId02)
    );

    ResultActions httpResponse = mockMvc.perform(
        delete(endpoint)
            .contentType(MediaType.APPLICATION_JSON)
            .content(objectMapper.writeValueAsString(subjectIdListinput))
    );

    httpResponse
        .andExpect(status().is(204));

    Mockito.verify(mockExamService, Mockito.times(1))
        .removeSubject(any(UUID.class), any(List.class));
  }

  @Test
  @DisplayName("Verifica se é disparado uma exceção quando um MockExam não é encontrado")
  public void removeSubjectFromMockExamTestNotFoundMockExamError() throws Exception {
    Mockito
        .doThrow(new NotFoundException("Simulado não encontrado!"))
        .when(mockExamService).removeSubject(any(UUID.class), any(List.class));

    String endpoint = baseUrl
        + "/"
        + mockExamId01.toString()
        + "/subject";

    SubjectListInputDto subjectIdListinput = new SubjectListInputDto(
        List.of(mockSubjectId01, mockSubjectId02)
    );

    ResultActions httpResponse = mockMvc.perform(
        delete(endpoint)
            .contentType(MediaType.APPLICATION_JSON)
            .content(objectMapper.writeValueAsString(subjectIdListinput))
    );

    httpResponse
        .andExpect(status().is(404))
        .andExpect(jsonPath("$").value("Simulado não encontrado!"));

    Mockito.verify(mockExamService, Mockito.times(1))
        .removeSubject(any(UUID.class), any(List.class));
  }

  @Test
  @DisplayName("Verifica se a entidade MainQuestion é adicionada a uma MockExam")
  public void addMainQuestionsToMockExamTest() throws Exception {
    Mockito
        .when(mockExamService.addMainQuestion(any(UUID.class), any(List.class)))
        .thenReturn(mockExam02);

    String endpoint = baseUrl
        + "/"
        + mockExamId02.toString()
        + "/main-question";

    MainQuestionListInputDto mainQuestionListInputDto = new MainQuestionListInputDto(
        List.of(mockMainQuestionId01, mockMainQuestionId02)
    );

    ResultActions httpResponse = mockMvc.perform(
        patch(endpoint)
            .contentType(MediaType.APPLICATION_JSON)
            .content(objectMapper.writeValueAsString(mainQuestionListInputDto))
    );

    httpResponse
        .andExpect(status().is(200))
        .andExpect(jsonPath("$.id").value(mockExamId02.toString()))
        .andExpect(jsonPath("$.name").value(mockExam02.getName()))
        .andExpect(jsonPath("$.className", isA(List.class)))
        .andExpect(jsonPath("$.subjects", isA(List.class)))
        .andExpect(jsonPath("$.number").value(mockExam02.getNumber()))
        .andExpect(jsonPath("$.mockExamQuestions", isA(List.class)))
        .andExpect(jsonPath("$.mockExamQuestions.[*].id").exists())
        .andExpect(jsonPath("$.mockExamQuestions.[0].id").value(mockMainQuestionId01.toString()))
        .andExpect(jsonPath("$.mockExamQuestions.[0].title").value(mockMainQuestion01.getTitle()))
        .andExpect(jsonPath("$.mockExamQuestions.[0].level").value(mockMainQuestion01.getLevel()))
        .andExpect(jsonPath("$.mockExamQuestions.[0].subjects", isA(List.class)))
        .andExpect(jsonPath("$.mockExamQuestions.[0].images", isA(List.class)))
        .andExpect(jsonPath("$.mockExamQuestions.[0].alternatives", isA(List.class)))
        .andExpect(jsonPath("$.mockExamQuestions.[0].alternatives.[*].id").exists())
        .andExpect(jsonPath("$.mockExamQuestions.[0].adaptedQuestions", isA(List.class)))
        .andExpect(jsonPath("$.mockExamQuestions.[0].mockExams", isA(List.class)))
        .andExpect(jsonPath("$.mockExamQuestions.[0].handouts", isA(List.class)))
        .andExpect(jsonPath("$.mockExamQuestions.[1].id").value(mockMainQuestionId02.toString()))
        .andExpect(jsonPath("$.mockExamQuestions.[1].title").value(mockMainQuestion02.getTitle()))
        .andExpect(jsonPath("$.mockExamQuestions.[1].level").value(mockMainQuestion02.getLevel()))
        .andExpect(jsonPath("$.mockExamQuestions.[1].subjects", isA(List.class)))
        .andExpect(jsonPath("$.mockExamQuestions.[1].images", isA(List.class)))
        .andExpect(jsonPath("$.mockExamQuestions.[1].alternatives", isA(List.class)))
        .andExpect(jsonPath("$.mockExamQuestions.[1].alternatives.[*].id").exists())
        .andExpect(jsonPath("$.mockExamQuestions.[1].adaptedQuestions", isA(List.class)))
        .andExpect(jsonPath("$.mockExamQuestions.[1].mockExams", isA(List.class)))
        .andExpect(jsonPath("$.mockExamQuestions.[1].handouts", isA(List.class)));

    Mockito.verify(mockExamService, Mockito.times(1))
        .addMainQuestion(any(UUID.class), any(List.class));
  }

  @Test
  @DisplayName("Verifica se é disparado uma exceção quando um MockExam não é encontrado")
  public void addMainQuestionsToMockExamTestNotFoundMockExamError() throws Exception {
    Mockito
        .when(mockExamService.addMainQuestion(any(UUID.class), any(List.class)))
        .thenThrow(new NotFoundException("Simulado não encontrado!"));

    String endpoint = baseUrl
        + "/"
        + mockExamId01.toString()
        + "/main-question";

    MainQuestionListInputDto mainQuestionListInputDto = new MainQuestionListInputDto(
        List.of(mockMainQuestionId01, mockMainQuestionId02)
    );

    ResultActions httpResponse = mockMvc.perform(
        patch(endpoint)
            .contentType(MediaType.APPLICATION_JSON)
            .content(objectMapper.writeValueAsString(mainQuestionListInputDto))
    );

    httpResponse
        .andExpect(status().is(404))
        .andExpect(jsonPath("$").value("Simulado não encontrado!"));

    Mockito.verify(mockExamService, Mockito.times(1))
        .addMainQuestion(any(UUID.class), any(List.class));
  }

  @Test
  @DisplayName("Verifica se é disparado uma exceção quando não é retornado uma lista de MainQuestion pelos seus ids")
  public void addMainQuestionsToMockExamTestNotFoundMainQuestionListError() throws Exception {
    Mockito
        .when(mockExamService.addMainQuestion(any(UUID.class), any(List.class)))
        .thenThrow(new NotFoundException("Nenhuma questão principal foi encontrada com os IDs fornecidos!"));

    String endpoint = baseUrl
        + "/"
        + mockExamId01.toString()
        + "/main-question";

    MainQuestionListInputDto mainQuestionListInputDto = new MainQuestionListInputDto(
        List.of(mockMainQuestionId01, mockMainQuestionId02)
    );

    ResultActions httpResponse = mockMvc.perform(
        patch(endpoint)
            .contentType(MediaType.APPLICATION_JSON)
            .content(objectMapper.writeValueAsString(mainQuestionListInputDto))
    );

    httpResponse
        .andExpect(status().is(404))
        .andExpect(jsonPath("$").value("Nenhuma questão principal foi encontrada com os IDs fornecidos!"));

    Mockito.verify(mockExamService, Mockito.times(1))
        .addMainQuestion(any(UUID.class), any(List.class));
  }

  @Test
  @DisplayName("Verifica se a entidade MainQuestion é removida de uma MockExam")
  public void removeMainQuestionTest() throws Exception {
    Mockito
        .when(mockExamService.addMainQuestion(any(UUID.class), any(List.class)))
        .thenReturn(mockExam01);

    String endpoint = baseUrl
        + "/"
        + mockExamId01.toString()
        + "/main-question";

    MainQuestionListInputDto mainQuestionListInputDto = new MainQuestionListInputDto(
        List.of(mockMainQuestionId01, mockMainQuestionId02)
    );

    ResultActions httpResponse = mockMvc.perform(
        delete(endpoint)
            .contentType(MediaType.APPLICATION_JSON)
            .content(objectMapper.writeValueAsString(mainQuestionListInputDto))
    );

    httpResponse
        .andExpect(status().is(204));

    Mockito.verify(mockExamService, Mockito.times(1))
        .removeMainQuestion(any(UUID.class), any(List.class));
  }

  @Test
  @DisplayName("Verifica se é disparado uma exceção quando não se encontra uma entidade MockExam")
  public void removeMainQuestionTestNotFoundMockExamError() throws Exception {
    Mockito
        .doThrow(new NotFoundException("Simulado não encontrado!"))
        .when(mockExamService).removeMainQuestion(any(UUID.class), any(List.class));

    String endpoint = baseUrl
        + "/"
        + mockExamId01.toString()
        + "/main-question";

    MainQuestionListInputDto mainQuestionListInputDto = new MainQuestionListInputDto(
        List.of(mockMainQuestionId01, mockMainQuestionId02)
    );

    ResultActions httpResponse = mockMvc.perform(
        delete(endpoint)
            .contentType(MediaType.APPLICATION_JSON)
            .content(objectMapper.writeValueAsString(mainQuestionListInputDto))
    );

    httpResponse
        .andExpect(status().is(404))
        .andExpect(jsonPath("$").value("Simulado não encontrado!"));

    Mockito.verify(mockExamService, Mockito.times(1))
        .removeMainQuestion(any(UUID.class), any(List.class));
  }

  @Test
  @DisplayName("Verifica se é registrado as entidades MockExamResponse a partir de um documento .xlsx")
  public void registerMockExamResponsesTest() throws Exception {
    Mockito
        .when(fileService.xlsxReader(any(MultipartFile.class)))
        .thenReturn(List.of(mockExamResponse01, mockExamResponse02));

    Mockito
        .when(mockExamService.registerAllMockExamResponses(any(UUID.class), any(List.class)))
        .thenReturn(List.of(updatedMockExamResponse01, updatedMockExamResponse02));

    String endpoint = baseUrl
        + "/"
        + mockExamId01.toString()
        + "/responses";

    MockMultipartFile inputPartFile = new MockMultipartFile(
        "studentsMockExamsAnswers",
        "studentsAnswer",
        MediaType.APPLICATION_JSON_VALUE,
        "studentsAnswer".getBytes()
    );

    ResultActions httpResponse = mockMvc.perform(
        multipart(HttpMethod.POST, endpoint)
            .file(inputPartFile)
            .contentType(MediaType.MULTIPART_FORM_DATA)

    );

    httpResponse
        .andExpect(status().is(200))
        .andExpect(jsonPath("$", isA(List.class)))
        .andExpect(jsonPath("$.[*].id").exists())
        .andExpect(jsonPath("$.[0].id").value(mockResponseId01.toString()))
        .andExpect(jsonPath("$.[0].name").value(updatedMockExamResponse01.getName()))
        .andExpect(jsonPath("$.[0].email").value(updatedMockExamResponse01.getEmail()))
        .andExpect(jsonPath("$.[0].mockExamId").value(mockExam01.getId().toString()))
        .andExpect(jsonPath("$.[0].correctAnswers").value(2))
        .andExpect(jsonPath("$.[0].response", isA(List.class)))
        .andExpect(jsonPath("$.[0].response.[0]").value("A"))
        .andExpect(jsonPath("$.[0].response.[1]").value("B"))
        .andExpect(jsonPath("$.[0].adaptedQuestions", isA(List.class)))
        .andExpect(jsonPath("$.[0].comment").value(updatedMockExamResponse01.getComment()))
        .andExpect(jsonPath("$.[0].createdAt", isA(String.class)))
        .andExpect(jsonPath("$.[1].id").value(mockResponseId02.toString()))
        .andExpect(jsonPath("$.[1].name").value(updatedMockExamResponse02.getName()))
        .andExpect(jsonPath("$.[1].email").value(updatedMockExamResponse02.getEmail()))
        .andExpect(jsonPath("$.[1].mockExamId").value(mockExam01.getId().toString()))
        .andExpect(jsonPath("$.[1].correctAnswers").value(0))
        .andExpect(jsonPath("$.[1].response", isA(List.class)))
        .andExpect(jsonPath("$.[1].response.[0]").value("B"))
        .andExpect(jsonPath("$.[1].response.[1]").value("A"))
        .andExpect(jsonPath("$.[1].adaptedQuestions", isA(List.class)))
        .andExpect(jsonPath("$.[1].comment").value(updatedMockExamResponse02.getComment()))
        .andExpect(jsonPath("$.[1].createdAt", isA(String.class)));

    Mockito.verify(fileService, Mockito.times(1))
        .xlsxReader(any(MultipartFile.class));
    Mockito.verify(mockExamService, Mockito.times(1))
        .registerAllMockExamResponses(any(UUID.class), any(List.class));
  }

  @Test
  @DisplayName("Verifica se é disparado uma exceção quando não se encontra uma entidade MockExam")
  public void registerMockExamResponsesTestNotFoundMockExamError() throws Exception {
    Mockito
        .when(fileService.xlsxReader(any(MultipartFile.class)))
        .thenReturn(List.of(mockExamResponse01, mockExamResponse02));

    Mockito
        .when(mockExamService.registerAllMockExamResponses(any(UUID.class), any(List.class)))
        .thenThrow(new NotFoundException("Simulado não encontrado!"));

    String endpoint = baseUrl
        + "/"
        + mockExamId01.toString()
        + "/responses";

    MockMultipartFile inputPartFile = new MockMultipartFile(
        "studentsMockExamsAnswers",
        "studentsAnswer",
        MediaType.APPLICATION_JSON_VALUE,
        "studentsAnswer".getBytes()
    );

    ResultActions httpResponse = mockMvc.perform(
        multipart(HttpMethod.POST, endpoint)
            .file(inputPartFile)
            .contentType(MediaType.MULTIPART_FORM_DATA)

    );

    httpResponse
        .andExpect(status().is(404))
        .andExpect(jsonPath("$").value("Simulado não encontrado!"));

    Mockito.verify(fileService, Mockito.times(1))
        .xlsxReader(any(MultipartFile.class));
    Mockito.verify(mockExamService, Mockito.times(1))
        .registerAllMockExamResponses(any(UUID.class), any(List.class));
  }

  @Test
  @DisplayName("Verifica se é disparado uma exceção quando uma entidade MainQuestion não possue uma alterantiva correta")
  public void registerMockExamResponsesTestNotFoundCorrectAnswerError() throws Exception {
    Mockito
        .when(fileService.xlsxReader(any(MultipartFile.class)))
        .thenReturn(List.of(mockExamResponse01, mockExamResponse02));

    Mockito
        .when(mockExamService.registerAllMockExamResponses(any(UUID.class), any(List.class)))
        .thenThrow(new NotFoundException("Alternativa correta não encontrada!"));

    String endpoint = baseUrl
        + "/"
        + mockExamId01.toString()
        + "/responses";

    MockMultipartFile inputPartFile = new MockMultipartFile(
        "studentsMockExamsAnswers",
        "studentsAnswer",
        MediaType.APPLICATION_JSON_VALUE,
        "studentsAnswer".getBytes()
    );

    ResultActions httpResponse = mockMvc.perform(
        multipart(HttpMethod.POST, endpoint)
            .file(inputPartFile)
            .contentType(MediaType.MULTIPART_FORM_DATA)

    );

    httpResponse
        .andExpect(status().is(404))
        .andExpect(jsonPath("$").value("Alternativa correta não encontrada!"));

    Mockito.verify(fileService, Mockito.times(1))
        .xlsxReader(any(MultipartFile.class));
    Mockito.verify(mockExamService, Mockito.times(1))
        .registerAllMockExamResponses(any(UUID.class), any(List.class));
  }

}
