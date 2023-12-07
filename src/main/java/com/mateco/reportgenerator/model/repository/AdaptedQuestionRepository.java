package com.mateco.reportgenerator.model.repository;

import com.mateco.reportgenerator.model.entity.AdaptedQuestion;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

/**
 * Repository - assinatura dos métodos CRUD para a entidade
 *              AdaptedQuestion.
 */
@Repository
public interface AdaptedQuestionRepository extends JpaRepository<AdaptedQuestion, UUID> {

}
