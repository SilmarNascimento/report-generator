package com.mateco.reportgenerator.service.implementation;

import com.mateco.reportgenerator.model.entity.Subject;
import com.mateco.reportgenerator.model.repository.SubjectRepository;
import com.mateco.reportgenerator.service.exception.AlreadyExistsException;
import com.mateco.reportgenerator.service.exception.NotFoundException;
import com.mateco.reportgenerator.service.SubjectServiceInterface;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
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
  public Page<Subject> findAllSubjects(int pageNumber, int pageSize) {
    Pageable pageable = PageRequest.of(pageNumber, pageSize);
    return subjectRepository.findAll(pageable);
  }

  @Override
  public Subject findSubjectById(UUID subjectId) {
    return subjectRepository.findById(subjectId)
        .orElseThrow(() -> new NotFoundException("Conteúdo não encontrado!"));
  }

  @Override
  public List<Subject> findAllByName(List<String> subjectNameList) {
    return subjectRepository.findAllByNameIn(subjectNameList);
  }

  @Override
  public Subject createSubject(Subject subject) {
    subjectRepository.findByName(subject.getName())
        .ifPresent(subjectFound -> {
          throw new AlreadyExistsException("Conteúdo já cadastrado!");
        });
    return subjectRepository.save(subject);
  }

  @Override
  public Subject updateSubject(UUID subjectId, Subject subject) {
    Subject subjectFound = subjectRepository.findById(subjectId)
        .orElseThrow(() -> new NotFoundException("Conteúdo não encontrado!"));
    subjectFound.setName(subject.getName());
    return subjectRepository.save(subjectFound);
  }

  @Override
  public void deleteSubject(UUID subjectId) {
    subjectRepository.deleteById(subjectId);
  }
}
