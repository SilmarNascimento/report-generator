package com.mateco.reportgenerator.model.repository;

import com.mateco.reportgenerator.model.entity.MockExamResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.UUID;

public interface MockExamResponseRepository extends JpaRepository<MockExamResponse, UUID> {
    @Query("SELECT response FROM MockExamResponse response " +
            "WHERE response.name ILIKE CONCAT('%', :query, '%') " +
            "OR response.email ILIKE CONCAT('%', :query, '%') " +
            "OR response.mockExam.name ILIKE CONCAT('%', :query, '%')" +
            "OR response.mockExam.examCode ILIKE CONCAT('%', :query, '%')")
    Page<MockExamResponse> findByQuery(@Param("query") String query, Pageable pageable);

    List<MockExamResponse> findAllByNameOrderByCreatedAtAsc(String name);
}
