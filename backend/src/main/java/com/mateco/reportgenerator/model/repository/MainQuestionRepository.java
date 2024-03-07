package com.mateco.reportgenerator.model.repository;

import com.mateco.reportgenerator.model.entity.MainQuestion;
import com.mateco.reportgenerator.model.entity.Subject;
import java.util.UUID;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Repository;

/**
 * Repository - assinatura dos métodos CRUD para a entidade
 *              MainQuestion.
 */
@Repository
public interface MainQuestionRepository extends JpaRepository<MainQuestion, UUID> {
  @NonNull
  Page<MainQuestion> findAll(@NonNull Pageable pageable);
}
