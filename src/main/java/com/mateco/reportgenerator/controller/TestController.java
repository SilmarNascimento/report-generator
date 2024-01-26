package com.mateco.reportgenerator.controller;

import com.mateco.reportgenerator.controller.dto.AlternativeInputDto;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/tests")
public class TestController {
  @PostMapping
  public ResponseEntity<List<Map<String, Object>>> routTest(
      @RequestParam("objects[0].description") String description1,
      @RequestParam("objects[0].image") MultipartFile image1,
      @RequestParam("objects[0].questionAnswer") boolean questionAnswer1,
      @RequestParam("objects[1].description") String description2,
      @RequestParam("objects[1].image") MultipartFile image2,
      @RequestParam("objects[1].questionAnswer") boolean questionAnswer2
  ) throws IOException {
    // Processar os objetos MultipartFile e criar uma representação adequada para a resposta JSON

    List<Map<String, Object>> response = new ArrayList<>();

    response.add(createResponseMap(description1, image1, questionAnswer1));
    response.add(createResponseMap(description2, image2, questionAnswer2));

    return ResponseEntity
        .status(HttpStatus.OK)
        .body(response);
  }

  private Map<String, Object> createResponseMap(String description, MultipartFile image, boolean questionAnswer)
      throws IOException {
    Map<String, Object> responseMap = new HashMap<>();
    responseMap.put("description", description);

    // Criar uma representação adequada para o arquivo de imagem
    Map<String, Object> imageMap = new HashMap<>();
    imageMap.put("contentType", image.getContentType());
    imageMap.put("name", image.getName());
    imageMap.put("bytes", image.getBytes()); // Este é um exemplo; você pode querer converter para Base64 ou outro formato adequado
    imageMap.put("empty", image.isEmpty());
    imageMap.put("size", image.getSize());

    responseMap.put("image", Collections.singletonList(imageMap));
    responseMap.put("questionAnswer", questionAnswer);

    return responseMap;
  }

}
