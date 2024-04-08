package com.mateco.reportgenerator.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertInstanceOf;
import static org.junit.jupiter.api.Assertions.assertNotEquals;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;

import com.mateco.reportgenerator.model.entity.Subject;
import com.mateco.reportgenerator.model.repository.SubjectRepository;
import com.mateco.reportgenerator.service.exception.AlreadyExistsException;
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
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.test.context.ActiveProfiles;

@SpringBootTest
@ActiveProfiles("test")
@ExtendWith(MockitoExtension.class)
public class SubjectServiceTests {
  @Autowired
  private SubjectServiceInterface subjectService;

  @MockBean
  private SubjectRepository subjectRepository;

  private UUID mockSubjectId01;
  private UUID mockSubjectId02;
  private Subject mockSubject01;
  private Subject mockSubject02;

  @BeforeEach
  public void setUp() {
    mockSubjectId01 = UUID.randomUUID();
    mockSubjectId02 = UUID.randomUUID();

    mockSubject01 = new Subject("Geometria");
    mockSubject01.setId(mockSubjectId01);

    mockSubject02 = new Subject("Algebra");
    mockSubject02.setId(mockSubjectId02);
  }

  @Test
  @DisplayName("Verifica se é retornado uma página com uma lista de todas as entidades Subject")
  public void findAllSubjectsNullQueryTest() {
    int pageNumber = 0;
    int pageSize = 2;

    Pageable mockPageable = PageRequest.of(pageNumber, pageSize);
    Page<Subject> page = Mockito.mock(Page.class);

    Mockito
        .when(page.getContent())
        .thenReturn(List.of(mockSubject01, mockSubject02));

    Mockito
        .when(subjectRepository.findAll(mockPageable, null))
        .thenReturn(page);

    Page<Subject> serviceResponse = subjectService.findAllSubjects(pageNumber, pageSize, null);
    List<String> subjectsName = serviceResponse.getContent().stream()
        .map(Subject::getName)
        .toList();

    assertFalse(serviceResponse.isEmpty());
    assertInstanceOf(Page.class, serviceResponse);
    assertEquals(pageNumber, serviceResponse.getNumber());
    assertEquals(pageSize, serviceResponse.getContent().size());
    assertTrue(subjectsName.contains(mockSubject01.getName()));
    assertTrue(subjectsName.contains(mockSubject02.getName()));

    Mockito
        .verify(subjectRepository)
        .findAll(any(Pageable.class), any());
  }

  @Test
  @DisplayName("Verifica se é retornado uma lista de todas as entidades Subject")
  public void findAllSubjectsNonNullQueryTest() {
    int pageNumber = 0;
    int pageSize = 2;
    String query = "ome";

    Pageable mockPageable = PageRequest.of(pageNumber, pageSize);
    Page<Subject> page = Mockito.mock(Page.class);

    Mockito
        .when(page.getContent())
        .thenReturn(List.of(mockSubject01, mockSubject02));

    Mockito
        .when(subjectRepository.findAll(mockPageable, query))
        .thenReturn(page);

    Page<Subject> serviceResponse = subjectService.findAllSubjects(pageNumber, pageSize, query);
    List<String> subjectsName = serviceResponse.getContent().stream()
        .map(Subject::getName)
        .toList();

    assertFalse(serviceResponse.isEmpty());
    assertInstanceOf(Page.class, serviceResponse);
    assertEquals(pageNumber, serviceResponse.getNumber());
    assertEquals(pageSize, serviceResponse.getContent().size());
    assertTrue(subjectsName.contains(mockSubject01.getName()));
    assertTrue(subjectsName.contains(mockSubject02.getName()));

    Mockito
        .verify(subjectRepository)
        .findAll(any(Pageable.class), any(String.class));
  }

  @Test
  @DisplayName("Verifica se é retornado a entidade Subject por seu Id")
  public void findSubjectByIdTest() {
    Mockito
        .when(subjectRepository.findById(any()))
        .thenReturn(Optional.of(mockSubject01));

    Subject serviceResponse = subjectService.findSubjectById(mockSubjectId01);

    assertEquals(mockSubject01, serviceResponse);
    assertEquals(mockSubjectId01, serviceResponse.getId());
    assertEquals(mockSubject01.getName(), serviceResponse.getName());
    assertNull(serviceResponse.getMainQuestions());

    Mockito.verify(subjectRepository).findById(any(UUID.class));
  }

  @Test
  @DisplayName("Verifica se ocorre o disparo de uma exceção caso não se encontre uma entidade Subject por seu Id")
  public void findSubjectByIdTestError() {
    Mockito
        .when(subjectRepository.findById(any()))
        .thenReturn(Optional.empty());

    assertThrows(NotFoundException.class, () -> subjectService.findSubjectById(mockSubjectId01));

    Mockito.verify(subjectRepository).findById(eq(mockSubjectId01));
  }

  @Test
  @DisplayName("Verifica se é retornado uma lista de entidades Subject por uma lista de nomes das entidades")
  public void findAllSubjectsByNameTest() {
    List<String> subjectsName = List.of(mockSubject01.getName(), mockSubject02.getName());

    Mockito
        .when(subjectRepository.findAllByNameIn(subjectsName))
        .thenReturn(List.of(mockSubject01, mockSubject02));

    List<Subject> serviceResponse = subjectService.findAllByName(subjectsName);
    List<String> subjectsResponseName = serviceResponse.stream()
        .map(Subject::getName)
        .toList();

    assertFalse(serviceResponse.isEmpty());
    assertEquals(2, serviceResponse.size());
    assertTrue(serviceResponse.stream().allMatch(subject -> subject != null));
    assertTrue(subjectsResponseName.contains(mockSubject01.getName()));
    assertTrue(subjectsResponseName.contains(mockSubject02.getName()));

    Mockito.verify(subjectRepository).findAllByNameIn(subjectsName);
  }

  @Test
  @DisplayName("Verifica se é criado uma a entidade Subject")
  public void createSubjectTest() {
    Mockito
        .when(subjectRepository.findByName(any(String.class)))
        .thenReturn(Optional.empty());

    Mockito
        .when(subjectRepository.save(any(Subject.class)))
        .thenAnswer(invocation -> invocation.getArgument(0));

    Subject serviceResponse = subjectService.createSubject(mockSubject01);

    assertEquals(mockSubjectId01, serviceResponse.getId());
    assertEquals(mockSubject01.getName(), serviceResponse.getName());
    assertNull(serviceResponse.getMainQuestions());

    Mockito
        .verify(subjectRepository)
        .findByName(any(String.class));
    Mockito
        .verify(subjectRepository)
        .save(any(Subject.class));
  }

  @Test
  @DisplayName("Verifica se é disparado uma exceção ao tentar criar uma a entidade Subject já existente")
  public void createSubjectTestError() {
    Mockito
        .when(subjectRepository.findByName("Geometria"))
        .thenReturn(Optional.of(mockSubject01));

    assertThrows(AlreadyExistsException.class, () -> subjectService.createSubject(mockSubject01));

    Mockito
        .verify(subjectRepository)
        .findByName(any(String.class));
  }

  @Test
  @DisplayName("Verifica se é retornado uma a entidade Subject atualizada")
  public void updateSubjectTest() {
    Mockito
        .when(subjectRepository.findById(any()))
        .thenReturn(Optional.of(mockSubject02));

    Mockito
        .when(subjectRepository.save(any(Subject.class)))
        .thenAnswer(invocation -> invocation.getArgument(0));

    Subject serviceResponse = subjectService.updateSubject(mockSubjectId02, mockSubject01);

    assertNotEquals(mockSubject01.getId(), serviceResponse.getId());
    assertEquals(mockSubjectId02, serviceResponse.getId());
    assertEquals(mockSubject01.getName(), serviceResponse.getName());
    assertNull(serviceResponse.getMainQuestions());

    Mockito
        .verify(subjectRepository)
        .findById(any(UUID.class));
    Mockito
        .verify(subjectRepository)
        .save(any(Subject.class));
  }

  @Test
  @DisplayName("Verifica se é disparado uma exceção ao tentar atualizar uma a entidade Subject não existente")
  public void updateSubjectTestError() {
    Mockito
        .when(subjectRepository.findById(any()))
        .thenReturn(Optional.empty());

    assertThrows(NotFoundException.class, () -> subjectService.updateSubject(mockSubjectId02, mockSubject01));

    Mockito
        .verify(subjectRepository)
        .findById(any(UUID.class));
  }

  @Test
  @DisplayName("Verifica se uma entidade Subject foi deletada do banco de dados")
  public void deleteSubjectTest() {
    subjectService.deleteSubject(mockSubjectId01);

    Mockito
        .verify(subjectRepository)
        .deleteById(any(UUID.class));
  }
}
