package com.mateco.reportgenerator.model.repository;

import com.mateco.reportgenerator.model.entity.Alternative;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AlternativeRespository extends JpaRepository<Alternative, UUID> {

}
