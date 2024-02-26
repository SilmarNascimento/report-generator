package com.mateco.reportgenerator.model.repository;

import com.mateco.reportgenerator.model.entity.MockExam;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

/**
 * Repository - assinatura dos métodos CRUD para a entidade
 *              MockExam.
 */
@Repository
public interface MockExamRepository extends JpaRepository<MockExam, UUID> {

}
