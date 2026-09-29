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

    @Query("SELECT r FROM MockExamResponse r WHERE r.mockExam.releasedYear = :year")
    List<MockExamResponse> findByMockExamYear(@Param("year") int year);

    @Query("SELECT r FROM MockExamResponse r WHERE r.mockExam.releasedYear = :year AND r.mockExam.id IN :mockExamIds")
    List<MockExamResponse> findByMockExamYearAndIdIn(
            @Param("year") int year,
            @Param("mockExamIds") List<UUID> mockExamIds
    );

    @Query("SELECT r FROM MockExamResponse r WHERE r.student.id = :studentId AND r.mockExam.releasedYear = :year")
    List<MockExamResponse> findByStudentIdAndMockExamYear(
            @Param("studentId") Long studentId,
            @Param("year") int year
    );

    @Query("SELECT r FROM MockExamResponse r WHERE r.student.id = :studentId AND r.mockExam.releasedYear = :year AND r.mockExam.id IN :mockExamIds")
    List<MockExamResponse> findByStudentIdAndMockExamYearAndIdIn(
            @Param("studentId") Long studentId,
            @Param("year") int year,
            @Param("mockExamIds") List<UUID> mockExamIds
    );
}
