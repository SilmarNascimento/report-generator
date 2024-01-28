package com.mateco.reportgenerator.controller;

import com.mateco.reportgenerator.service.ImageServiceInterface;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/tests")
public class TestController {
  private final ImageServiceInterface imageService;

  @Autowired
  public TestController(ImageServiceInterface imageService) {
    this.imageService = imageService;
  }

  @PostMapping
  public ResponseEntity<List<String>> routTest(
      @RequestParam("description") String description,
      @RequestParam(value = "images", required = false) List<MultipartFile> images
  ) throws IOException {

    List<String> response = new ArrayList<>();
    List<String> imagePath = imageService.uploadImages(images);
    response.add(description);
    response.addAll(imagePath);

    return ResponseEntity
        .status(HttpStatus.OK)
        .body(response);
  }

}
