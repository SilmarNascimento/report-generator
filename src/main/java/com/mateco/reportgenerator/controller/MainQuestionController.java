package com.mateco.reportgenerator.controller;

import com.mateco.reportgenerator.controller.dto.AdaptedQuestionInputDto;
import com.mateco.reportgenerator.controller.dto.AdaptedQuestionOutputDto;
import com.mateco.reportgenerator.model.entity.AdaptedQuestion;
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
  public ResponseEntity<List<AdaptedQuestionOutputDto>> findAllAdaptedQuestions() {
    return ResponseEntity
        .status(HttpStatus.OK)
        .body(AdaptedQuestionOutputDto
            .parseDto(adaptedQuestionService.findAllAdaptedQuestion()));
  }

  @GetMapping("/{adaptedQuestiontId}")
  public ResponseEntity<AdaptedQuestionOutputDto> findAdaptedQuestionById(@PathVariable UUID adaptedQuestionId) {
    return ResponseEntity
        .status(HttpStatus.OK)
        .body(AdaptedQuestionOutputDto
            .parseDto(adaptedQuestionService.findAdaptedQuestionById(adaptedQuestionId)));
  }

  @PostMapping
  public ResponseEntity<AdaptedQuestionOutputDto> createAdaptedQuestion(
      @RequestBody AdaptedQuestionInputDto adaptedQuestionInputDto
  ) {
    AdaptedQuestion adaptedQuestionCreated = adaptedQuestionService
        .createAdaptedQuestion(AdaptedQuestion.parseAdaptedQuestion(adaptedQuestionInputDto));
    return ResponseEntity
        .status(HttpStatus.CREATED)
        .body(AdaptedQuestionOutputDto.parseDto(adaptedQuestionCreated));
  }

  @PutMapping("/{adaptedQuestionId}")
  public ResponseEntity<AdaptedQuestionOutputDto> updateAdaptedQuestionById(
      @PathVariable UUID adaptedQuestionID,
      AdaptedQuestionInputDto adaptedQuestionInputDto
  ) {
    AdaptedQuestion updatedQuestion = adaptedQuestionService
        .updateAdaptedQuestion(adaptedQuestionID, AdaptedQuestion.parseAdaptedQuestion(adaptedQuestionInputDto));
    return ResponseEntity
        .status(HttpStatus.OK)
        .body(AdaptedQuestionOutputDto.parseDto(updatedQuestion));
  }

  @DeleteMapping("/{adaptedQuestionId}")
  public ResponseEntity<Void> deleteAdaptedQuestionById(@PathVariable UUID adaptedQuestionId) {
    adaptedQuestionService.deleteAdaptedQuestion(adaptedQuestionId);
    return ResponseEntity
        .status(HttpStatus.NO_CONTENT)
        .build();
  }

  @GetMapping
  public ResponseEntity<List<AdaptedQuestionOutputDto>> findAllAdaptedQuestions() {
    return ResponseEntity
        .status(HttpStatus.OK)
        .body(AdaptedQuestionOutputDto
            .parseDto(adaptedQuestionService.findAllAdaptedQuestion()));
  }

  @GetMapping("/{adaptedQuestiontId}")
  public ResponseEntity<AdaptedQuestionOutputDto> findAdaptedQuestionById(@PathVariable UUID adaptedQuestionId) {
    return ResponseEntity
        .status(HttpStatus.OK)
        .body(AdaptedQuestionOutputDto
            .parseDto(adaptedQuestionService.findAdaptedQuestionById(adaptedQuestionId)));
  }

  @PostMapping
  public ResponseEntity<AdaptedQuestionOutputDto> createAdaptedQuestion(
      @RequestBody AdaptedQuestionInputDto adaptedQuestionInputDto
  ) {
    AdaptedQuestion adaptedQuestionCreated = adaptedQuestionService
        .createAdaptedQuestion(AdaptedQuestion.parseAdaptedQuestion(adaptedQuestionInputDto));
    return ResponseEntity
        .status(HttpStatus.CREATED)
        .body(AdaptedQuestionOutputDto.parseDto(adaptedQuestionCreated));
  }

  @PutMapping("/{adaptedQuestionId}")
  public ResponseEntity<AdaptedQuestionOutputDto> updateAdaptedQuestionById(
      @PathVariable UUID adaptedQuestionID,
      AdaptedQuestionInputDto adaptedQuestionInputDto
  ) {
    AdaptedQuestion updatedQuestion = adaptedQuestionService
        .updateAdaptedQuestion(adaptedQuestionID, AdaptedQuestion.parseAdaptedQuestion(adaptedQuestionInputDto));
    return ResponseEntity
        .status(HttpStatus.OK)
        .body(AdaptedQuestionOutputDto.parseDto(updatedQuestion));
  }

  @DeleteMapping("/{adaptedQuestionId}")
  public ResponseEntity<Void> deleteAdaptedQuestionById(@PathVariable UUID adaptedQuestionId) {
    adaptedQuestionService.deleteAdaptedQuestion(adaptedQuestionId);
    return ResponseEntity
        .status(HttpStatus.NO_CONTENT)
        .build();
  }
}
