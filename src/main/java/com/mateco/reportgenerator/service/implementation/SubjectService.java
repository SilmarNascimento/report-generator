package com.mateco.reportgenerator.service.implementation;

import com.mateco.reportgenerator.model.entity.Subject;
import com.mateco.reportgenerator.service.SubjectServiceInterface;
import java.util.List;
import java.util.UUID;
import org.springframework.stereotype.Service;

/**
 * Service - implementação dos métodos da camada service
 *           da entidade Subject.
 */
@Service
public class SubjectService implements SubjectServiceInterface {

  @Override
  public List<Subject> findAllSubjects() {
    return null;
  }

  @Override
  public Subject findSubjectById(UUID subjectId) {
    return null;
  }

  @Override
  public Subject createSubject(Subject subject) {
    return null;
  }

  @Override
  public Subject updateSubject(UUID subjectId, Subject subject) {
    return null;
  }

  @Override
  public void deleteSubject(UUID subjectId) {

  }
}
