package com.mateco.reportgenerator.model.repository;

import com.mateco.reportgenerator.model.entity.Handout;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

/**
 * Repository - assinatura dos métodos CRUD para a entidade
 *              Handout.
 */
@Repository
public interface HandoutRepository extends JpaRepository<Handout, UUID> {

}
