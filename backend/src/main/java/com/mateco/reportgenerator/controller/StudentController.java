package com.mateco.reportgenerator.controller;

import com.mateco.reportgenerator.controller.dto.BatchDeleteInputDto;
import com.mateco.reportgenerator.controller.dto.pagination.PageResponse;
import com.mateco.reportgenerator.controller.dto.student.StudentFilter;
import com.mateco.reportgenerator.controller.dto.student.StudentImportResultDto;
import com.mateco.reportgenerator.controller.dto.student.StudentRequestDto;
import com.mateco.reportgenerator.controller.dto.student.StudentResponseDto;
import com.mateco.reportgenerator.service.StudentImportServiceInterface;
import com.mateco.reportgenerator.service.implementation.StudentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.SortDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/students")
@RequiredArgsConstructor
public class StudentController {

    private final StudentService studentService;
    private final StudentImportServiceInterface studentImportService;

    @PostMapping
    public ResponseEntity<StudentResponseDto> create(@RequestBody @Valid StudentRequestDto dto) {
        StudentResponseDto response = studentService.create(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PostMapping(value = "/import", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<StudentImportResultDto> importStudents(
            @RequestPart("studentsFile") MultipartFile studentsFile
    ) {
        StudentImportResultDto result = studentImportService.importStudents(studentsFile);
        HttpStatus status = result.hasErrors() ? HttpStatus.UNPROCESSABLE_ENTITY : HttpStatus.CREATED;
        
        return ResponseEntity.status(status).body(result);
    }

    @GetMapping
    public ResponseEntity<PageResponse<StudentResponseDto>> findAll(
            StudentFilter filter,
            @RequestParam(required = false, defaultValue = "0") int pageNumber,
            @RequestParam(required = false, defaultValue = "10") int pageSize,
            @SortDefault(sort = "user.name", direction = Sort.Direction.ASC) Sort sort
    ) {
        Pageable pageable = PageRequest.of(pageNumber, pageSize, sort);
        return ResponseEntity.ok(studentService.findAll(filter, pageable));
    }

    @GetMapping("/{id}")
    public ResponseEntity<StudentResponseDto> findById(@PathVariable Long id) {
        StudentResponseDto dto = studentService.findById(id);
        return ResponseEntity.ok(dto);
    }

    @PutMapping("/{id}")
    public ResponseEntity<StudentResponseDto> update(
            @PathVariable Long id,
            @RequestBody @Valid StudentRequestDto dto
    ) {
        StudentResponseDto response = studentService.update(id, dto);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        studentService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/batch")
    public ResponseEntity<Void> deleteAllByIds(@RequestBody BatchDeleteInputDto dto) {
        List<Long> longIds = dto.ids().stream()
                .map(Long::parseLong)
                .toList();
        studentService.deleteAllByIds(longIds);
        return ResponseEntity.noContent().build();
    }
}