package com.mateco.reportgenerator.controller;

import com.mateco.reportgenerator.model.entity.StudentResponseEntry;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import org.apache.poi.ss.usermodel.DataFormatter;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.apache.poi.ss.usermodel.Workbook;
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
  @PostMapping
  public ResponseEntity<Object> xlsxReader(
      @RequestPart("studentsMockExamsAnswers") MultipartFile studentsAnswer
  ) throws IOException {
    try (Workbook workbook = new XSSFWorkbook(studentsAnswer.getInputStream())) {
      Sheet allStudentsAnswers = workbook.getSheetAt(0);
      List<List<String>> response = new ArrayList<>();

      // Use DataFormatter to format cell values as Strings
      DataFormatter dataFormatter = new DataFormatter();

      // Use forEach methods to iterate over rows and cells
      allStudentsAnswers.forEach(row -> {
        if (row.getRowNum() == 0) {
          return;
        }
        List<String> studentRecord = new ArrayList<>();
        row.forEach(cell -> {
          studentRecord.add(dataFormatter.formatCellValue(cell));
        });
        response.add(studentRecord);
      });

      return ResponseEntity.ok().body(StudentResponseEntry.parseEntry(response));
    } catch (IOException e) {
      // Handle IOException
      return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error reading file");
    }
  }

}
