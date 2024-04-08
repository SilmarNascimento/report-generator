package com.mateco.reportgenerator.service;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.TestPropertySource;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;

@SpringBootTest
@ActiveProfiles("test")
@TestPropertySource(locations = "classpath:application.properties")
public class ImageServiceTests {
  @Autowired
  private ImageServiceInterface imageService;

  @Value("${directory.resources.static.image}")
  private Path path;

  @Mock
  private MockMultipartFile mockMultipartFile;

  @Test
  @DisplayName("Verifica se ocorre o armazenamento de arquivos no sistema e é retornado uma lista de URL")
  public void uploadImageTest() throws IOException {
    MockMultipartFile file1 = new MockMultipartFile("file", "filename1.jpg", "image/jpeg", "image_example_01".getBytes());
    MockMultipartFile file2 = new MockMultipartFile("file", "filename2.jpg", "image/jpeg", "image_example_02".getBytes());

    List<String> filesURL = imageService.uploadImages(List.of(file1, file2));

    assertEquals(2, filesURL.size());

    List<Path> filesInDirectory = listFilesInDirectory(path);

    assertEquals(2, filesInDirectory.size());

    List<String> filesName = filesInDirectory.stream()
        .map(filePath -> {
          String stringFileName = filePath.toString().replace(path.toString(), "");
          return stringFileName.split("_")[1];
        })
        .collect(Collectors.toList());

    assertTrue(filesName.contains("filename1.jpg"));
    assertTrue(filesName.contains("filename2.jpg"));
  }

  @Test
  @DisplayName("Verifica se ocorre o armazenamento de arquivos no sistema e é retornado uma lista de URL")
  public void uploadImageTestNullList() throws IOException {
    List<String> filesURL = imageService.uploadImages(null);

    assertEquals(0, filesURL.size());

    List<Path> filesInDirectory = listFilesInDirectory(path);

    assertEquals(0, filesInDirectory.size());

    List<String> filesName = filesInDirectory.stream()
        .map(filePath -> {
          String stringFileName = filePath.toString().replace(path.toString(), "");
          return stringFileName.split("_")[1];
        })
        .collect(Collectors.toList());

    assertTrue(filesName.isEmpty());
  }

  @Test
  @DisplayName("Verifica se ocorre o armazenamento de arquivos no sistema e é retornado uma lista de URL")
  public void uploadImageTestEmptyList() throws IOException {
    List<String> filesURL = imageService.uploadImages(new ArrayList<>());

    assertEquals(0, filesURL.size());

    List<Path> filesInDirectory = listFilesInDirectory(path);

    assertEquals(0, filesInDirectory.size());

    List<String> filesName = filesInDirectory.stream()
        .map(filePath -> {
          String stringFileName = filePath.toString().replace(path.toString(), "");
          return stringFileName.split("_")[1];
        })
        .collect(Collectors.toList());

    assertTrue(filesName.isEmpty());
  }

  @Test
  @DisplayName("Verifica se ocorre a remoção dos arquivos no sistema baseado numa lista de URL")
  public void deleteImageTest() throws IOException {
    List<Path> filesInDirectory = listFilesInDirectory(path);

    List<String> filesPath = filesInDirectory.stream()
        .map(filePath -> filePath.toString())
        .collect(Collectors.toList());

    assertEquals(2, filesInDirectory.size());

    imageService.deleteImages(filesPath);

    List<Path> updatedFilesInDirectory = listFilesInDirectory(path);

    assertEquals(0, updatedFilesInDirectory.size());
  }

  @Test
  @DisplayName("Verifica se ocorre o disparo de uma exceção ao deletar um arquivo inexistente")
  public void deleteImageTestError() throws IOException {
    List<String> inexistentFile = List.of(path.toString() + "fakeFile.jpg");

    assertThrows(SecurityException.class, () -> imageService.deleteImages(inexistentFile));
  }

  @Test
  @DisplayName("Verifica se ocorre o disparo de uma exceção IOException na leitura de um arquivo inexistente")
  public void xlsxReaderTestError() throws IOException {
    Mockito.when(mockMultipartFile.getBytes()).thenThrow(new IOException("Erro ao ler arquivo"));

    assertThrows(
        RuntimeException.class,
        () -> imageService.uploadImages(List.of(mockMultipartFile))
    );

    List<Path> filesInDirectory = listFilesInDirectory(path);

    List<String> filesPath = filesInDirectory.stream()
        .map(filePath -> filePath.toString())
        .collect(Collectors.toList());

    imageService.deleteImages(filesPath);

    List<Path> updatedFilesInDirectory = listFilesInDirectory(path);

    assertEquals(0, updatedFilesInDirectory.size());
  }

  private List<Path> listFilesInDirectory(Path directory) throws IOException {
    List<Path> filesPath = new ArrayList<>();
    Files.walk(directory)
        .filter(Files::isRegularFile)
        .forEach(filesPath::add);
    return filesPath;
  }
}
