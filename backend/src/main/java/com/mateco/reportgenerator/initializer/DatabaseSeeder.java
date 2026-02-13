package com.mateco.reportgenerator.initializer;

import com.mateco.reportgenerator.model.entity.Alternative;
import com.mateco.reportgenerator.model.entity.MainQuestion;
import com.mateco.reportgenerator.model.entity.Subject;
import com.mateco.reportgenerator.model.repository.MainQuestionRepository;
import com.mateco.reportgenerator.model.repository.MockExamRepository;
import com.mateco.reportgenerator.model.repository.SubjectRepository;
import java.util.ArrayList;
import java.util.List;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Component;

@Profile("!test")
@Component
@Slf4j
public class DatabaseSeeder implements CommandLineRunner {
  private final SubjectRepository subjectRepository;
  private final MainQuestionRepository mainQuestionRepository;
  private final MockExamRepository mockExamRepository;

  @Autowired
  public DatabaseSeeder(
      SubjectRepository subjectRepository,
      MainQuestionRepository mainQuestionRepository,
      MockExamRepository mockExamRepository
  ) {
    this.subjectRepository = subjectRepository;
    this.mainQuestionRepository = mainQuestionRepository;
    this.mockExamRepository = mockExamRepository;
  }

  @Override
  public void run(String... args) throws Exception {
    //seedSubjects();
    // seedMainQuestions();
  }

  /*
  private void seedMainQuestions() {
    Alternative alternativeA = new Alternative(
        "3,5%.",
        new ArrayList<>(),
        false
    );
    Alternative alternativeB = new Alternative(
        "4,0%.",
        new ArrayList<>(),
        false
    );
    Alternative alternativeC = new Alternative(
        "4,5%.",
        new ArrayList<>(),
        false
    );
    Alternative alternativeD = new Alternative(
        "5,0%.",
        new ArrayList<>(),
        false
    );
    Alternative alternativeE = new Alternative(
        "5,5%.",
        new ArrayList<>(),
        true
    );
    List<Alternative> alternatives = List.of(alternativeA, alternativeB, alternativeC, alternativeD, alternativeE);

    MainQuestion mainQuestion = new MainQuestion(
      "Em uma concessionária de automóveis, uma motocicleta custa à vista R$ 10.000,00. Esse valor também pode ser pago a prazo, sem juros, em duas parcelas de R$ 5.000,00, sendo a primeira um mês após a compra e a segunda dois meses após a compra.Um cliente tem o valor de R$ 10.000,00 em uma aplicação que rende juros de 2% ao mês. Ele decide manter esse valor aplicado e, ao final do primeiro mês, retira apenas R$ 5.000,00 para pagar a primeira parcela. Um mês depois, retira R$ 5.000,00 e faz o pagamento da segunda parcela. Isso equivale a ter um desconto no ato da compra.Esse desconto, em percentual, está mais próximo de:",
      new ArrayList<>(),
      "Fácil",
      new ArrayList<>(),
      alternatives,
      new ArrayList<>(),
      new ArrayList<>(),
      new ArrayList<>()
    );
    mainQuestionRepository.save(mainQuestion);
  }
  */

  private void seedSubjects() {
    List<Subject> subjects = List.of(
            new Subject("ANÁLISE COMBINATÓRIA", 0.260),
            new Subject("ANÁLISE DE GRÁFICOS", 0.950),
            new Subject("CONJUNTOS", 0.099),
            new Subject("ESTATÍSTICA", 1.000),
            new Subject("FUNÇÃO DO 1º GRAU", 0.998),
            new Subject("FUNÇÃO DO 2º GRAU", 0.310),
            new Subject("FUNÇÃO EXPONENCIAL", 0.300),
            new Subject("GEOMETRIA ESPACIAL", 0.900),
            new Subject("GEOMETRIA PLANA", 0.899),
            new Subject("LOGARITMO", 0.240),
            new Subject("LÓGICA E ARITMÉTICA", 0.999),
            new Subject("MATEMÁTICA FINANCEIRA", 0.250),
            new Subject("MATRIZES", 0.100),
            new Subject("PERCEPÇÕES TRIDIMENSIONAIS", 0.902),
            new Subject("PROBABILIDADE", 0.400),
            new Subject("RAZÃO E PROPORÇÃO", 0.901),
            new Subject("SEQUÊNCIAS", 0.290),
            new Subject("TRIGONOMETRIA", 0.500)
    );

    // Salva todos os assuntos de uma vez para melhor performance
    subjectRepository.saveAll(subjects);
  }

  private void seedMainQuestion() {

  }
}
