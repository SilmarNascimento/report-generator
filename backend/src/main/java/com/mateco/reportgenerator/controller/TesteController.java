package com.mateco.reportgenerator.controller;

import com.mateco.reportgenerator.controller.dto.mockExamDto.MockExamWithFileOutputDto;
import com.mateco.reportgenerator.model.entity.FileEntity;
import com.mateco.reportgenerator.model.entity.MockExam;
import com.mateco.reportgenerator.model.repository.FileEntityRepository;
import com.mateco.reportgenerator.service.MockExamServiceInterface;
import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.apache.pdfbox.multipdf.PDFMergerUtility;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/*
@RestController
@RequestMapping("/tests")
@RequiredArgsConstructor
public class TesteController {
  private final FileEntityRepository fileEntityRepository;
  private final MockExamServiceInterface mockExamService;

  @GetMapping("/{mockExamId}")
  public ResponseEntity<MockExamWithFileOutputDto> findCompleteMockExamById(
      @PathVariable UUID mockExamId
  ) throws IOException {
    MockExam mockExam = mockExamService.findMockExamById(mockExamId);

    List<FileEntity> pdfFiles = new ArrayList<>();
    pdfFiles.add(mockExam.getCoverPdfFile());
    pdfFiles.add(mockExam.getMatrixPdfFile());
    pdfFiles.add(mockExam.getAnswersPdfFile());

    try {
      PDDocument mergedPDFDocument = mergePDFs(pdfFiles);
      mergedPDFDocument.save("C:\\Users\\USUARIO\\Desktop\\teste.pdf");
      mergedPDFDocument.close();
    } catch (IOException e) {
      e.printStackTrace();
    }

    return ResponseEntity
        .status(HttpStatus.OK)
        .body(MockExamWithFileOutputDto
            .parseDto(mockExam));
  }

  public PDDocument mergePDFs(List<FileEntity> fileEntities) throws IOException {
    PDFMergerUtility pdfMerger = new PDFMergerUtility();
    PDDocument mergedDocument = new PDDocument();

    for (FileEntity fileEntity : fileEntities) {
      byte[] pdfBytes = fileEntity.getFileContent().getContent();
      ByteArrayInputStream byteArrayInputStream = new ByteArrayInputStream(pdfBytes);
      PDDocument document = PDDocument.load(byteArrayInputStream);

      pdfMerger.appendDocument(mergedDocument, document);
      document.close();
    }

    return mergedDocument;
  }
}*/

