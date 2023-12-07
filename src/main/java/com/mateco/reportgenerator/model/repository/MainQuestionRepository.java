package com.mateco.reportgenerator.model.repository;

import com.mateco.reportgenerator.model.entity.MainQuestion;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

/**
 * Repository - assinatura dos métodos CRUD para a entidade
 *              MainQuestion.
 */
@Repository
public interface MainQuestionRepository extends JpaRepository<MainQuestion, UUID> {

}
