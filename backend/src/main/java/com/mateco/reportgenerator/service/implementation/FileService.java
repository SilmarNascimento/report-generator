package com.mateco.reportgenerator.service.implementation;

import com.mateco.reportgenerator.model.entity.MockExamResponse;
import com.mateco.reportgenerator.service.FileServiceInterface;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.DataFormatter;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
public class FileService implements FileServiceInterface {
  @Override
  public List<MockExamResponse> xlsxReader(MultipartFile studentsResponse) throws IOException {
    try (Workbook workbook = new XSSFWorkbook(studentsResponse.getInputStream())) {
      Sheet mockExamResponse = workbook.getSheetAt(0);
      List<List<String>> allResponses = new ArrayList<>();

      DataFormatter dataFormatter = new DataFormatter();

      mockExamResponse.forEach(row -> {
        if (row.getRowNum() == 0) {
          return;
        }

        if (!isRowEmpty(row, dataFormatter)) {
          List<String> studentRecord = new ArrayList<>();
          row.forEach(cell -> studentRecord.add(dataFormatter.formatCellValue(cell).trim()));
          allResponses.add(studentRecord);
        }
      });

      return MockExamResponse.parseResponse(allResponses);
    } catch (IOException e) {
      throw new IOException(e.getMessage());
    }
  }

  private boolean isRowEmpty(Row row, DataFormatter dataFormatter) {
    for (Cell cell : row) {
      String cellValue = dataFormatter.formatCellValue(cell).trim();
      if (!cellValue.isEmpty()) {
        return false;
      }
    }
    return true;
  }
}
