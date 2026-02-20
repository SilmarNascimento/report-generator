package com.mateco.reportgenerator.model.repository;

import com.mateco.reportgenerator.model.entity.MockExamResponse;
import java.util.UUID;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface MockExamResponseRepository extends JpaRepository<MockExamResponse, UUID> {
  @Query("SELECT response FROM MockExamResponse response WHERE response.name LIKE %:query% OR response.email LIKE %:query%")
  Page<MockExamResponse> findByQuery(@Param("query") String query, Pageable pageable);
}
