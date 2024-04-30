package com.mateco.reportgenerator.controller;

import com.mateco.reportgenerator.controller.dto.PageOutputDto;
import com.mateco.reportgenerator.controller.dto.questionDto.MainQuestionListInputDto;
import com.mateco.reportgenerator.controller.dto.questionDto.QuestionInputDto;
import com.mateco.reportgenerator.controller.dto.questionDto.AdaptedQuestionOutputDto;
import com.mateco.reportgenerator.controller.dto.questionDto.MainQuestionOutputDto;
import com.mateco.reportgenerator.controller.dto.subjectDto.SubjectListInputDto;
import com.mateco.reportgenerator.model.entity.AdaptedQuestion;
import com.mateco.reportgenerator.model.entity.MainQuestion;
import com.mateco.reportgenerator.service.AdaptedQuestionServiceInterface;
import com.mateco.reportgenerator.service.ImageServiceInterface;
import com.mateco.reportgenerator.service.MainQuestionServiceInterface;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/main-question")
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
  public ResponseEntity<PageOutputDto<MainQuestionOutputDto>> findAllMainQuestions(
      @RequestParam(required = false, defaultValue = "0") int pageNumber,
      @RequestParam(required = false, defaultValue = "20") int pageSize,
      @RequestParam(required = false) String query
  ) {
    Page<MainQuestion> questionsPage = mainQuestionService.findAllMainQuestions(pageNumber, pageSize, query);
    return ResponseEntity
        .status(HttpStatus.OK)
        .body(PageOutputDto.parseDto(
            questionsPage,
            MainQuestionOutputDto::parseDto
        ));
  }

  @PostMapping("filter")
  public ResponseEntity<PageOutputDto<MainQuestionOutputDto>> findAllFilteredMainQuestions(
      @RequestParam(required = false, defaultValue = "0") int pageNumber,
      @RequestParam(required = false, defaultValue = "20") int pageSize,
      @RequestParam(required = false) String query,
      @RequestBody(required = false) MainQuestionListInputDto excludedQuestions
  ) {
    Page<MainQuestion> questionsPage = mainQuestionService
        .findAllFilteredMainQuestions(pageNumber, pageSize, query, excludedQuestions.mainQuestionsId());
    return ResponseEntity
        .status(HttpStatus.OK)
        .body(PageOutputDto.parseDto(
            questionsPage,
            MainQuestionOutputDto::parseDto
        ));
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
      @RequestPart("mainQuestionInputDto") QuestionInputDto mainQuestionInputDto,
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

  @GetMapping("/{mainQuestionId}/adapted-question")
  public ResponseEntity<List<AdaptedQuestionOutputDto>> findAllAdaptedQuestionsFromMainQuestion(
      @PathVariable UUID mainQuestionId
  ) {
    return ResponseEntity
        .status(HttpStatus.OK)
        .body(AdaptedQuestionOutputDto
            .parseDto(adaptedQuestionService.findAllAdaptedQuestionFromMainQuestion(mainQuestionId)));
  }

  @GetMapping("/{mainQuestionId}/adapted-question/{adaptedQuestionId}")
  public ResponseEntity<AdaptedQuestionOutputDto> findAdaptedQuestionFromMainQuestionById(
      @PathVariable UUID mainQuestionId,
      @PathVariable UUID adaptedQuestionId
  ) {
    return ResponseEntity
        .status(HttpStatus.OK)
        .body(AdaptedQuestionOutputDto
            .parseDto(adaptedQuestionService.findAdaptedQuestionsFromMainQuestionById(mainQuestionId, adaptedQuestionId)));
  }

  @PostMapping("/{mainQuestionId}/adapted-question")
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

  @PutMapping("/{mainQuestionId}/adapted-question/{adaptedQuestionId}")
  public ResponseEntity<AdaptedQuestionOutputDto> updateAdaptedQuestionOfMainQuestionById(
      @PathVariable UUID mainQuestionId,
      @PathVariable UUID adaptedQuestionId,
      @RequestPart("adaptedQuestionInputDto") QuestionInputDto questionInputDto,
      @RequestPart(value = "images", required = false) List<MultipartFile> images
  ) throws IOException {
    List<String> questionImages = imageService.uploadImages(images);

    AdaptedQuestion updatedQuestion = adaptedQuestionService
        .updateAdaptedQuestionOfMainQuestionById(
            mainQuestionId,
            adaptedQuestionId,
            AdaptedQuestion.parseAdaptedQuestion(questionInputDto),
            questionImages
        );
    return ResponseEntity
        .status(HttpStatus.OK)
        .body(AdaptedQuestionOutputDto.parseDto(updatedQuestion));
  }

  @DeleteMapping("/{mainQuestionId}/adapted-question/{adaptedQuestionId}")
  public ResponseEntity<Void> deleteAdaptedQuestionFromMainQuestionById(
      @PathVariable UUID mainQuestionId,
      @PathVariable UUID adaptedQuestionId
  ) {
    mainQuestionService.removeAdaptedQuestion(mainQuestionId, adaptedQuestionId);
    return ResponseEntity
        .status(HttpStatus.NO_CONTENT)
        .build();
  }

  @PatchMapping("/{mainQuestionId}/subject")
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
  public ResponseEntity<MainQuestionOutputDto> removeSubjectFromMainQUestion(
      @PathVariable UUID mainQuestionId,
      @RequestBody SubjectListInputDto subjectIdList
  ) {
    MainQuestion mainQuestionUpdated = mainQuestionService
        .removeSubject(mainQuestionId, subjectIdList.subjectsId());
    return ResponseEntity
        .status(HttpStatus.OK)
        .body(MainQuestionOutputDto.parseDto(mainQuestionUpdated));
  }
}
