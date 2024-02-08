package com.mateco.reportgenerator.model.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.mateco.reportgenerator.controller.dto.SubjectInputDto;
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

  private String name;

  @ManyToMany(mappedBy = "subjects")
  @JsonIgnore
  private List<MainQuestion> mainQuestions;

  public Subject(String name) {
    this.name = name;
  }

  public static Subject parseSubject(SubjectInputDto inputDto) {
    return new Subject(inputDto.name());
  }

  @Override
  public String toString() {
    return "Subject {" +
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
