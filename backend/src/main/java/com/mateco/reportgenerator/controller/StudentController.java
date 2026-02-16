package com.mateco.reportgenerator.controller;

import com.mateco.reportgenerator.controller.dto.pagination.PageResponse;
import com.mateco.reportgenerator.controller.dto.student.StudentFilter;
import com.mateco.reportgenerator.controller.dto.student.StudentRequestDto;
import com.mateco.reportgenerator.controller.dto.student.StudentResponseDto;
import com.mateco.reportgenerator.service.implementation.StudentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/students")
@RequiredArgsConstructor
public class StudentController {

    private final StudentService studentService;

    @PostMapping
    public ResponseEntity<StudentResponseDto> create(@RequestBody @Valid StudentRequestDto dto) {
        StudentResponseDto response = studentService.create(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping
    public ResponseEntity<PageResponse<StudentResponseDto>> findAll(
            StudentFilter filter,
            @PageableDefault(size = 10, sort = "user.name", direction = Sort.Direction.ASC)
            Pageable pageable
    ) {
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
}