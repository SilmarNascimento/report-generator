package com.mateco.reportgenerator.service;

import com.mateco.reportgenerator.model.entity.MockExamResponse;
import java.io.IOException;
import java.util.List;
import org.springframework.web.multipart.MultipartFile;

public interface FileServiceInterface {
  List<MockExamResponse> xlsxReader(MultipartFile studentsResponse) throws IOException;
}
