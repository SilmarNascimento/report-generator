package com.mateco.reportgenerator.controller.dto.questionDto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class QuestionDetailDto {
    private Integer questionNumber;
    private String subject;
    private String difficulty;
    private String studentAnswer;
    private String correctAnswer;
    private String status;
    private Integer weight;
    private String pattern;
}