package com.mateco.reportgenerator.controller;

import com.mateco.reportgenerator.controller.dto.QuestionInputDto;
import com.mateco.reportgenerator.controller.dto.AdaptedQuestionOutputDto;
import com.mateco.reportgenerator.controller.dto.MainQuestionInputDto;
import com.mateco.reportgenerator.controller.dto.MainQuestionOutputDto;
import com.mateco.reportgenerator.controller.dto.SubjectListInputDto;
import com.mateco.reportgenerator.model.entity.AdaptedQuestion;
import com.mateco.reportgenerator.model.entity.MainQuestion;
import com.mateco.reportgenerator.service.AdaptedQuestionServiceInterface;
import com.mateco.reportgenerator.service.ImageServiceInterface;
import com.mateco.reportgenerator.service.MainQuestionServiceInterface;
import java.io.IOException;
import java.util.List;
import java.util.UUID;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/main-questions")
public class MainQuestionController {
  private final MainQuestionServiceInterface mainQuestionService;
  private final AdaptedQuestionServiceInterface adaptedQuestionService;
  private final ImageServiceInterface imageService;

  @Autowired
  public MainQuestionController(
      MainQuestionServiceInterface mainQuestionService,
      AdaptedQuestionServiceInterface adaptedQuestionService,
      ImageServiceInterface imageService
  ) {
    this.mainQuestionService = mainQuestionService;
    this.adaptedQuestionService = adaptedQuestionService;
    this.imageService = imageService;
  }

  @GetMapping
  public ResponseEntity<List<MainQuestionOutputDto>> findAllMainQuestions() {
    List<MainQuestion> questions = mainQuestionService.findAllMainQuestions();
    return ResponseEntity
        .status(HttpStatus.OK)
        .body(MainQuestionOutputDto
            .parseDto(questions));
  }

  @GetMapping("/{mainQuestionId}")
  public ResponseEntity<MainQuestionOutputDto> findMainQuestionById(@PathVariable UUID mainQuestionId) {
    return ResponseEntity
        .status(HttpStatus.OK)
        .body(MainQuestionOutputDto
            .parseDto(mainQuestionService.findMainQuestionById(mainQuestionId)));
  }

  @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
  public ResponseEntity<MainQuestionOutputDto> createMainQuestion(
      @RequestPart("mainQuestionInputDto") QuestionInputDto mainQuestionInputDto,
      @RequestPart(value = "images", required = false) List<MultipartFile> images
  ) throws IOException {
    List<String> questionImages = imageService.uploadImages(images);

    MainQuestion mainQuestionCreated = mainQuestionService
        .createMainQuestion(MainQuestion.parseMainQuestion(mainQuestionInputDto), questionImages);

    return ResponseEntity
        .status(HttpStatus.CREATED)
        .body(MainQuestionOutputDto.parseDto(mainQuestionCreated));
  }

  @PutMapping(value = "/{mainQuestionId}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
  public ResponseEntity<MainQuestionOutputDto> updateMainQuestionById(
      @PathVariable UUID mainQuestionId,
      @RequestPart("mainQuestionInputDto") MainQuestionInputDto mainQuestionInputDto,
      @RequestPart(value = "images", required = false) List<MultipartFile> images
  ) throws IOException {
    List<String> questionImages = imageService.uploadImages(images);

    MainQuestion updatedMainQuestion = mainQuestionService
        .updateMainQuestionById(mainQuestionId, MainQuestion.parseMainQuestion(mainQuestionInputDto), questionImages);
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

  @GetMapping("/{mainQuestionId}/adapted-questions/{adaptedQuestionId}")
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
  public ResponseEntity<MainQuestionOutputDto> createAdaptedQuestionForMainQuestion(
      @PathVariable UUID mainQuestionId,
      @RequestPart("adaptedQuestionInputDto") QuestionInputDto questionInputDto,
      @RequestPart(value = "images", required = false) List<MultipartFile> images
  ) throws IOException {
    List<String> questionImages = imageService.uploadImages(images);

    MainQuestion mainQuestionCreated = mainQuestionService
        .addAdaptedQuestion(
            mainQuestionId,
            AdaptedQuestion.parseAdaptedQuestion(questionInputDto),
            questionImages
        );

    return ResponseEntity
        .status(HttpStatus.CREATED)
        .body(MainQuestionOutputDto.parseDto(mainQuestionCreated));
  }

  @PutMapping("/{mainQuestionId}/adapted-questions/{adaptedQuestionId}")
  public ResponseEntity<AdaptedQuestionOutputDto> updateAdaptedQuestionOfMainQuestionById(
      @PathVariable UUID mainQuestionId,
      @PathVariable UUID adaptedQuestionId,
      @RequestPart("adaptedQuestionInputDto") QuestionInputDto questionInputDto,
      @RequestPart(value = "images", required = false) List<MultipartFile> images
  ) throws IOException {
    AdaptedQuestion updatedQuestion = adaptedQuestionService
        .updateAdaptedQuestionOfMainQuestionById(
            mainQuestionId,
            adaptedQuestionId,
            AdaptedQuestion.parseAdaptedQuestion(questionInputDto)
        );
    return ResponseEntity
        .status(HttpStatus.OK)
        .body(AdaptedQuestionOutputDto.parseDto(updatedQuestion));
  }

  @DeleteMapping("/{mainQuestionId}/adapted-questions/{adaptedQuestionId}")
  public ResponseEntity<Void> deleteAdaptedQuestionFromMainQuestionById(
      @PathVariable UUID mainQuestionId,
      @PathVariable UUID adaptedQuestionId
  ) {
    mainQuestionService.removeAdaptedQuestion(mainQuestionId, adaptedQuestionId);
    return ResponseEntity
        .status(HttpStatus.NO_CONTENT)
        .build();
  }

  @PutMapping("/{mainQuestionId}/subject")
  public ResponseEntity<MainQuestionOutputDto> addSubjectToMainQuestion(
      @PathVariable UUID mainQuestionId,
      @RequestBody SubjectListInputDto subjectIdList
  ) {
    MainQuestion mainQuestionUpdated = mainQuestionService
        .addSubject(mainQuestionId, subjectIdList.subjectsId());
    return ResponseEntity
        .status(HttpStatus.OK)
        .body(MainQuestionOutputDto.parseDto(mainQuestionUpdated));
  }

  @DeleteMapping("/{mainQuestionId}/subject")
  public ResponseEntity<Void> removeSubjectFromMainQUestion(
      @PathVariable UUID mainQuestionId,
      @RequestBody SubjectListInputDto subjectIdList
  ) {
    mainQuestionService.removeSubject(mainQuestionId, subjectIdList.subjectsId());
    return ResponseEntity
        .status(HttpStatus.NO_CONTENT)
        .build();
  }
}
