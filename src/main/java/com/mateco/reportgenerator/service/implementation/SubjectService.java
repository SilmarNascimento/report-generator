package com.mateco.reportgenerator.service.implementation;

import com.mateco.reportgenerator.model.entity.Subject;
import com.mateco.reportgenerator.model.repository.SubjectRepository;
import com.mateco.reportgenerator.service.exception.NotFoundException;
import com.mateco.reportgenerator.service.SubjectServiceInterface;
import java.util.List;
import java.util.UUID;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

/**
 * Service - implementação dos métodos da camada service
 *           da entidade Subject.
 */
@Service
public class SubjectService implements SubjectServiceInterface {
  private final SubjectRepository subjectRepository;

  @Autowired
  public SubjectService(SubjectRepository subjectRepository) {
    this.subjectRepository = subjectRepository;
  }

  @Override
  public List<Subject> findAllSubjects() {
    return subjectRepository.findAll();
  }

  @Override
  public Subject findSubjectById(UUID subjectId) {
    return subjectRepository.findById(subjectId)
        .orElseThrow(() -> new NotFoundException("Conteúdo não encontrado!"));
  }

  @Override
  public Subject createSubject(Subject subject) {
    return subjectRepository.save(subject);
  }

  @Override
  public Subject updateSubject(UUID subjectId, Subject subject) {
    Subject subjectFound = subjectRepository.findById(subjectId)
        .orElseThrow(() -> new NotFoundException("Conteúdo não encontrado!"));
    String newName = subject.getName();
    subjectFound.setName(newName);
    return subjectRepository.save(subjectFound);
  }

  @Override
  public void deleteSubject(UUID subjectId) {
    subjectRepository.deleteById(subjectId);
  }
}
