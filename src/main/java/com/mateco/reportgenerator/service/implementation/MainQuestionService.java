package com.mateco.reportgenerator.service.implementation;

import com.mateco.reportgenerator.model.entity.AdaptedQuestion;
import com.mateco.reportgenerator.model.entity.Alternative;
import com.mateco.reportgenerator.model.entity.Handout;
import com.mateco.reportgenerator.model.entity.MainQuestion;
import com.mateco.reportgenerator.model.entity.MockExam;
import com.mateco.reportgenerator.model.entity.Subject;
import com.mateco.reportgenerator.model.repository.AdaptedQuestionRepository;
import com.mateco.reportgenerator.model.repository.AlternativeRespository;
import com.mateco.reportgenerator.model.repository.MainQuestionRepository;
import com.mateco.reportgenerator.model.repository.SubjectRepository;
import com.mateco.reportgenerator.service.AlternativeServiceInterface;
import com.mateco.reportgenerator.service.MainQuestionServiceInterface;
import com.mateco.reportgenerator.service.exception.ConflictDataException;
import com.mateco.reportgenerator.service.exception.NotFoundException;
import com.mateco.reportgenerator.utils.UpdateEntity;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

/**
 * Service - implementação dos métodos da camada service
 *           da entidade MainQuestion.
 */
@Service
public class MainQuestionService implements MainQuestionServiceInterface {
  private final MainQuestionRepository mainQuestionRepository;
  private final AdaptedQuestionRepository adaptedQuestionRepository;
  private final AlternativeServiceInterface alternativeService;
  private  final SubjectRepository subjectRepository;

  @Autowired
  public MainQuestionService(
      MainQuestionRepository mainQuestionRepository,
      AdaptedQuestionRepository adaptedQuestionRepository,
      AlternativeService alternativeService,
      SubjectRepository subjectRepository
  ) {
    this.mainQuestionRepository = mainQuestionRepository;
    this.adaptedQuestionRepository = adaptedQuestionRepository;
    this.alternativeService = alternativeService;
    this.subjectRepository = subjectRepository;
  }

  @Override
  public List<MainQuestion> findAllMainQuestions() {
    List<MainQuestion> list = mainQuestionRepository.findAll();
    System.out.println("lista de questões encontradas: " + list);
    return list;
  }

  @Override
  public MainQuestion findMainQuestionById(UUID questionId) {
    MainQuestion mainQuestion = mainQuestionRepository.findById(questionId)
        .orElseThrow(() -> new NotFoundException("Questão principal não encontrada!"));
    System.out.println("questão encontrada por Id: " + mainQuestion);
    return mainQuestion;
  }

  @Override
  public MainQuestion createMainQuestion(MainQuestion question) {
    MainQuestion mainQuestionSaved = mainQuestionRepository.save(question);
    System.out.println("retorno ao salvar no banco de dados a MainQuestion: " + mainQuestionSaved.toString());
    return mainQuestionSaved;
  }

  @Override
  public MainQuestion updateMainQuestionById(UUID questionId, MainQuestion question) {
    MainQuestion mainQuestionFound = mainQuestionRepository.findById(questionId)
        .orElseThrow(() -> new NotFoundException("Questão principal não encontrada!"));
    UpdateEntity.copyNonNullProperties(question, mainQuestionFound);
    return mainQuestionFound;
  }

  @Override
  public void deleteMainQuestionById(UUID questionId) {
    mainQuestionRepository.deleteById(questionId);
  }

  @Override
  public MainQuestion addSubject(UUID questionId, List<UUID> subjectsId) {
    MainQuestion mainQuestionFound = mainQuestionRepository.findById(questionId)
        .orElseThrow(() -> new NotFoundException("Questão principal não encontrada!"));
    List<Subject> subjectList = subjectRepository.findAll();
    List<Subject> mainQuestionSubjectList = subjectList.stream()
        .filter((Subject subject) -> subjectsId.contains(subject))
        .toList();
    mainQuestionSubjectList
        .forEach((Subject subject) -> mainQuestionFound.setSubjects(subject));
    mainQuestionRepository.save(mainQuestionFound);
    return mainQuestionFound;
  }

  @Override
  public void removeSubject(UUID questionId, List<UUID> subjectsId) {
    MainQuestion mainQuestionFound = mainQuestionRepository.findById(questionId)
        .orElseThrow(() -> new NotFoundException("Questão principal não encontrada!"));

    List<Subject> mainQuestionSubjectList = mainQuestionFound.getSubjects();

    mainQuestionSubjectList.removeIf(subject -> subjectsId.contains(subject.getId()));
    mainQuestionRepository.save(mainQuestionFound);
  }

  @Override
  public AdaptedQuestion addAdaptedQuestion(
      UUID questionId,
      UUID adaptedQuestionId
  ) {
    MainQuestion mainQuestionFound = mainQuestionRepository.findById(questionId)
        .orElseThrow(() -> new NotFoundException("Questão principal não encontrada!"));
    AdaptedQuestion adaptedQuestionFound = adaptedQuestionRepository.findById(adaptedQuestionId)
        .orElseThrow(() -> new NotFoundException("Questão adaptada não encontrada!"));
    adaptedQuestionFound.setMainQuestion(mainQuestionFound);
    adaptedQuestionRepository.save(adaptedQuestionFound);
    return adaptedQuestionFound;
  }

  @Override
  public void removeAdaptedQuestion(UUID questionId, UUID adaptedQuestionId) {
    MainQuestion mainQuestionFound = mainQuestionRepository.findById(questionId)
        .orElseThrow(() -> new NotFoundException("Questão principal não encontrada!"));
    AdaptedQuestion adaptedQuestionFound = adaptedQuestionRepository.findById(adaptedQuestionId)
        .orElseThrow(() -> new NotFoundException("Questão adaptada não encontrada!"));
    if (!adaptedQuestionFound.getMainQuestion().equals(mainQuestionFound)) {
      throw new ConflictDataException("Questão adaptada não pertence à questão principal!");
    }
    adaptedQuestionFound.setMainQuestion(null);
  }

  @Override
  public MockExam addMockExam(UUID questionId, UUID mockExamId, MockExam mockExam) {
    MainQuestion mainQuestionFound = mainQuestionRepository.findById(questionId)
        .orElseThrow(() -> new NotFoundException("Questão principal não encontrada!"));
    return null;
  }

  @Override
  public void removeMockExam(UUID questionId, UUID mockExamId) {

  }

  @Override
  public Handout addHandout(UUID questionId, UUID handoutId, Handout handout) {
    MainQuestion mainQuestionFound = mainQuestionRepository.findById(questionId)
        .orElseThrow(() -> new NotFoundException("Questão principal não encontrada!"));
    return null;
  }

  @Override
  public void removeHandout(UUID questionId, UUID handoutId) {

  }
}
