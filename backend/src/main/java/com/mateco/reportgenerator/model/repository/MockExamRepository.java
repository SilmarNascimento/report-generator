package com.mateco.reportgenerator.model.repository;

import com.mateco.reportgenerator.model.entity.MockExam;
import java.util.List;
import java.util.UUID;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Repository;

@Repository
public interface MockExamRepository extends JpaRepository<MockExam, UUID> {
  @NonNull
  Page<MockExam> findAll(@NonNull Pageable pageable);

  @Query("SELECT DISTINCT m.releasedYear FROM MockExam m ORDER BY m.releasedYear DESC")
  List<Integer> findDistinctReleasedYears();
}
