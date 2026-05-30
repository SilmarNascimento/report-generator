package com.mateco.reportgenerator.model.repository;

import com.mateco.reportgenerator.model.entity.Subject;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Repository;

/**
 * Repository - assinatura dos métodos CRUD para a entidade
 *              subject.
 */
@Repository
public interface SubjectRepository extends JpaRepository<Subject, UUID> {
  @NonNull
  @Query("SELECT subject FROM Subject subject WHERE (:query IS NULL OR subject.name ILIKE CONCAT('%', :query, '%')) ORDER BY subject.name ASC")
  Page<Subject> findAllOrderByName(@NonNull Pageable pageable, String query);

  @NonNull
  @Query("SELECT subject FROM Subject subject WHERE (:query IS NULL OR subject.name ILIKE CONCAT('%', :query, '%')) AND (subject.id NOT IN :excludedSubjects) ORDER BY subject.name ASC")
  Page<Subject> findAllOrderByName(@NonNull Pageable pageable, String query, List<UUID> excludedSubjects);

  Optional<Subject> findByNameIgnoreCase(String name);

  List<Subject> findAllByNameInIgnoreCase(List<String> subjectName);
}
