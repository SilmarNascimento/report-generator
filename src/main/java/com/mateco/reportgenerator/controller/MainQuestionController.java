package com.mateco.reportgenerator.controller;

import com.mateco.reportgenerator.controller.dto.QuestionInputDto;
import com.mateco.reportgenerator.controller.dto.AdaptedQuestionOutputDto;
import com.mateco.reportgenerator.controller.dto.MainQuestionInputDto;
import com.mateco.reportgenerator.controller.dto.MainQuestionOutputDto;
import com.mateco.reportgenerator.model.entity.AdaptedQuestion;
import com.mateco.reportgenerator.model.entity.MainQuestion;
import com.mateco.reportgenerator.service.AdaptedQuestionServiceInterface;
import com.mateco.reportgenerator.service.MainQuestionServiceInterface;
import java.util.List;
import java.util.UUID;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/main-questions")
public class MainQuestionController {
  private final MainQuestionServiceInterface mainQuestionService;
  private final AdaptedQuestionServiceInterface adaptedQuestionService;

  @Autowired
  public MainQuestionController(
      MainQuestionServiceInterface mainQuestionService,
      AdaptedQuestionServiceInterface adaptedQuestionService
  ) {
    this.mainQuestionService = mainQuestionService;
    this.adaptedQuestionService = adaptedQuestionService;
  }

  @GetMapping
  public ResponseEntity<List<MainQuestionOutputDto>> findAllMainQuestions() {
    return ResponseEntity
        .status(HttpStatus.OK)
        .body(MainQuestionOutputDto
            .parseDto(mainQuestionService.findAllMainQuestions()));
  }

  @GetMapping("/{mainQuestiontId}")
  public ResponseEntity<MainQuestionOutputDto> findMainQuestionById(@PathVariable UUID mainQuestionId) {
    return ResponseEntity
        .status(HttpStatus.OK)
        .body(MainQuestionOutputDto
            .parseDto(mainQuestionService.findMainQuestionById(mainQuestionId)));
  }

  @PostMapping
  public ResponseEntity<MainQuestionOutputDto> createMainQuestion(
      @RequestBody QuestionInputDto mainQuestionInputDto
  ) {
    MainQuestion mainQuestionCreated = mainQuestionService
        .createMainQuestion(MainQuestion.parseMainQuestion(mainQuestionInputDto));
    return ResponseEntity
        .status(HttpStatus.CREATED)
        .body(MainQuestionOutputDto.parseDto(mainQuestionCreated));
  }

  @PutMapping("/{mainQuestionId}")
  public ResponseEntity<MainQuestionOutputDto> updateMainQuestionById(
      @PathVariable UUID mainQuestionID,
      MainQuestionInputDto mainQuestionInputDto
  ) {
    MainQuestion updatedMainQuestion = mainQuestionService
        .updateMainQuestionById(mainQuestionID, MainQuestion.parseMainQuestion(mainQuestionInputDto));
    return ResponseEntity
        .status(HttpStatus.OK)
        .body(MainQuestionOutputDto.parseDto(updatedMainQuestion));
  }

  @DeleteMapping("/{mainQuestionId}")
  public ResponseEntity<Void> deleteMainQuestionById(@PathVariable UUID mainQuestionId) {
    mainQuestionService.deleteMainQuestionById(mainQuestionId);
    return ResponseEntity
        .status(HttpStatus.NO_CONTENT)
        .build();
  }

  @GetMapping("/{mainQuestionId}/adapted-questions")
  public ResponseEntity<List<AdaptedQuestionOutputDto>> findAllAdaptedQuestionsFromMainQuestion(
      @PathVariable UUID mainQuestionId
  ) {
    return ResponseEntity
        .status(HttpStatus.OK)
        .body(AdaptedQuestionOutputDto
            .parseDto(adaptedQuestionService.findAllAdaptedQuestionFromMainQuestion(mainQuestionId)));
  }

  @GetMapping("/{mainQuestiontId}/adapted-questions/{adaptedQuestionId}")
  public ResponseEntity<AdaptedQuestionOutputDto> findAdaptedQuestionFromMainQuestionById(
      @PathVariable UUID mainQuestionId,
      @PathVariable UUID adaptedQuestionId
  ) {
    return ResponseEntity
        .status(HttpStatus.OK)
        .body(AdaptedQuestionOutputDto
            .parseDto(adaptedQuestionService.findAdaptedQuestionsFromMainQuestionById(mainQuestionId, adaptedQuestionId)));
  }

  @PostMapping("/{mainQuestionId}/adapted-questions")
  public ResponseEntity<AdaptedQuestionOutputDto> createAdaptedQuestionForMainQuestion(
      @PathVariable UUID mainQuestionId,
      @RequestBody QuestionInputDto questionInputDto
  ) {
    AdaptedQuestion adaptedQuestionCreated = adaptedQuestionService
        .createAdaptedQuestionForMainQuestion(mainQuestionId, AdaptedQuestion.parseAdaptedQuestion(questionInputDto));
    return ResponseEntity
        .status(HttpStatus.CREATED)
        .body(AdaptedQuestionOutputDto.parseDto(adaptedQuestionCreated));
  }

  @PutMapping("/{mainQuestiontId}/adapted-questions/{adaptedQuestionId}")
  public ResponseEntity<AdaptedQuestionOutputDto> updateAdaptedQuestionOfMainQuestionById(
      @PathVariable UUID mainQuestionId,
      @PathVariable UUID adaptedQuestionID,
      QuestionInputDto questionInputDto
  ) {
    AdaptedQuestion updatedQuestion = adaptedQuestionService
        .updateAdaptedQuestionOfMainQuestionById(
            mainQuestionId,
            adaptedQuestionID,
            AdaptedQuestion.parseAdaptedQuestion(questionInputDto)
        );
    return ResponseEntity
        .status(HttpStatus.OK)
        .body(AdaptedQuestionOutputDto.parseDto(updatedQuestion));
  }

  @DeleteMapping("/{mainQuestiontId}/adapted-questions/{adaptedQuestionId}")
  public ResponseEntity<Void> deleteAdaptedQuestionFromMainQuestionById(
      @PathVariable UUID mainQuestionId,
      @PathVariable UUID adaptedQuestionId
  ) {
    adaptedQuestionService.deleteAdaptedQuestionFromMainQuestionById(mainQuestionId, adaptedQuestionId);
    return ResponseEntity
        .status(HttpStatus.NO_CONTENT)
        .build();
  }

  @PutMapping("/{mainQuestionId}/subject")
  public ResponseEntity<MainQuestionOutputDto> addSubjectToMainQuestion(
      @PathVariable UUID mainQuestionId,
      @RequestBody List<UUID> subjectsId
  ) {
    MainQuestion mainQuestionUpdated = mainQuestionService.addSubject(mainQuestionId, subjectsId);
    return ResponseEntity
        .status(HttpStatus.OK)
        .body(MainQuestionOutputDto.parseDto(mainQuestionUpdated));
  }

  @DeleteMapping("/{mainQuestionId}/subject")
  public ResponseEntity<Void> removeSubjectFromMainQUestion(
      @PathVariable UUID mainQuestionId,
      @RequestBody List<UUID> subjectsId
  ) {
    mainQuestionService.removeSubject(mainQuestionId, subjectsId);
    return ResponseEntity
        .status(HttpStatus.NO_CONTENT)
        .build();
  }
}
