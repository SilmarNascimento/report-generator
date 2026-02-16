package com.mateco.reportgenerator.model.repository;

import com.mateco.reportgenerator.model.entity.Student;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import java.util.Optional;

public interface StudentRepository extends JpaRepository<Student, Long>, JpaSpecificationExecutor<Student> {
    boolean existsByCpf(String cpf);

    Optional<Student> findByUserEmail(String email);
}