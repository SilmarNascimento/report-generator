package com.mateco.reportgenerator.service;

import com.mateco.reportgenerator.model.entity.Subject;
import java.util.List;
import java.util.UUID;
import org.springframework.data.domain.Page;

/**
 * Service Interface - assinatura dos métodos para a camada service
 *                     da entidade Subject.
 */
public interface SubjectServiceInterface {
  Page<Subject> findAllSubjects(int pageNumber, int pageSize, String query, List<UUID> excludedSubjects);
  Subject findSubjectById(UUID subjectId);
  List<Subject> findAllByName(List<String> subjectNameList);
  Subject createSubject(Subject subject);
  Subject updateSubject(UUID subjectId, Subject subject);
  void deleteSubject(UUID subjectId);
}
