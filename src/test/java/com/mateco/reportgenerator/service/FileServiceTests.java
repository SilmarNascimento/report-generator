package com.mateco.reportgenerator.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertInstanceOf;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;

import com.mateco.reportgenerator.model.entity.MockExam;
import com.mateco.reportgenerator.model.entity.MockExamResponse;
import com.mateco.reportgenerator.service.exception.NotFoundException;
import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.nio.file.Path;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import org.assertj.core.api.Assertions;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.test.context.TestPropertySource;

@SpringBootTest
@AutoConfigureMockMvc
@TestPropertySource(locations = "classpath:application.properties")
@ExtendWith(MockitoExtension.class)
public class FileServiceTests {
  @Autowired
  private FileServiceInterface fileService;
  @Mock
  private MockMultipartFile mockMultipartFile;
  @Value("${directory.resources.static.test}")
  private Path path;

  private MockMultipartFile file1;

  @BeforeEach
  public void setUp() throws IOException {
    File file = new File(path + File.separator + "MockResponses.xlsx");

    try (FileInputStream input = new FileInputStream(file)) {
      byte[] bytes = new byte[(int) file.length()];
      input.read(bytes);

      file1 = new MockMultipartFile(
          "file",
          file.getName(),
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          bytes
      );
    } catch (IOException e) {
      throw new IOException(e.getMessage());
    }

  }

  @Test
  @DisplayName("Verifica se ocorre a leitura e a conversão do arquivo .xlsx em uma lista de MockExamResponse")
  public void xlsxReaderTest() throws IOException {
    List<MockExamResponse> mockExamResponses = fileService.xlsxReader(file1);

    assertFalse(mockExamResponses.isEmpty());
    assertInstanceOf(List.class, mockExamResponses);
    assertEquals(20, mockExamResponses.size());

    Assertions.assertThat(mockExamResponses).isNotNull()
        .allSatisfy(response -> {
          Assertions.assertThat(response.getId()).isNull();
          Assertions.assertThat(response.getMockExam()).isNull();
          Assertions.assertThat(response.getName()).isInstanceOf(String.class);
          Assertions.assertThat(response.getEmail()).isInstanceOf(String.class);
          Assertions.assertThat(response.getCorrectAnswers()).isInstanceOf(Integer.class);
          Assertions.assertThat(response.getTotalQuestions()).isInstanceOf(Integer.class);
          Assertions.assertThat(response.getResponses()).isInstanceOf(List.class);
          Assertions.assertThat(response.getAdaptedQuestionList()).isInstanceOf(List.class);
          Assertions.assertThat(response.getComment()).isInstanceOf(String.class);
          Assertions.assertThat(response.getCreatedAt()).isInstanceOf(LocalDateTime.class);
        });
  }

  @Test
  @DisplayName("Verifica se ocorre o disparo de uma exceção IOException na leitura de um arquivo inexistente")
  public void xlsxReaderTestError() throws IOException {
    Mockito.when(mockMultipartFile.getInputStream()).thenThrow(new IOException("Erro ao ler arquivo"));

    assertThrows(
        IOException.class,
        () -> fileService.xlsxReader(mockMultipartFile)
    );
  }
}
