package com.mateco.reportgenerator.model.repository;

import com.mateco.reportgenerator.model.entity.Alternative;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

/**
 * Repository - assinatura dos métodos CRUD para a entidade
 *              Alternatives.
 */
@Repository
public interface AlternativeRespository extends JpaRepository<Alternative, UUID> {

}
