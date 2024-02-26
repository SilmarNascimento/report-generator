package com.mateco.reportgenerator.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
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
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.context.ActiveProfiles;

@SpringBootTest
@ActiveProfiles("test")
public class SubjectServiceTests {
  @Autowired
  private SubjectServiceInterface subjectService;

  @MockBean
  private SubjectRepository subjectRepository;

  @Test
  @DisplayName("Verifica se é retornado uma lista de todas as entidades Subject")
  public void findAllSubjectsTest() {
    Subject mockSubject01 = new Subject("Matemática");
    Subject mockSubject02 = new Subject("Geometria");

    Mockito
        .when(subjectRepository.findAll())
        .thenReturn(List.of(mockSubject01, mockSubject02));

    List<Subject> serviceResponse = subjectService.findAllSubjects();
    List<String> subjectsName = serviceResponse.stream()
        .map(Subject::getName)
        .toList();

    assertFalse(serviceResponse.isEmpty());
    assertEquals(2, serviceResponse.size());
    assertTrue(serviceResponse.stream().allMatch(subject -> subject != null));
    assertTrue(subjectsName.contains("Matemática"));
    assertTrue(subjectsName.contains("Geometria"));

    Mockito.verify(subjectRepository).findAll();
  }

  @Test
  @DisplayName("Verifica se é retornado a entidade Subject por seu Id")
  public void findSubjectByIdTest() {
    Subject mockSubject = new Subject("Matemática");
    UUID mockSubjectId = UUID.randomUUID();
    mockSubject.setId(mockSubjectId);

    Mockito
        .when(subjectRepository.findById(any()))
        .thenReturn(Optional.of(mockSubject));

    Subject serviceResponse = subjectService.findSubjectById(mockSubjectId);

    assertEquals(mockSubject, serviceResponse);
    assertEquals(mockSubjectId, serviceResponse.getId());
    assertEquals("Matemática", serviceResponse.getName());
    assertNull(serviceResponse.getMainQuestions());

    Mockito.verify(subjectRepository).findById(eq(mockSubjectId));
  }

  @Test
  @DisplayName("Verifica se ocorre o disparo de uma exceção caso não se encontre uma entidade Subject por seu Id")
  public void findSubjectByIdTestError() {
    UUID mockSubjectId = UUID.randomUUID();

    Mockito
        .when(subjectRepository.findById(any()))
        .thenReturn(Optional.empty());

    assertThrows(NotFoundException.class, () -> subjectService.findSubjectById(mockSubjectId));

    Mockito.verify(subjectRepository).findById(eq(mockSubjectId));
  }

  @Test
  @DisplayName("Verifica se é retornado uma lista de entidades Subject por uma lista de nomes das entidades")
  public void findAllSubjectsByNameTest() {
    Subject mockSubject01 = new Subject("Matemática");
    Subject mockSubject02 = new Subject("Geometria");

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
    assertTrue(subjectsResponseName.contains("Matemática"));
    assertTrue(subjectsResponseName.contains("Geometria"));

    Mockito.verify(subjectRepository).findAllByNameIn(subjectsName);
  }

  @Test
  @DisplayName("Verifica se é criado uma a entidade Subject")
  public void createSubjectTest() {
    Subject newSubject = new Subject("Matemática");

    Subject mockSubject = new Subject("Matemática");
    UUID mockSubjectId = UUID.randomUUID();
    mockSubject.setId(mockSubjectId);

    Mockito
        .when(subjectRepository.findByName(any()))
        .thenReturn(Optional.empty());

    Mockito
        .when(subjectRepository.save(any()))
        .thenReturn(mockSubject);

    Subject serviceResponse = subjectService.createSubject(newSubject);

    assertNotEquals(newSubject.getId(), serviceResponse.getId());
    assertEquals(mockSubjectId, serviceResponse.getId());
    assertEquals("Matemática", serviceResponse.getName());
    assertNull(serviceResponse.getMainQuestions());

    Mockito.verify(subjectRepository).findByName("Matemática");
    Mockito.verify(subjectRepository).save(eq(newSubject));
  }

  @Test
  @DisplayName("Verifica se é disparado uma exceção ao tentar criar uma a entidade Subject já existente")
  public void createSubjectTestError() {
    Subject newSubject = new Subject("Matemática");

    Subject mockSubject = new Subject("Matemática");
    UUID mockSubjectId = UUID.randomUUID();
    mockSubject.setId(mockSubjectId);

    Mockito
        .when(subjectRepository.findByName("Matemática"))
        .thenReturn(Optional.of(mockSubject));

    assertThrows(AlreadyExistsException.class, () -> subjectService.createSubject(newSubject));

    Mockito.verify(subjectRepository).findByName("Matemática");
  }

  @Test
  @DisplayName("Verifica se é retornado uma a entidade Subject atualizada")
  public void updateSubjectTest() {
    Subject newSubject = new Subject("Geometria");

    Subject mockSubject = new Subject("Matemática");
    UUID mockSubjectId = UUID.randomUUID();
    mockSubject.setId(mockSubjectId);

    Subject mockUpdatedSubject = new Subject("Geometria");
    mockUpdatedSubject.setId(mockSubjectId);

    Mockito
        .when(subjectRepository.findById(any()))
        .thenReturn(Optional.of(mockSubject));

    Mockito
        .when(subjectRepository.save(any()))
        .thenReturn(mockUpdatedSubject);

    Subject serviceResponse = subjectService.updateSubject(mockSubjectId, newSubject);

    assertNotEquals(newSubject.getId(), serviceResponse.getId());
    assertEquals(mockSubjectId, serviceResponse.getId());
    assertEquals("Geometria", serviceResponse.getName());
    assertNull(serviceResponse.getMainQuestions());

    Mockito.verify(subjectRepository).findById(mockSubjectId);
    Mockito.verify(subjectRepository).save(eq(mockUpdatedSubject));
  }

  @Test
  @DisplayName("Verifica se é disparado uma exceção ao tentar atualizar uma a entidade Subject não existente")
  public void updateSubjectTestError() {
    Subject newSubject = new Subject("Geometria");
    UUID mockSubjectId = UUID.randomUUID();

    Mockito
        .when(subjectRepository.findById(any()))
        .thenReturn(Optional.empty());

    assertThrows(NotFoundException.class, () -> subjectService.updateSubject(mockSubjectId, newSubject));

    Mockito.verify(subjectRepository).findById(mockSubjectId);
  }

  @Test
  @DisplayName("Verifica se uma entidade Subject foi deletada do banco de dados")
  public void deleteSubjectTest() {
    UUID mockSubjectId = UUID.randomUUID();

    subjectService.deleteSubject(mockSubjectId);

    Mockito.verify(subjectRepository).deleteById(mockSubjectId);
  }
}
