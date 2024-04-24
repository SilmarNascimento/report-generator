
package com.mateco.reportgenerator.controller;

import com.mateco.reportgenerator.controller.dto.mockExamDto.MockExamOutpuDto;
import com.mateco.reportgenerator.model.entity.Alternative;
import com.mateco.reportgenerator.model.entity.MainQuestion;
import com.mateco.reportgenerator.model.entity.MockExam;
import com.mateco.reportgenerator.model.entity.Subject;
import com.mateco.reportgenerator.service.MockExamServiceInterface;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/tests")
public class TesteController {

  @GetMapping
  public ResponseEntity<MockExam> getMockExam() {
    UUID mockExamId02 = UUID.randomUUID();
    UUID mockSubjectId01 = UUID.randomUUID();
    UUID mockSubjectId02 = UUID.randomUUID();
    UUID mockMainQuestionId01 = UUID.randomUUID();
    UUID mockMainQuestionId02 = UUID.randomUUID();

    Subject mockSubject01 = new Subject("Geometria");
    mockSubject01.setId(mockSubjectId01);
    Subject mockSubject02 = new Subject("Algebra");
    mockSubject02.setId(mockSubjectId02);

    Alternative mockFalseAlternative = new Alternative(
        "descrição da alternativa 01",
        List.of("imagem alternativa 01"),
        false
    );
    Alternative mockTrueAlternative = new Alternative(
        "descrição da alternativa 02",
        List.of("imagem alternativa 02"),
        true
    );

    MainQuestion mockMainQuestion01 = new MainQuestion(
        "título questão 01",
        new ArrayList<>(),
        "difícil",
        List.of("imagem da questão 01"),
        List.of(mockTrueAlternative, mockFalseAlternative),
        new ArrayList<>(),
        new ArrayList<>(),
        new ArrayList<>()
    );
    mockMainQuestion01.setId(mockMainQuestionId01);

    MainQuestion mockMainQuestion02 = new MainQuestion(
        "título questão 02",
        List.of(mockSubject01, mockSubject02),
        "difícil",
        List.of("imagem da questão 02"),
        List.of(mockFalseAlternative, mockTrueAlternative),
        new ArrayList<>(),
        new ArrayList<>(),
        new ArrayList<>()
    );
    mockMainQuestion02.setId(mockMainQuestionId02);

    MockExam mockExam02 = new MockExam(
        "segundo simulado",
        List.of("extensivo"),
        new ArrayList<>(),
        2024,
        1
    );
    mockExam02.setId(mockExamId02);
    mockExam02.getSubjects().addAll(List.of(mockSubject01, mockSubject02));
    System.out.println(mockExam02.getMockExamQuestions().containsKey(136));
    System.out.println(mockExam02.getMockExamQuestions().containsKey(137));

    mockExam02.getMockExamQuestions().put(136, mockMainQuestion01);
    mockExam02.getMockExamQuestions().put(137, mockMainQuestion02);

    System.out.println(mockExam02);
    System.out.println(MockExamOutpuDto.parseDto(mockExam02));
    return ResponseEntity.ok(mockExam02);
  }
}
