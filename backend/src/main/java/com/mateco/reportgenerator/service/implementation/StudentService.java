package com.mateco.reportgenerator.service.implementation;

import com.mateco.reportgenerator.controller.dto.pagination.PageResponse;
import com.mateco.reportgenerator.controller.dto.student.StudentFilter;
import com.mateco.reportgenerator.controller.dto.student.StudentRequestDto;
import com.mateco.reportgenerator.controller.dto.student.StudentResponseDto;
import com.mateco.reportgenerator.mapper.StudentMapper;
import com.mateco.reportgenerator.model.entity.Student;
import com.mateco.reportgenerator.model.repository.StudentRepository;
import com.mateco.reportgenerator.model.repository.UserRepository;
import com.mateco.reportgenerator.specifications.StudentSpecifications;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
@RequiredArgsConstructor
public class StudentService {

    private final StudentRepository studentRepository;
    private final UserRepository userRepository;
    private final StudentMapper studentMapper;

    @Transactional
    public StudentResponseDto create(StudentRequestDto dto) {
        if (userRepository.existsByEmail(dto.email())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Email já cadastrado");
        }

        if (studentRepository.existsByCpf(dto.cpf())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "CPF já cadastrado");
        }

        Student student = studentMapper.toEntity(dto);

        return studentMapper.toDto(studentRepository.save(student));
    }

    @Transactional(readOnly = true)
    public PageResponse<StudentResponseDto> findAll(StudentFilter filter, Pageable pageable) {
        Specification<Student> spec = StudentSpecifications.withFilter(filter);
        Page<Student> page = studentRepository.findAll(spec, pageable);
        return PageResponse.build(page.map(studentMapper::toDto));
    }

    @Transactional(readOnly = true)
    public StudentResponseDto findById(Long id) {
        return studentRepository.findById(id)
                .map(studentMapper::toDto)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Estudante não encontrado"));
    }

    @Transactional
    public StudentResponseDto update(Long id, StudentRequestDto dto) {
        Student student = studentRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Estudante não encontrado"));

        String emailAtual = student.getUser().getEmail();
        String novoEmail = dto.email();

        if (!emailAtual.equalsIgnoreCase(novoEmail) && userRepository.existsByEmail(novoEmail)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Email já cadastrado");
        }

        if (!student.getCpf().equals(dto.cpf()) && studentRepository.existsByCpf(dto.cpf())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "CPF já cadastrado");
        }

        studentMapper.updateEntity(dto, student);
        studentRepository.save(student);

        return studentMapper.toDto(student);
    }

    @Transactional
    public void delete(Long id) {
        if (!studentRepository.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Estudante não encontrado");
        }

        studentRepository.deleteById(id);
    }
}