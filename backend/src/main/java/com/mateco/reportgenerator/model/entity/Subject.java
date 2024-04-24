package com.mateco.reportgenerator.model.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.mateco.reportgenerator.controller.dto.subjectDto.SubjectInputDto;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.Table;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "subjects")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Subject {
  @Id
  @GeneratedValue(generator = "UUID")
  private UUID id;

  @Column(unique = true)
  private String name;

  @ManyToMany(mappedBy = "subjects")
  @JsonIgnore
  private List<MainQuestion> mainQuestions;

  @ManyToMany(mappedBy = "subjects")
  @JsonIgnore
  private List<MockExam> mockExams;

  public Subject(String name) {
    this.name = name;
  }

  public static Subject parseSubject(SubjectInputDto inputDto) {
    return new Subject(inputDto.name());
  }

  @Override
  public String toString() {
    return "{" +
        "id: " + this.getId() +
        "name: " + this.name +
        '}';
  }

  public static List<Subject> parseSubject(List<SubjectInputDto> subjectInputDtos) {
    if (subjectInputDtos == null) {
      return new ArrayList<>();
    }
    return subjectInputDtos.stream()
        .map((SubjectInputDto inputDto) -> new Subject(inputDto.name()))
        .toList();
  }
}
