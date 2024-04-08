package com.mateco.reportgenerator.initializer;

import com.mateco.reportgenerator.model.entity.Subject;
import com.mateco.reportgenerator.model.repository.MainQuestionRepository;
import com.mateco.reportgenerator.model.repository.MockExamRepository;
import com.mateco.reportgenerator.model.repository.SubjectRepository;
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
    seedSubjects();
  }

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
