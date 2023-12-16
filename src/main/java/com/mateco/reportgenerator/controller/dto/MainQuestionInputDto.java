package com.mateco.reportgenerator.controller.dto;

import com.mateco.reportgenerator.model.entity.AdaptedQuestion;
import com.mateco.reportgenerator.model.entity.Alternative;
import com.mateco.reportgenerator.model.entity.Handout;
import com.mateco.reportgenerator.model.entity.MockExam;
import com.mateco.reportgenerator.model.entity.Subject;
import java.util.List;


public record MainQuestionInputDto(
    String title,
    List<SubjectInputDto> subjects,
    String level,
    String image,
    List<AlternativeInputDto> alternatives,
    AlternativeInputDto answer,
    List<AdaptedQuestion> adaptedQuestions,
    List<MockExam> mockExams,
    List<Handout> handout
) {

}
