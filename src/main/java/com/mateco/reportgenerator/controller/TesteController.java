package com.mateco.reportgenerator.controller;

import com.mateco.reportgenerator.model.entity.StudentMockExamResponse;
import com.mateco.reportgenerator.service.FileServiceInterface;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import org.apache.poi.ss.usermodel.DataFormatter;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.apache.poi.ss.usermodel.Workbook;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/tests")
public class TesteController {
  private final FileServiceInterface fileService;

  @Autowired
  public TesteController(FileServiceInterface fileService) {
    this.fileService = fileService;
  }

  @PostMapping
  public ResponseEntity<Object> xlsxReader(
      @RequestPart("studentsMockExamsAnswers") MultipartFile studentsAnswer
  ) throws IOException {

    return ResponseEntity.ok().body(fileService.xlsxReader(studentsAnswer));
  }

}
