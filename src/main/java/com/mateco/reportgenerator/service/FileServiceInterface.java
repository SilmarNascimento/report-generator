package com.mateco.reportgenerator.service;

import com.mateco.reportgenerator.model.entity.StudentMockExamResponse;
import java.io.IOException;
import java.util.List;
import org.springframework.web.multipart.MultipartFile;

public interface FileServiceInterface {
  List<StudentMockExamResponse> xlsxReader(MultipartFile studentsResponse) throws IOException;
}
