package com.mateco.reportgenerator.service;

import com.mateco.reportgenerator.model.entity.Subject;
import java.util.List;
import java.util.UUID;

public interface SubjectServiceInterface {
  List<Subject> findAllSubjects();
  Subject findSubjectById(UUID subjectId);
  Subject createSubject(Subject subject);
  Subject updateSubject(UUID subjectId, Subject subject);
  void deleteSubject(UUID subjectId);
}
