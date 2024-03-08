package com.mateco.reportgenerator.controller;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.hamcrest.Matchers.isA;
import static org.mockito.ArgumentMatchers.anyInt;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.mateco.reportgenerator.controller.dto.subjectDto.SubjectListInputDto;
import com.mateco.reportgenerator.model.entity.AdaptedQuestion;
import com.mateco.reportgenerator.model.entity.Alternative;
import com.mateco.reportgenerator.model.entity.MainQuestion;
import com.mateco.reportgenerator.model.entity.Subject;
import com.mateco.reportgenerator.service.ImageServiceInterface;
import com.mateco.reportgenerator.service.exception.ConflictDataException;
import com.mateco.reportgenerator.service.exception.NotFoundException;
import com.mateco.reportgenerator.service.implementation.AdaptedQuestionService;
import com.mateco.reportgenerator.service.implementation.MainQuestionService;
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

  private String baseUrl;
  private UUID mockMainQuestionId01;
  private UUID mockMainQuestionId02;
  private UUID mockAdaptedQuestionId01;
  private UUID mockAdaptedQuestionId02;
  private List<MockMultipartFile> multipartFiles;
  private Alternative mockAlternative01;
  private Alternative mockAlternative02;
  private String mainQuestionInput;
  private SubjectListInputDto subjectIdListinput;
  private MainQuestion mockMainQuestion01;
  private MainQuestion mockMainQuestion02;
  private AdaptedQuestion mockAdaptedQuestion01;
  private AdaptedQuestion mockAdaptedQuestion02;
  private Subject mockSubject01;
  private Subject mockSubject02;

  @BeforeEach
  public void setUp() {
    baseUrl = "/main-question";
    mockMainQuestionId01 = UUID.randomUUID();
    mockMainQuestionId02 = UUID.randomUUID();
    mockAdaptedQuestionId01 = UUID.randomUUID();
    mockAdaptedQuestionId02 = UUID.randomUUID();

    MockMultipartFile mockFile01 = new MockMultipartFile("file", "filename1.jpg", "image/jpeg",
        "image_example_01".getBytes());
    MockMultipartFile mockFile02 = new MockMultipartFile("file", "filename2.jpg", "image/jpeg",
        "image_example_02".getBytes());
    MockMultipartFile mockFile03 = new MockMultipartFile("file", "filename3.jpg", "image/jpeg",
        "image_example_03".getBytes());
    multipartFiles = List.of(mockFile01, mockFile02, mockFile03);

    mainQuestionInput = "{\n"
        + "\t\"title\": \"titulo da questao\",\n"
        + "\t\"level\": \"nivel da questao\",\n"
        + "\t\"alternatives\": [\n"
        + "\t\t{\n"
        + "\t\t\t\"description\": \"descricao da alternativa\",\n"
        + "\t\t\t\"questionAnswer\": false\n"
        + "\t\t},\n"
        + "\t\t{\n"
        + "\t\t\t\"description\": \"descricao da alternativa\",\n"
        + "\t\t\t\"questionAnswer\": false\n"
        + "\t\t}\n"
        + "\t]\n"
        + "}";

    subjectIdListinput = new SubjectListInputDto(
        List.of(UUID.randomUUID(), UUID.randomUUID())
    );

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
    mockSubject01 = new Subject("Geometria");
    mockSubject02 = new Subject("Algebra");

    mockMainQuestion01 = new MainQuestion(
        "título questão 01",
        new ArrayList<>(),
        "difícil",
        List.of("imagem da questão 01"),
        List.of(mockAlternative01, mockAlternative02),
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
        List.of(mockAlternative01, mockAlternative02),
        new ArrayList<>(),
        new ArrayList<>(),
        new ArrayList<>()
    );
    mockMainQuestion02.setId(mockMainQuestionId02);

    mockAdaptedQuestion01 = new AdaptedQuestion(
        "título da questão adaptada 01",
        "fácil",
        List.of("imagem da questão adaptada 01"),
        List.of(mockAlternative01, mockAlternative02)
    );
    mockAdaptedQuestion01.setId(mockAdaptedQuestionId01);
    mockMainQuestion01.getAdaptedQuestions().add(mockAdaptedQuestion01);
    mockAdaptedQuestion01.setMainQuestion(mockMainQuestion01);

    mockAdaptedQuestion02 = new AdaptedQuestion(
        "título questão adaptada 02",
        "médio",
        List.of("imagem da questão 02"),
        List.of(mockAlternative01, mockAlternative02)
    );
    mockAdaptedQuestion02.setId(mockAdaptedQuestionId02);
  }

  @Test
  @DisplayName("Verifica se é retornado uma lista paginada das entidades MainQuestion com default parameters")
  public void findAllMainQuestionsDefaultParametersTest() throws Exception {
    int pageNumber = 0;
    int pageSize = 20;
    long totalItems = 2;

    Page<MainQuestion> page = Mockito.mock(Page.class);

    Mockito
        .when(page.getNumberOfElements())
        .thenReturn(pageSize);
    Mockito
        .when(page.getTotalElements())
        .thenReturn(totalItems);
    Mockito
        .when(page.getTotalPages())
        .thenReturn(1);
    Mockito
        .when(page.getContent())
        .thenReturn(List.of(mockMainQuestion01, mockMainQuestion02));

    Mockito
        .when(mainQuestionService.findAllMainQuestions(anyInt(), anyInt()))
        .thenReturn(page);

    ResultActions httpResponse = mockMvc.perform(get(baseUrl));

    httpResponse
        .andExpect(status().is(200))
        .andExpect(jsonPath("$.pageItems").value(pageSize))
        .andExpect(jsonPath("$.totalItems").value(totalItems))
        .andExpect(jsonPath("$.pages").value(1))
        .andExpect(jsonPath("$.data", isA(List.class)))
        .andExpect(jsonPath("$.data.[0].id").value(mockMainQuestionId01.toString()))
        .andExpect(jsonPath("$.data.[0].title").value("título questão 01"))
        .andExpect(jsonPath("$.data.[0].level").value("difícil"))
        .andExpect(jsonPath("$.data.[0].subjects", isA(List.class)))
        .andExpect(jsonPath("$.data.[0].images", isA(List.class)))
        .andExpect(jsonPath("$.data.[0].images.[0]").value("imagem da questão 01"))
        .andExpect(jsonPath("$.data.[0].alternatives", isA(List.class)))
        .andExpect(jsonPath("$.data.[0].alternatives.[*].id").exists())
        .andExpect(jsonPath("$.data.[0].alternatives.[0].description").value("descrição da alternativa 01"))
        .andExpect(jsonPath("$.data.[0].alternatives.[0].images", isA(List.class)))
        .andExpect(jsonPath("$.data.[0].alternatives.[0].images.[0]").value("imagem alternativa 01"))
        .andExpect(jsonPath("$.data.[0].alternatives.[1].description").value("descrição da alternativa 02"))
        .andExpect(jsonPath("$.data.[0].alternatives.[1].images", isA(List.class)))
        .andExpect(jsonPath("$.data.[0].alternatives.[1].images.[0]").value("imagem alternativa 02"))
        .andExpect(jsonPath("$.data.[0].adaptedQuestions", isA(List.class)))
        .andExpect(jsonPath("$.data.[0].mockExams", isA(List.class)))
        .andExpect(jsonPath("$.data.[0].handouts", isA(List.class)))
        .andExpect(jsonPath("$.data.[1].id").value(mockMainQuestionId02.toString()))
        .andExpect(jsonPath("$.data.[1].title").value("título questão 02"))
        .andExpect(jsonPath("$.data.[1].level").value("difícil"))
        .andExpect(jsonPath("$.data.[1].subjects", isA(List.class)))
        .andExpect(jsonPath("$.data.[1].images", isA(List.class)))
        .andExpect(jsonPath("$.data.[1].images.[0]").value("imagem da questão 02"))
        .andExpect(jsonPath("$.data.[1].alternatives", isA(List.class)))
        .andExpect(jsonPath("$.data.[1].alternatives.[*].id").exists())
        .andExpect(jsonPath("$.data.[1].alternatives.[0].description").value("descrição da alternativa 01"))
        .andExpect(jsonPath("$.data.[1].alternatives.[0].images", isA(List.class)))
        .andExpect(jsonPath("$.data.[1].alternatives.[0].images.[0]").value("imagem alternativa 01"))
        .andExpect(jsonPath("$.data.[1].alternatives.[1].description").value("descrição da alternativa 02"))
        .andExpect(jsonPath("$.data.[1].alternatives.[1].images", isA(List.class)))
        .andExpect(jsonPath("$.data.[1].alternatives.[1].images.[0]").value("imagem alternativa 02"))
        .andExpect(jsonPath("$.data.[1].adaptedQuestions", isA(List.class)))
        .andExpect(jsonPath("$.data.[1].mockExams", isA(List.class)))
        .andExpect(jsonPath("$.data.[1].handouts", isA(List.class)));

    ArgumentCaptor<Integer> pageNumberCaptor = ArgumentCaptor.forClass(Integer.class);
    ArgumentCaptor<Integer> pageSizeCaptor = ArgumentCaptor.forClass(Integer.class);
    Mockito
        .verify(mainQuestionService, Mockito.times(1))
        .findAllMainQuestions(pageNumberCaptor.capture(), pageSizeCaptor.capture());

    assertEquals(pageNumber, pageNumberCaptor.getValue());
    assertEquals(pageSize, pageSizeCaptor.getValue());
  }

  @Test
  @DisplayName("Verifica se é retornado uma lista paginada das entidades MainQuestion com query parameters")
  public void findAllMainQuestionsQueryParametersTest() throws Exception {
    int pageNumber = 0;
    int pageSize = 2;
    long totalItems = 2;

    Page<MainQuestion> page = Mockito.mock(Page.class);

    Mockito
        .when(page.getNumberOfElements())
        .thenReturn(pageSize);
    Mockito
        .when(page.getTotalElements())
        .thenReturn(totalItems);
    Mockito
        .when(page.getTotalPages())
        .thenReturn(1);
    Mockito
        .when(page.getContent())
        .thenReturn(List.of(mockMainQuestion01, mockMainQuestion02));

    Mockito
        .when(mainQuestionService.findAllMainQuestions(anyInt(), anyInt()))
        .thenReturn(page);

    String endpoint = baseUrl + "?pageNumber=" + pageNumber + "&pageSize=" + pageSize;
    ResultActions httpResponse = mockMvc.perform(get(endpoint));

    httpResponse
        .andExpect(status().is(200))
        .andExpect(jsonPath("$.pageItems").value(pageSize))
        .andExpect(jsonPath("$.totalItems").value(totalItems))
        .andExpect(jsonPath("$.pages").value(1))
        .andExpect(jsonPath("$.data", isA(List.class)))
        .andExpect(jsonPath("$.data.[0].id").value(mockMainQuestionId01.toString()))
        .andExpect(jsonPath("$.data.[0].title").value("título questão 01"))
        .andExpect(jsonPath("$.data.[0].level").value("difícil"))
        .andExpect(jsonPath("$.data.[0].subjects", isA(List.class)))
        .andExpect(jsonPath("$.data.[0].images", isA(List.class)))
        .andExpect(jsonPath("$.data.[0].images.[0]").value("imagem da questão 01"))
        .andExpect(jsonPath("$.data.[0].alternatives", isA(List.class)))
        .andExpect(jsonPath("$.data.[0].alternatives.[*].id").exists())
        .andExpect(jsonPath("$.data.[0].alternatives.[0].description").value("descrição da alternativa 01"))
        .andExpect(jsonPath("$.data.[0].alternatives.[0].images", isA(List.class)))
        .andExpect(jsonPath("$.data.[0].alternatives.[0].images.[0]").value("imagem alternativa 01"))
        .andExpect(jsonPath("$.data.[0].alternatives.[1].description").value("descrição da alternativa 02"))
        .andExpect(jsonPath("$.data.[0].alternatives.[1].images", isA(List.class)))
        .andExpect(jsonPath("$.data.[0].alternatives.[1].images.[0]").value("imagem alternativa 02"))
        .andExpect(jsonPath("$.data.[0].adaptedQuestions", isA(List.class)))
        .andExpect(jsonPath("$.data.[0].mockExams", isA(List.class)))
        .andExpect(jsonPath("$.data.[0].handouts", isA(List.class)))
        .andExpect(jsonPath("$.data.[1].id").value(mockMainQuestionId02.toString()))
        .andExpect(jsonPath("$.data.[1].title").value("título questão 02"))
        .andExpect(jsonPath("$.data.[1].level").value("difícil"))
        .andExpect(jsonPath("$.data.[1].subjects", isA(List.class)))
        .andExpect(jsonPath("$.data.[1].images", isA(List.class)))
        .andExpect(jsonPath("$.data.[1].images.[0]").value("imagem da questão 02"))
        .andExpect(jsonPath("$.data.[1].alternatives", isA(List.class)))
        .andExpect(jsonPath("$.data.[1].alternatives.[*].id").exists())
        .andExpect(jsonPath("$.data.[1].alternatives.[0].description").value("descrição da alternativa 01"))
        .andExpect(jsonPath("$.data.[1].alternatives.[0].images", isA(List.class)))
        .andExpect(jsonPath("$.data.[1].alternatives.[0].images.[0]").value("imagem alternativa 01"))
        .andExpect(jsonPath("$.data.[1].alternatives.[1].description").value("descrição da alternativa 02"))
        .andExpect(jsonPath("$.data.[1].alternatives.[1].images", isA(List.class)))
        .andExpect(jsonPath("$.data.[1].alternatives.[1].images.[0]").value("imagem alternativa 02"))
        .andExpect(jsonPath("$.data.[1].adaptedQuestions", isA(List.class)))
        .andExpect(jsonPath("$.data.[1].mockExams", isA(List.class)))
        .andExpect(jsonPath("$.data.[1].handouts", isA(List.class)));

    ArgumentCaptor<Integer> pageNumberCaptor = ArgumentCaptor.forClass(Integer.class);
    ArgumentCaptor<Integer> pageSizeCaptor = ArgumentCaptor.forClass(Integer.class);
    Mockito
        .verify(mainQuestionService, Mockito.times(1))
        .findAllMainQuestions(pageNumberCaptor.capture(), pageSizeCaptor.capture());

    assertEquals(pageNumber, pageNumberCaptor.getValue());
    assertEquals(pageSize, pageSizeCaptor.getValue());
  }

  @Test
  @DisplayName("Verifica se é retornado uma entidade MainQuestion pelo seu id")
  public void findMainQuestionByIdTest() throws Exception {
    Mockito
        .when(mainQuestionService.findMainQuestionById(mockMainQuestionId01))
        .thenReturn(mockMainQuestion01);

    String endpoint = baseUrl + "/" + mockMainQuestionId01.toString();

    ResultActions httpResponse = mockMvc.perform(get(endpoint));

    httpResponse
        .andExpect(status().is(200))
        .andExpect(jsonPath("$.id").value(mockMainQuestionId01.toString()))
        .andExpect(jsonPath("$.title").value("título questão 01"))
        .andExpect(jsonPath("$.level").value("difícil"))
        .andExpect(jsonPath("$.subjects", isA(List.class)))
        .andExpect(jsonPath("$.images", isA(List.class)))
        .andExpect(jsonPath("$.images.[0]").value("imagem da questão 01"))
        .andExpect(jsonPath("$.alternatives", isA(List.class)))
        .andExpect(jsonPath("$.alternatives.[*].id").exists())
        .andExpect(jsonPath("$.alternatives.[0].description").value("descrição da alternativa 01"))
        .andExpect(jsonPath("$.alternatives.[0].images", isA(List.class)))
        .andExpect(jsonPath("$.alternatives.[0].images.[0]").value("imagem alternativa 01"))
        .andExpect(jsonPath("$.alternatives.[1].description").value("descrição da alternativa 02"))
        .andExpect(jsonPath("$.alternatives.[1].images", isA(List.class)))
        .andExpect(jsonPath("$.alternatives.[1].images.[0]").value("imagem alternativa 02"))
        .andExpect(jsonPath("$.adaptedQuestions", isA(List.class)))
        .andExpect(jsonPath("$.mockExams", isA(List.class)))
        .andExpect(jsonPath("$.handouts", isA(List.class)));

    Mockito.verify(mainQuestionService).findMainQuestionById(any(UUID.class));
  }

  @Test
  @DisplayName("Verifica se é disparado uma exceção quando não se encontra uma entidade MainQuestion por seu id")
  public void findMainQuestionByIdTestNotFoundError() throws Exception {
    Mockito
        .when(mainQuestionService.findMainQuestionById(any(UUID.class)))
        .thenThrow(new NotFoundException("Questão principal não encontrada!"));

    String endpoint = baseUrl + "/" + mockMainQuestionId01.toString();

    ResultActions httpResponse = mockMvc.perform(get(endpoint));

    httpResponse
        .andExpect(status().is(404))
        .andExpect(jsonPath("$").value("Questão principal não encontrada!"));

    Mockito.verify(mainQuestionService).findMainQuestionById(any(UUID.class));
  }

  @Test
  @DisplayName("Verifica se criado uma entidade MainQuestion")
  public void createMainQuestionTest() throws Exception {
    Mockito
        .when(mainQuestionService.createMainQuestion(
            any(MainQuestion.class),
            any(List.class)
        )).thenReturn(mockMainQuestion01);

    Mockito
        .when(imageService.uploadImages(any()))
        .thenReturn(List.of("imagem da questão 01", "imagem alternativa 01", "imagem alternativa 02"));

    MockMultipartFile inputJsonPart = createInputJsonPart("mainQuestionInputDto");

    ResultActions httpResponse = mockMvc.perform(
        multipart(HttpMethod.POST, baseUrl)
          .file(multipartFiles.get(0))
          .file(multipartFiles.get(1))
          .file(multipartFiles.get(2))
          .file(inputJsonPart)
          .contentType(MediaType.MULTIPART_FORM_DATA)
    );

    httpResponse
        .andExpect(status().is(201))
        .andExpect(jsonPath("$.id").value(mockMainQuestionId01.toString()))
        .andExpect(jsonPath("$.title").value("título questão 01"))
        .andExpect(jsonPath("$.level").value("difícil"))
        .andExpect(jsonPath("$.subjects", isA(List.class)))
        .andExpect(jsonPath("$.images", isA(List.class)))
        .andExpect(jsonPath("$.images.[0]").value("imagem da questão 01"))
        .andExpect(jsonPath("$.alternatives", isA(List.class)))
        .andExpect(jsonPath("$.alternatives.[*].id").exists())
        .andExpect(jsonPath("$.alternatives.[0].description").value("descrição da alternativa 01"))
        .andExpect(jsonPath("$.alternatives.[0].images", isA(List.class)))
        .andExpect(jsonPath("$.alternatives.[0].images.[0]").value("imagem alternativa 01"))
        .andExpect(jsonPath("$.alternatives.[1].description").value("descrição da alternativa 02"))
        .andExpect(jsonPath("$.alternatives.[1].images", isA(List.class)))
        .andExpect(jsonPath("$.alternatives.[1].images.[0]").value("imagem alternativa 02"))
        .andExpect(jsonPath("$.adaptedQuestions", isA(List.class)))
        .andExpect(jsonPath("$.mockExams", isA(List.class)))
        .andExpect(jsonPath("$.handouts", isA(List.class)));

    Mockito.verify(mainQuestionService).createMainQuestion(any(MainQuestion.class), any(List.class));
  }

  @Test
  @DisplayName("Verifica se é atualizada uma entidade MainQuestion pelo seu id")
  public void updateMainQuestionByIdTest() throws Exception {
    Mockito
        .when(mainQuestionService.updateMainQuestionById(
            any(UUID.class),
            any(MainQuestion.class),
            any(List.class)
        )).thenReturn(mockMainQuestion01);

    Mockito
        .when(imageService.uploadImages(any()))
        .thenReturn(List.of("imagem da questão 01", "imagem da alternativa 01", "imagem da alternativa 02"));

    MockMultipartFile inputJsonPart = createInputJsonPart("mainQuestionInputDto");

    String endpoint = baseUrl + "/" + mockMainQuestionId01.toString();

    ResultActions httpResponse = mockMvc.perform(
        multipart(HttpMethod.PUT, endpoint)
            .file(multipartFiles.get(0))
            .file(multipartFiles.get(1))
            .file(multipartFiles.get(2))
            .file(inputJsonPart)
            .contentType(MediaType.MULTIPART_FORM_DATA)

    );

    httpResponse
        .andExpect(status().is(200))
        .andExpect(jsonPath("$.id").value(mockMainQuestionId01.toString()))
        .andExpect(jsonPath("$.title").value("título questão 01"))
        .andExpect(jsonPath("$.level").value("difícil"))
        .andExpect(jsonPath("$.subjects", isA(List.class)))
        .andExpect(jsonPath("$.images", isA(List.class)))
        .andExpect(jsonPath("$.images.[0]").value("imagem da questão 01"))
        .andExpect(jsonPath("$.alternatives", isA(List.class)))
        .andExpect(jsonPath("$.alternatives.[*].id").exists())
        .andExpect(jsonPath("$.alternatives.[0].description").value("descrição da alternativa 01"))
        .andExpect(jsonPath("$.alternatives.[0].images", isA(List.class)))
        .andExpect(jsonPath("$.alternatives.[0].images.[0]").value("imagem alternativa 01"))
        .andExpect(jsonPath("$.alternatives.[1].description").value("descrição da alternativa 02"))
        .andExpect(jsonPath("$.alternatives.[1].images", isA(List.class)))
        .andExpect(jsonPath("$.alternatives.[1].images.[0]").value("imagem alternativa 02"))
        .andExpect(jsonPath("$.adaptedQuestions", isA(List.class)))
        .andExpect(jsonPath("$.mockExams", isA(List.class)))
        .andExpect(jsonPath("$.handouts", isA(List.class)));

    Mockito.verify(mainQuestionService)
        .updateMainQuestionById(any(UUID.class), any(MainQuestion.class), any(List.class));
  }

  @Test
  @DisplayName("Verifica se é disparado uma exceção quando uma entidade MainQuestion não é encontrada pelo seu id")
  public void updateMainQuestionByIdTestNotFounfError() throws Exception {
    Mockito
        .when(imageService.uploadImages(any()))
        .thenReturn(List.of("imagem da questão 01", "imagem da alternativa 01", "imagem da alternativa 02"));

    Mockito
        .when(mainQuestionService.updateMainQuestionById(
            any(UUID.class),
            any(MainQuestion.class),
            any(List.class)
        )).thenThrow(new NotFoundException("Questão principal não encontrada!"));

    MockMultipartFile inputJsonPart = createInputJsonPart("mainQuestionInputDto");

    String endpoint = baseUrl + "/" + mockMainQuestionId01.toString();

    ResultActions httpResponse = mockMvc.perform(
        multipart(HttpMethod.PUT, endpoint)
            .file(multipartFiles.get(0))
            .file(multipartFiles.get(1))
            .file(multipartFiles.get(2))
            .file(inputJsonPart)
            .contentType(MediaType.MULTIPART_FORM_DATA)

    );

    httpResponse
        .andExpect(status().is(404))
        .andExpect(jsonPath("$").value("Questão principal não encontrada!"));

    Mockito.verify(mainQuestionService)
        .updateMainQuestionById(any(UUID.class), any(MainQuestion.class), any(List.class));
  }

  @Test
  @DisplayName("Verifica se uma entidade MainQuestion é deletada pelo seu id")
  public void deleteMainQuestionByIdTest() throws Exception {
    Mockito
        .when(imageService.uploadImages(any()))
        .thenReturn(List.of("imagem da questão 01", "imagem da alternativa 01", "imagem da alternativa 02"));

    Mockito
        .doNothing().when(mainQuestionService).deleteMainQuestionById(any(UUID.class));

    String endpoint = baseUrl + "/" + mockMainQuestionId01.toString();

    ResultActions httpResponse = mockMvc.perform(delete(endpoint));

    httpResponse
        .andExpect(status().is(204));

    Mockito.verify(mainQuestionService).deleteMainQuestionById(any(UUID.class));
  }

  @Test
  @DisplayName("Verifica se uma exceção é disparada quando não se encontra uma entidade MainQuestion pelo seu id")
  public void deleteMainQuestionByIdTestNotFoundError() throws Exception {
    Mockito
        .when(imageService.uploadImages(any()))
        .thenReturn(List.of("imagem da questão 01", "imagem da alternativa 01", "imagem da alternativa 02"));

    Mockito
        .doThrow(new NotFoundException("Questão principal não encontrada!"))
        .when(mainQuestionService).deleteMainQuestionById(any(UUID.class));

    String endpoint = baseUrl + "/" + mockMainQuestionId01.toString();

    ResultActions httpResponse = mockMvc.perform(delete(endpoint));

    httpResponse
        .andExpect(status().is(404))
        .andExpect(jsonPath("$").value("Questão principal não encontrada!"));

    Mockito.verify(mainQuestionService).deleteMainQuestionById(any(UUID.class));
  }

  @Test
  @DisplayName("Verifica se é retornado uma lista de AdaptedQuestions de uma MainQuestion pelo seu Id")
  public void findAllAdaptedQuestionsFromMainQuestionTest() throws Exception {
    Mockito
        .when(adaptedQuestionService.findAllAdaptedQuestionFromMainQuestion(any(UUID.class)))
        .thenReturn(List.of(mockAdaptedQuestion01, mockAdaptedQuestion02));

    String endpoint = baseUrl
        + "/"
        + mockMainQuestionId01.toString()
        + "/adapted-question";

    ResultActions httpResponse = mockMvc.perform(get(endpoint));

    httpResponse
        .andExpect(status().is(200))
        .andExpect(jsonPath("$", isA(List.class)))
        .andExpect(jsonPath("$.[0].id").value(mockAdaptedQuestionId01.toString()))
        .andExpect(jsonPath("$.[0].images", isA(List.class)))
        .andExpect(jsonPath("$.[0].images.[0]").value("imagem da questão adaptada 01"))
        .andExpect(jsonPath("$.[0].alternatives", isA(List.class)))
        .andExpect(jsonPath("$.[0].alternatives.[*].id").exists())
        .andExpect(jsonPath("$.[0].alternatives.[0].description").value("descrição da alternativa 01"))
        .andExpect(jsonPath("$.[0].alternatives.[0].images", isA(List.class)))
        .andExpect(jsonPath("$.[0].alternatives.[0].images.[0]").value("imagem alternativa 01"))
        .andExpect(jsonPath("$.[0].alternatives.[1].description").value("descrição da alternativa 02"))
        .andExpect(jsonPath("$.[0].alternatives.[1].images", isA(List.class)))
        .andExpect(jsonPath("$.[0].alternatives.[1].images.[0]").value("imagem alternativa 02"))
        .andExpect(jsonPath("$.[1].id").value(mockAdaptedQuestionId02.toString()))
        .andExpect(jsonPath("$.[1].images", isA(List.class)))
        .andExpect(jsonPath("$.[1].images.[0]").value("imagem da questão 02"))
        .andExpect(jsonPath("$.[1].alternatives", isA(List.class)))
        .andExpect(jsonPath("$.[1].alternatives.[*].id").exists())
        .andExpect(jsonPath("$.[1].alternatives.[0].description").value("descrição da alternativa 01"))
        .andExpect(jsonPath("$.[1].alternatives.[0].images", isA(List.class)))
        .andExpect(jsonPath("$.[1].alternatives.[0].images.[0]").value("imagem alternativa 01"))
        .andExpect(jsonPath("$.[1].alternatives.[1].description").value("descrição da alternativa 02"))
        .andExpect(jsonPath("$.[1].alternatives.[1].images", isA(List.class)))
        .andExpect(jsonPath("$.[1].alternatives.[1].images.[0]").value("imagem alternativa 02"));

    Mockito.verify(adaptedQuestionService).findAllAdaptedQuestionFromMainQuestion(any(UUID.class));
  }

  @Test
  @DisplayName("Verifica se é retornado uma entidade AdaptedQuestions de uma MainQuestion pelos seus Ids")
  public void findAdaptedQuestionsFromMainQuestionByIdTest() throws Exception {
    Mockito
        .when(adaptedQuestionService
            .findAdaptedQuestionsFromMainQuestionById(any(UUID.class), any(UUID.class)))
        .thenReturn(mockAdaptedQuestion01);

    String endpoint = baseUrl
        + "/"
        + mockMainQuestionId01.toString()
        + "/adapted-question/"
        + mockAdaptedQuestionId01.toString();

    ResultActions httpResponse = mockMvc.perform(get(endpoint));

    httpResponse
        .andExpect(status().is(200))
        .andExpect(jsonPath("$.id").value(mockAdaptedQuestionId01.toString()))
        .andExpect(jsonPath("$.images", isA(List.class)))
        .andExpect(jsonPath("$.images.[0]").value("imagem da questão adaptada 01"))
        .andExpect(jsonPath("$.alternatives", isA(List.class)))
        .andExpect(jsonPath("$.alternatives.[*].id").exists())
        .andExpect(jsonPath("$.alternatives.[0].description").value("descrição da alternativa 01"))
        .andExpect(jsonPath("$.alternatives.[0].images", isA(List.class)))
        .andExpect(jsonPath("$.alternatives.[0].images.[0]").value("imagem alternativa 01"))
        .andExpect(jsonPath("$.alternatives.[1].description").value("descrição da alternativa 02"))
        .andExpect(jsonPath("$.alternatives.[1].images", isA(List.class)))
        .andExpect(jsonPath("$.alternatives.[1].images.[0]").value("imagem alternativa 02"));

    Mockito.verify(adaptedQuestionService)
        .findAdaptedQuestionsFromMainQuestionById(any(UUID.class), any(UUID.class));
  }

  @Test
  @DisplayName("Verifica se é criado e relacionado uma entidade AdaptedQuestions em uma MainQuestion")
  public void createAdaptedQuestionForMainQuestionTest() throws Exception {
    Mockito
        .when(imageService.uploadImages(any()))
        .thenReturn(List.of(
            "imagem da questão adaptada 01",
            "imagem alternativa 01",
            "imagem alternativa 02"
        ));

    Mockito
        .when(mainQuestionService
            .addAdaptedQuestion(any(UUID.class), any(AdaptedQuestion.class), any(List.class)))
        .thenReturn(mockMainQuestion01);

    String endpoint = baseUrl
        + "/"
        + mockMainQuestionId01.toString()
        + "/adapted-question";

    MockMultipartFile inputJsonPart = createInputJsonPart("adaptedQuestionInputDto");

    ResultActions httpResponse = mockMvc.perform(
        multipart(HttpMethod.POST, endpoint)
            .file(multipartFiles.get(0))
            .file(multipartFiles.get(1))
            .file(multipartFiles.get(2))
            .file(inputJsonPart)
            .contentType(MediaType.MULTIPART_FORM_DATA)
    );

    httpResponse
        .andExpect(status().is(201))
        .andExpect(jsonPath("$.id").value(mockMainQuestionId01.toString()))
        .andExpect(jsonPath("$.images", isA(List.class)))
        .andExpect(jsonPath("$.images.[0]").value(mockMainQuestion01.getImages().get(0)))
        .andExpect(jsonPath("$.alternatives", isA(List.class)))
        .andExpect(jsonPath("$.alternatives.[*].id").exists())
        .andExpect(jsonPath("$.alternatives.[0].description").value(mockAlternative01.getDescription()))
        .andExpect(jsonPath("$.alternatives.[0].images", isA(List.class)))
        .andExpect(jsonPath("$.alternatives.[0].images.[0]").value(mockAlternative01.getImages().get(0)))
        .andExpect(jsonPath("$.alternatives.[1].description").value(mockAlternative02.getDescription()))
        .andExpect(jsonPath("$.alternatives.[1].images", isA(List.class)))
        .andExpect(jsonPath("$.alternatives.[1].images.[0]").value(mockAlternative02.getImages().get(0)))
        .andExpect(jsonPath("$.adaptedQuestions", isA(List.class)))
        .andExpect(jsonPath("$.adaptedQuestions.[*].id").exists())
        .andExpect(jsonPath("$.adaptedQuestions.[0].title").value(mockAdaptedQuestion01.getTitle()))
        .andExpect(jsonPath("$.adaptedQuestions.[0].level").value(mockAdaptedQuestion01.getLevel()))
        .andExpect(jsonPath("$.adaptedQuestions.[0].images", isA(List.class)))
        .andExpect(jsonPath("$.adaptedQuestions.[0].images.[0]").value(mockAdaptedQuestion01.getImages().get(0)))
        .andExpect(jsonPath("$.adaptedQuestions.[0].alternatives", isA(List.class)))
        .andExpect(jsonPath("$.adaptedQuestions.[0].alternatives.[*].id").exists())
        .andExpect(jsonPath("$.adaptedQuestions.[0].alternatives.[0].description").value(mockAlternative01.getDescription()))
        .andExpect(jsonPath("$.adaptedQuestions.[0].alternatives.[0].images", isA(List.class)))
        .andExpect(jsonPath("$.adaptedQuestions.[0].alternatives.[0].images.[0]").value(mockAlternative01.getImages().get(0)))
        .andExpect(jsonPath("$.adaptedQuestions.[0].alternatives.[1].description").value(mockAlternative02.getDescription()))
        .andExpect(jsonPath("$.adaptedQuestions.[0].alternatives.[1].images", isA(List.class)))
        .andExpect(jsonPath("$.adaptedQuestions.[0].alternatives.[1].images.[0]").value(mockAlternative02.getImages().get(0)));

    Mockito.verify(mainQuestionService)
        .addAdaptedQuestion(any(UUID.class), any(AdaptedQuestion.class), any(List.class));
  }

  @Test
  @DisplayName("Verifica se é criado e relacionado uma entidade AdaptedQuestions em uma MainQuestion")
  public void createAdaptedQuestionForMainQuestionTestNotFoundMainQuestionError() throws Exception {
    Mockito
        .when(imageService.uploadImages(any()))
        .thenReturn(List.of(
            "imagem da questão adaptada 01",
            "imagem alternativa 01",
            "imagem alternativa 02"
        ));

    Mockito
        .when(mainQuestionService
            .addAdaptedQuestion(any(UUID.class), any(AdaptedQuestion.class), any(List.class)))
        .thenThrow(new NotFoundException("Questão principal não encontrada!"));

    String endpoint = baseUrl
        + "/"
        + mockMainQuestionId01.toString()
        + "/adapted-question";

    MockMultipartFile inputJsonPart = createInputJsonPart("adaptedQuestionInputDto");

    ResultActions httpResponse = mockMvc.perform(
        multipart(HttpMethod.POST, endpoint)
            .file(multipartFiles.get(0))
            .file(multipartFiles.get(1))
            .file(multipartFiles.get(2))
            .file(inputJsonPart)
            .contentType(MediaType.MULTIPART_FORM_DATA)
    );

    httpResponse
        .andExpect(status().is(404))
        .andExpect(jsonPath("$").value("Questão principal não encontrada!"));

    Mockito.verify(mainQuestionService)
        .addAdaptedQuestion(any(UUID.class), any(AdaptedQuestion.class), any(List.class));
  }

  @Test
  @DisplayName("Verifica se a entidade AdaptedQuestions em uma MainQuestion é atualizada")
  public void updateAdaptedQuestionOfMainQuestionByIdTest() throws Exception {
    Mockito
        .when(imageService.uploadImages(any()))
        .thenReturn(List.of(
            "imagem da questão adaptada 01",
            "imagem alternativa 01",
            "imagem alternativa 02"
        ));

    Mockito
        .when(adaptedQuestionService
            .updateAdaptedQuestionOfMainQuestionById(
                any(UUID.class),
                any(UUID.class),
                any(AdaptedQuestion.class),
                any(List.class)
            )).thenReturn(mockAdaptedQuestion01);

    String endpoint = baseUrl
        + "/"
        + mockMainQuestionId01.toString()
        + "/adapted-question/"
        + mockAdaptedQuestionId01.toString();

    MockMultipartFile inputJsonPart = createInputJsonPart("adaptedQuestionInputDto");

    ResultActions httpResponse = mockMvc.perform(
        multipart(HttpMethod.PUT, endpoint)
            .file(multipartFiles.get(0))
            .file(multipartFiles.get(1))
            .file(multipartFiles.get(2))
            .file(inputJsonPart)
            .contentType(MediaType.MULTIPART_FORM_DATA)
    );

    httpResponse
        .andExpect(status().is(200))
        .andExpect(jsonPath("$.id").value(mockAdaptedQuestionId01.toString()))
        .andExpect(jsonPath("$.title").value(mockAdaptedQuestion01.getTitle()))
        .andExpect(jsonPath("$.level").value(mockAdaptedQuestion01.getLevel()))
        .andExpect(jsonPath("$.images", isA(List.class)))
        .andExpect(jsonPath("$.images.[0]").value(mockAdaptedQuestion01.getImages().get(0)))
        .andExpect(jsonPath("$.alternatives", isA(List.class)))
        .andExpect(jsonPath("$.alternatives.[*].id").exists())
        .andExpect(jsonPath("$.alternatives.[0].description").value(mockAlternative01.getDescription()))
        .andExpect(jsonPath("$.alternatives.[0].images", isA(List.class)))
        .andExpect(jsonPath("$.alternatives.[0].images.[0]").value(mockAlternative01.getImages().get(0)))
        .andExpect(jsonPath("$.alternatives.[1].description").value(mockAlternative02.getDescription()))
        .andExpect(jsonPath("$.alternatives.[1].images", isA(List.class)))
        .andExpect(jsonPath("$.alternatives.[1].images.[0]").value(mockAlternative02.getImages().get(0)));

    Mockito.verify(adaptedQuestionService)
        .updateAdaptedQuestionOfMainQuestionById(
            any(UUID.class),
            any(UUID.class),
            any(AdaptedQuestion.class),
            any(List.class)
        );
  }

  @Test
  @DisplayName("Verifica se é disparado uma exceção quando uma entidade AdaptedQuestion não é encontrada")
  public void updateAdaptedQuestionOfMainQuestionByIdTestNotFoundError() throws Exception {
    Mockito
        .when(imageService.uploadImages(any()))
        .thenReturn(List.of(
            "imagem da questão adaptada 01",
            "imagem alternativa 01",
            "imagem alternativa 02"
        ));

    Mockito
        .when(adaptedQuestionService
            .updateAdaptedQuestionOfMainQuestionById(
                any(UUID.class),
                any(UUID.class),
                any(AdaptedQuestion.class),
                any(List.class)
            )).thenThrow(new NotFoundException("Questão adaptada não encontrada!"));

    String endpoint = baseUrl
        + "/"
        + mockMainQuestionId01.toString()
        + "/adapted-question/"
        + mockAdaptedQuestionId01.toString();

    MockMultipartFile inputJsonPart = createInputJsonPart("adaptedQuestionInputDto");

    ResultActions httpResponse = mockMvc.perform(
        multipart(HttpMethod.PUT, endpoint)
            .file(multipartFiles.get(0))
            .file(multipartFiles.get(1))
            .file(multipartFiles.get(2))
            .file(inputJsonPart)
            .contentType(MediaType.MULTIPART_FORM_DATA)
    );

    httpResponse
        .andExpect(status().is(404))
        .andExpect(jsonPath("$").value("Questão adaptada não encontrada!"));

    Mockito.verify(adaptedQuestionService)
        .updateAdaptedQuestionOfMainQuestionById(
            any(UUID.class),
            any(UUID.class),
            any(AdaptedQuestion.class),
            any(List.class)
        );
  }

  @Test
  @DisplayName("Verifica se é disparado uma exceção quando uma entidade AdaptedQuestion não está relacionada com a MainQuestion fornecida")
  public void updateAdaptedQuestionOfMainQuestionByIdTestConflictDataError() throws Exception {
    Mockito
        .when(imageService.uploadImages(any()))
        .thenReturn(List.of(
            "imagem da questão adaptada 01",
            "imagem alternativa 01",
            "imagem alternativa 02"
        ));

    Mockito
        .when(adaptedQuestionService
            .updateAdaptedQuestionOfMainQuestionById(
                any(UUID.class),
                any(UUID.class),
                any(AdaptedQuestion.class),
                any(List.class)
            )).thenThrow(new ConflictDataException("Questões principal e adaptada não relacionadas"));

    String endpoint = baseUrl
        + "/"
        + mockMainQuestionId01.toString()
        + "/adapted-question/"
        + mockAdaptedQuestionId01.toString();

    MockMultipartFile inputJsonPart = createInputJsonPart("adaptedQuestionInputDto");

    ResultActions httpResponse = mockMvc.perform(
        multipart(HttpMethod.PUT, endpoint)
            .file(multipartFiles.get(0))
            .file(multipartFiles.get(1))
            .file(multipartFiles.get(2))
            .file(inputJsonPart)
            .contentType(MediaType.MULTIPART_FORM_DATA)
    );

    httpResponse
        .andExpect(status().is(409))
        .andExpect(jsonPath("$").value("Questões principal e adaptada não relacionadas"));

    Mockito.verify(adaptedQuestionService)
        .updateAdaptedQuestionOfMainQuestionById(
            any(UUID.class),
            any(UUID.class),
            any(AdaptedQuestion.class),
            any(List.class)
        );
  }

  @Test
  @DisplayName("Verifica se a entidade AdaptedQuestions é removida de uma MainQuestion")
  public void deleteAdaptedQuestionFromMainQuestionByIdTest() throws Exception {
    Mockito
        .doNothing().when(mainQuestionService).removeAdaptedQuestion(any(UUID.class), any(UUID.class));

    String endpoint = baseUrl
        + "/"
        + mockMainQuestionId01.toString()
        + "/adapted-question/"
        + mockAdaptedQuestionId01.toString();

    ResultActions httpResponse = mockMvc.perform(delete(endpoint));

    httpResponse
        .andExpect(status().is(204));

    Mockito.verify(mainQuestionService).removeAdaptedQuestion(any(UUID.class), any(UUID.class));
  }

  @Test
  @DisplayName("Verifica se é disparado uma exceção quando uma entidade MainQuestion não é encontrada")
  public void deleteAdaptedQuestionFromMainQuestionByIdTestNotFoundMainQuestionError() throws Exception {
    Mockito
        .doThrow(new NotFoundException("Questão principal não encontrada!"))
        .when(mainQuestionService).removeAdaptedQuestion(any(UUID.class), any(UUID.class));

    String endpoint = baseUrl
        + "/"
        + UUID.randomUUID()
        + "/adapted-question/"
        + mockAdaptedQuestionId01.toString();

    ResultActions httpResponse = mockMvc.perform(delete(endpoint));

    httpResponse
        .andExpect(status().is(404))
            .andExpect(jsonPath("$").value("Questão principal não encontrada!"));

    Mockito.verify(mainQuestionService).removeAdaptedQuestion(any(UUID.class), any(UUID.class));
  }

  @Test
  @DisplayName("Verifica se é disparado uma exceção quando uma entidade AdaptedQuestion não é encontrada")
  public void deleteAdaptedQuestionFromMainQuestionByIdTestNotFoundAdaptedQuestionError() throws Exception {
    Mockito
        .doThrow(new NotFoundException("Questão adaptada não encontrada!"))
        .when(mainQuestionService).removeAdaptedQuestion(any(UUID.class), any(UUID.class));

    String endpoint = baseUrl
        + "/"
        + UUID.randomUUID()
        + "/adapted-question/"
        + mockAdaptedQuestionId01.toString();

    ResultActions httpResponse = mockMvc.perform(delete(endpoint));

    httpResponse
        .andExpect(status().is(404))
        .andExpect(jsonPath("$").value("Questão adaptada não encontrada!"));

    Mockito.verify(mainQuestionService).removeAdaptedQuestion(any(UUID.class), any(UUID.class));
  }

  @Test
  @DisplayName("Verifica se é disparado uma exceção quando uma entidade AdaptedQuestion não é encontrada")
  public void deleteAdaptedQuestionFromMainQuestionByIdTestConflictDataError() throws Exception {
    Mockito
        .doThrow(new ConflictDataException("Questão adaptada não pertence à questão principal!"))
        .when(mainQuestionService).removeAdaptedQuestion(any(UUID.class), any(UUID.class));

    String endpoint = baseUrl
        + "/"
        + UUID.randomUUID()
        + "/adapted-question/"
        + mockAdaptedQuestionId01.toString();

    ResultActions httpResponse = mockMvc.perform(delete(endpoint));

    httpResponse
        .andExpect(status().is(409))
        .andExpect(jsonPath("$").value("Questão adaptada não pertence à questão principal!"));

    Mockito.verify(mainQuestionService).removeAdaptedQuestion(any(UUID.class), any(UUID.class));
  }

  @Test
  @DisplayName("Verifica se a entidade Subject é adicionada a uma MainQuestion")
  public void addSubjectToMainQuestionTest() throws Exception {
    Mockito
        .when(mainQuestionService.addSubject(any(UUID.class), any(List.class)))
        .thenReturn(mockMainQuestion02);

    String endpoint = baseUrl
        + "/"
        + mockMainQuestionId02.toString()
        + "/subject";

    ResultActions httpResponse = mockMvc.perform(
        patch(endpoint)
            .contentType(MediaType.APPLICATION_JSON)
            .content(new ObjectMapper().writeValueAsString(subjectIdListinput))
    );

    httpResponse
        .andExpect(status().is(200))
        .andExpect(jsonPath("$.id").value(mockMainQuestionId02.toString()))
        .andExpect(jsonPath("$.subjects", isA(List.class)))
        .andExpect(jsonPath("$.subjects.[*].id").exists())
        .andExpect(jsonPath("$.subjects.[0].name").value(mockSubject01.getName()))
        .andExpect(jsonPath("$.subjects.[1].name").value(mockSubject02.getName()));

    Mockito.verify(mainQuestionService).addSubject(any(UUID.class), any(List.class));
  }

  @Test
  @DisplayName("Verifica se é disparado um erro quando a entidade MainQuestion não é encontrada")
  public void addSubjectToMainQuestionTestNotFoundMainQuestionError() throws Exception {
    Mockito
        .when(mainQuestionService.addSubject(any(UUID.class), any(List.class)))
        .thenThrow(new NotFoundException("Questão principal não encontrada!"));

    String endpoint = baseUrl
        + "/"
        + mockMainQuestionId02.toString()
        + "/subject";

    ResultActions httpResponse = mockMvc.perform(
        patch(endpoint)
            .contentType(MediaType.APPLICATION_JSON)
            .content(new ObjectMapper().writeValueAsString(subjectIdListinput))
    );

    httpResponse
        .andExpect(status().is(404))
        .andExpect(jsonPath("$").value("Questão principal não encontrada!"));

    Mockito.verify(mainQuestionService).addSubject(any(UUID.class), any(List.class));
  }

  @Test
  @DisplayName("Verifica se é disparado um erro quando a lista de SubjectsId não encontra nenhuma entidade")
  public void addSubjectToMainQuestionTestNotFoundSubjectListEntitiesError() throws Exception {
    Mockito
        .when(mainQuestionService.addSubject(any(UUID.class), any(List.class)))
        .thenThrow(new NotFoundException("Nenhum assunto encontrado com os IDs fornecidos!"));

    String endpoint = baseUrl
        + "/"
        + mockMainQuestionId02.toString()
        + "/subject";

    ResultActions httpResponse = mockMvc.perform(
        patch(endpoint)
            .contentType(MediaType.APPLICATION_JSON)
            .content(new ObjectMapper().writeValueAsString(subjectIdListinput))
    );

    httpResponse
        .andExpect(status().is(404))
        .andExpect(jsonPath("$").value("Nenhum assunto encontrado com os IDs fornecidos!"));

    Mockito.verify(mainQuestionService).addSubject(any(UUID.class), any(List.class));
  }

  @Test
  @DisplayName("Verifica se a entidade Subject é removida de uma MainQuestion")
  public void removeSubjectFromMainQUestionTest() throws Exception {
    Mockito
        .doNothing().when(mainQuestionService).removeSubject(any(UUID.class), any(List.class));

    String endpoint = baseUrl
        + "/"
        + mockMainQuestionId02.toString()
        + "/subject";

    ResultActions httpResponse = mockMvc.perform(
        delete(endpoint)
            .contentType(MediaType.APPLICATION_JSON)
            .content(new ObjectMapper().writeValueAsString(subjectIdListinput))
    );

    httpResponse
        .andExpect(status().is(204));

    Mockito.verify(mainQuestionService).removeSubject(any(UUID.class), any(List.class));
  }

  @Test
  @DisplayName("Verifica se é disparado uma exceção quando uma MainQuestion não é encontrada")
  public void removeSubjectFromMainQUestionTestNotFoundError() throws Exception {
    Mockito
        .doThrow(new NotFoundException("Questão principal não encontrada!"))
        .when(mainQuestionService).removeSubject(any(UUID.class), any(List.class));

    String endpoint = baseUrl
        + "/"
        + mockMainQuestionId02.toString()
        + "/subject";

    ResultActions httpResponse = mockMvc.perform(
        delete(endpoint)
            .contentType(MediaType.APPLICATION_JSON)
            .content(new ObjectMapper().writeValueAsString(subjectIdListinput))
    );

    httpResponse
        .andExpect(status().is(404))
        .andExpect(jsonPath("$").value("Questão principal não encontrada!"));

    Mockito.verify(mainQuestionService).removeSubject(any(UUID.class), any(List.class));
  }

  private MockMultipartFile createInputJsonPart(String name) {
    return new MockMultipartFile(
        name,
        "jsonBody.json",
        MediaType.APPLICATION_JSON_VALUE,
        mainQuestionInput.getBytes()
    );
  }
}

