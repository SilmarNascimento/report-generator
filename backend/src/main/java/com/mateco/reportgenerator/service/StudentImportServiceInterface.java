package com.mateco.reportgenerator.service;

import com.mateco.reportgenerator.controller.dto.student.StudentImportResultDto;
import org.springframework.web.multipart.MultipartFile;

public interface StudentImportServiceInterface {
  StudentImportResultDto importStudents(MultipartFile studentsFile);
}
