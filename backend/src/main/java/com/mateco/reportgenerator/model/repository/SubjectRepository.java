package com.mateco.reportgenerator.model.repository;

import com.mateco.reportgenerator.model.entity.Subject;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Repository;

/**
 * Repository - assinatura dos métodos CRUD para a entidade
 *              subject.
 */
@Repository
public interface SubjectRepository extends JpaRepository<Subject, UUID> {
  @NonNull
  Page<Subject> findAll(@NonNull Pageable pageable);
  Optional<Subject> findByName(String name);
  List<Subject> findAllByNameIn(List<String> subjectName);
}