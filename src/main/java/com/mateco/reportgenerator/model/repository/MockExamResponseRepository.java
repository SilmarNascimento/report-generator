package com.mateco.reportgenerator.model.repository;

import com.mateco.reportgenerator.model.entity.MockExamResponse;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MockExamResponseRepository extends JpaRepository<MockExamResponse, UUID> {

}
