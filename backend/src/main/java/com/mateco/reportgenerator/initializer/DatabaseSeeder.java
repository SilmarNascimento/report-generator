package com.mateco.reportgenerator.initializer;

import com.mateco.reportgenerator.model.entity.Alternative;
import com.mateco.reportgenerator.model.entity.MainQuestion;
import com.mateco.reportgenerator.model.entity.Subject;
import com.mateco.reportgenerator.model.repository.MainQuestionRepository;
import com.mateco.reportgenerator.model.repository.MockExamRepository;
import com.mateco.reportgenerator.model.repository.SubjectRepository;
import java.util.ArrayList;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Component;

@Profile("!test")
@Component
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
    // seedSubjects();
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
    Subject subject = new Subject("Conjuntos");
    subjectRepository.save(subject);

    subject = new Subject("Sequência");
    subjectRepository.save(subject);

    subject = new Subject("Progressão Aritmética");
    subjectRepository.save(subject);

    subject = new Subject("Progessão Geométrica");
    subjectRepository.save(subject);

    subject = new Subject("Matemática Financeira");
    subjectRepository.save(subject);

    subject = new Subject("Juros Simples");
    subjectRepository.save(subject);

    subject = new Subject("Juros Compostos");
    subjectRepository.save(subject);

    subject = new Subject("Análise Combinatória");
    subjectRepository.save(subject);

    subject = new Subject("Arranjo");
    subjectRepository.save(subject);

    subject = new Subject("Combinação");
    subjectRepository.save(subject);

    subject = new Subject("Permutação");
    subjectRepository.save(subject);

    subject = new Subject("Probabilidade");
    subjectRepository.save(subject);

    subject = new Subject("Estatística");
    subjectRepository.save(subject);

    subject = new Subject("Matrizes");
    subjectRepository.save(subject);

    subject = new Subject("Tabela");
    subjectRepository.save(subject);

    subject = new Subject("Sentenças Matemáticas");
    subjectRepository.save(subject);

    subject = new Subject("Funções");
    subjectRepository.save(subject);

    subject = new Subject("Função do 1º Grau");
    subjectRepository.save(subject);

    subject = new Subject("Função do 2º Grau");
    subjectRepository.save(subject);

    subject = new Subject("Gráficos");
    subjectRepository.save(subject);

    subject = new Subject("Lei da Função");
    subjectRepository.save(subject);

    subject = new Subject("Coeficiente Angular");
    subjectRepository.save(subject);

    subject = new Subject("Regra de Três");
    subjectRepository.save(subject);

    subject = new Subject("Vértice");
    subjectRepository.save(subject);

    subject = new Subject("Receita, Custo, Lucro");
    subjectRepository.save(subject);

    subject = new Subject("Função Exponencial");
    subjectRepository.save(subject);

    subject = new Subject("Logaritmo");
    subjectRepository.save(subject);

    subject = new Subject("Matemática Básica");
    subjectRepository.save(subject);

    subject = new Subject("Frações");
    subjectRepository.save(subject);

    subject = new Subject("Porcentagem");
    subjectRepository.save(subject);

    subject = new Subject("Números Decimais");
    subjectRepository.save(subject);

    subject = new Subject("Conversão de Unidades");
    subjectRepository.save(subject);

    subject = new Subject("Geometria");
    subjectRepository.save(subject);

    subject = new Subject("Geometria Plana");
    subjectRepository.save(subject);

    subject = new Subject("Geometria Espacial");
    subjectRepository.save(subject);

    subject = new Subject("Plano Cartesiano");
    subjectRepository.save(subject);

    subject = new Subject("Identificação de Figuras");
    subjectRepository.save(subject);

    subject = new Subject("Movimentação no Espaço");
    subjectRepository.save(subject);

    subject = new Subject("Projeção Ortogonal");
    subjectRepository.save(subject);

    subject = new Subject("Trigonometria");
    subjectRepository.save(subject);

    subject = new Subject("Teorema de Pitágoras");
    subjectRepository.save(subject);

    subject = new Subject("Comparação de Volumes");
    subjectRepository.save(subject);

    subject = new Subject("Razão e Proporção");
    subjectRepository.save(subject);

    subject = new Subject("Comparação de Razões");
    subjectRepository.save(subject);

    subject = new Subject("Escala");
    subjectRepository.save(subject);

    subject = new Subject("Grandezas Proporcionais");
    subjectRepository.save(subject);
  }

  private void seedMainQuestion() {

  }
}
