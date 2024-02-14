package com.mateco.reportgenerator.model.entity;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

public record StudentResponseEntry(
    String name,
    String email,
    int correctAnswers,
    int questionsNumber,
    Map<Integer, String> answers,
    String comment,
    LocalDateTime createdAt
) {
  public static List<StudentResponseEntry> parseEntry(List<List<String>> studentsResponse) {
    return studentsResponse.stream()
        .map(studentResponse -> {
          DateTimeFormatter formatter = DateTimeFormatter.ofPattern("M/d/yy H:mm");

          String name = studentResponse.get(3);
          String email = studentResponse.get(1);
          String createdAt = studentResponse.get(0);
          String comment = studentResponse.get(49);
          List<String> studentAnswers = studentResponse.subList(4,49);

          final int[] initialKey = {136};

          Map<Integer, String> answers = studentAnswers.stream()
              .collect(Collectors.toMap(
                  answer -> initialKey[0]++,
                  answer -> answer
              ));

          return new StudentResponseEntry(
              name,
              email,
              0,
              studentAnswers.size(),
              answers,
              comment,
              LocalDateTime.parse(createdAt, formatter)
          );
        })
        .collect(Collectors.toList());
  }
}
