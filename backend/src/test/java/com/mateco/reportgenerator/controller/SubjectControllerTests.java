package com.mateco.reportgenerator.controller;

import static org.h2.index.IndexCondition.get;

import com.mateco.reportgenerator.model.entity.Subject;
import com.mateco.reportgenerator.service.SubjectServiceInterface;
import com.mateco.reportgenerator.service.exception.AlreadyExistsException;
import com.mateco.reportgenerator.service.exception.NotFoundException;
import java.util.List;
import java.util.UUID;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.ResultActions;

import static org.mockito.ArgumentMatchers.anyInt;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
import static org.hamcrest.Matchers.*;
import static org.mockito.ArgumentMatchers.any;

@SpringBootTest
@AutoConfigureMockMvc
public class SubjectControllerTests {
  @Autowired
  MockMvc mockMvc;

  @MockBean
  private SubjectServiceInterface subjectService;

  private String baseUrl;
  private UUID mockSubjectId01;
  private UUID mockSubjectId02;
  private Subject mockSubject01;
  private Subject mockSubject02;

  @BeforeEach
  public void setUp() {
    baseUrl = "/subject";
    mockSubjectId01 = UUID.randomUUID();
    mockSubjectId02 = UUID.randomUUID();

    mockSubject01 = new Subject("Geometria");
    mockSubject01.setId(mockSubjectId01);

    mockSubject02 = new Subject("Algebra");
    mockSubject02.setId(mockSubjectId02);
  }

  @Test
  @DisplayName("Verifica se é retornado uma lista de todas as entidades Subject")
  public void findAllSubjectsTest() throws Exception {
    int pageNumber = 0;
    int pageSize = 2;
    Page<Subject> page = Mockito.mock(Page.class);

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
        .thenReturn(List.of(mockSubject01, mockSubject02));

    Mockito
        .when(subjectService.findAllSubjects(anyInt(), anyInt()))
        .thenReturn(page);

    ResultActions httpResponse = mockMvc.perform(get(baseUrl));

    httpResponse
        .andExpect(status().is(200))
        .andExpect(jsonPath("$.page").value(pageNumber))
        .andExpect(jsonPath("$.itemsNumber").value(pageSize))
        .andExpect(jsonPath("$.pages").value(1))
        .andExpect(jsonPath("$.data", isA(List.class)))
        .andExpect(jsonPath("$.data.[0].id").value(mockSubjectId01.toString()))
        .andExpect(jsonPath("$.data.[0].name").value(mockSubject01.getName()))
        .andExpect(jsonPath("$.data.[1].id").value(mockSubjectId02.toString()))
        .andExpect(jsonPath("$.data.[1].name").value(mockSubject02.getName()));

    Mockito
        .verify(subjectService, Mockito.times(1))
        .findAllSubjects(any(Integer.class), any(Integer.class));
  }

  @Test
  @DisplayName("Verifica se é retornado uma entidade Subject pelo seu id")
  public void findSubjectByIdTest() throws Exception {
    Mockito
        .when(subjectService.findSubjectById(mockSubjectId01))
        .thenReturn(mockSubject01);

    String endpoint = baseUrl + "/" + mockSubjectId01.toString();
    ResultActions httpResponse = mockMvc.perform(get(endpoint));

    httpResponse
        .andExpect(status().is(200))
        .andExpect(jsonPath("$.id").value(mockSubjectId01.toString()))
        .andExpect(jsonPath("$.name").value("Geometria"));

    Mockito.verify(subjectService).findSubjectById(any(UUID.class));
  }

  @Test
  @DisplayName("Verifica se é disparado uma exceção quanto não se encontra uma entidade Subject pelo seu id")
  public void findSubjectByIdTestNotFoundError() throws Exception {
    Mockito
        .when(subjectService.findSubjectById(mockSubjectId01))
        .thenThrow(new NotFoundException("Conteúdo não encontrado"));

    String endpoint = baseUrl + "/" + mockSubjectId01.toString();
    ResultActions httpResponse = mockMvc.perform(get(endpoint));

    httpResponse
        .andExpect(status().is(404))
        .andExpect(jsonPath("$").value("Conteúdo não encontrado"));

    Mockito.verify(subjectService).findSubjectById(any(UUID.class));
  }

  @Test
  @DisplayName("Verifica se é criado uma entidade Subject")
  public void createSubjectTest() throws Exception {
    Mockito
        .when(subjectService.createSubject(any(Subject.class)))
        .thenReturn(mockSubject01);

    String requestBody = "{\"name\": \"Geometria\"}";

    ResultActions httpResponse = mockMvc
        .perform(post(baseUrl)
            .contentType(MediaType.APPLICATION_JSON)
            .content(requestBody));

    httpResponse
        .andExpect(status().is(201))
        .andExpect(jsonPath("$.id").value(mockSubjectId01.toString()))
        .andExpect(jsonPath("$.name").value("Geometria"));

    Mockito.verify(subjectService).createSubject(any(Subject.class));
  }

  @Test
  @DisplayName("Verifica se é disparado uma exceção quando se tenta cadastrar uma entidade Subject já existente")
  public void createSubjectTestAlreadyExistsError() throws Exception {
    Mockito
        .when(subjectService.createSubject(any(Subject.class)))
        .thenThrow(new AlreadyExistsException("Conteúdo já cadastrado!"));

    String requestBody = "{\"name\": \"Geometria\"}";

    ResultActions httpResponse = mockMvc
        .perform(post(baseUrl)
            .contentType(MediaType.APPLICATION_JSON)
            .content(requestBody));

    httpResponse
        .andExpect(status().is(400))
        .andExpect(jsonPath("$").value("Conteúdo já cadastrado!"));

    Mockito.verify(subjectService).createSubject(any(Subject.class));
  }

  @Test
  @DisplayName("Verifica se uma entidade Subject é atualizada")
  public void updateSubjectByIdTest() throws Exception {
    Mockito
        .when(subjectService.updateSubject(any(UUID.class), any(Subject.class)))
        .thenReturn(mockSubject01);

    String requestBody = "{\"name\": \"Geometria\"}";
    String endpoint = baseUrl + "/" + mockSubjectId01.toString();

    ResultActions httpResponse = mockMvc
        .perform(put(endpoint)
            .contentType(MediaType.APPLICATION_JSON)
            .content(requestBody));

    httpResponse
        .andExpect(status().is(200))
        .andExpect(jsonPath("$.id").value(mockSubjectId01.toString()))
        .andExpect(jsonPath("$.name").value(mockSubject01.getName()));

    Mockito.verify(subjectService).updateSubject(any(UUID.class), any(Subject.class));
  }

  @Test
  @DisplayName("Verifica se é disparado uma exceção quanto não se encontra uma entidade Subject pelo seu id")
  public void updateSubjectByIdTestNotFoundTest() throws Exception {
    Mockito
        .when(subjectService.updateSubject(any(UUID.class), any(Subject.class)))
        .thenThrow(new NotFoundException("Conteúdo não encontrado!"));

    String requestBody = "{\"name\": \"Geometria\"}";
    String endpoint = baseUrl + "/" + mockSubjectId01.toString();

    ResultActions httpResponse = mockMvc
        .perform(put(endpoint)
            .contentType(MediaType.APPLICATION_JSON)
            .content(requestBody));

    httpResponse
        .andExpect(status().is(404))
        .andExpect(jsonPath("$").value("Conteúdo não encontrado!"));

    Mockito.verify(subjectService).updateSubject(any(UUID.class), any(Subject.class));
  }

  @Test
  @DisplayName("Verifica se uma entidade Subject é deletada")
  public void deleteSubjectTest() throws Exception {
    Mockito
        .doNothing().when(subjectService).deleteSubject(any(UUID.class));

    String endpoint = baseUrl + "/" + mockSubjectId01.toString();

    ResultActions httpResponse = mockMvc.perform(delete(endpoint));

    httpResponse
        .andExpect(status().is(204));

    Mockito.verify(subjectService).deleteSubject(any(UUID.class));
  }
}
