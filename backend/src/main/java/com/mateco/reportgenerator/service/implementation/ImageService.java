package com.mateco.reportgenerator.service.implementation;

import com.mateco.reportgenerator.model.entity.AdaptedQuestion;
import com.mateco.reportgenerator.model.entity.MainQuestion;
import com.mateco.reportgenerator.service.ImageServiceInterface;
import java.io.BufferedOutputStream;
import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;
import java.util.stream.Stream;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
public class ImageService implements ImageServiceInterface {
  @Value("${directory.resources.static.image}")
  private String imageDirectoryPath;

  @Value("${directory.domain.image}")
  private String domainPath;

  @Override
  public List<String> uploadImages(List<MultipartFile> images) throws IOException {
    if (images == null || images.isEmpty()) {
      return new ArrayList<>();
    }

    File directory = new File(imageDirectoryPath);
    if (!directory.exists()) {
      directory.mkdirs();
    }

    return images.stream()
      .map((MultipartFile image)  -> {
        String fileName = UUID.randomUUID().toString() + "_" + image.getOriginalFilename();
        String filePath = imageDirectoryPath + File.separator + fileName;

        File uploadImage = new File(filePath);

        try (BufferedOutputStream fileStream = new BufferedOutputStream(new FileOutputStream(uploadImage))) {
          fileStream.write(image.getBytes());
        }  catch (IOException exception) {
          throw new RuntimeException("Failed to save image: " + fileName, exception);
        }

        return domainPath + File.separator + fileName;
      })
      .toList();
  }

  @Override
  public void deleteImages(List<String> previousImages) {
    previousImages.forEach((String imageURL) -> {
          String imagePath = imageURL.replace(domainPath, imageDirectoryPath);

          File previousImage = new File(imagePath);

          if (!previousImage.delete()) {
            throw new SecurityException("Erro ao excluir o arquivo: " + imagePath);
          }
        });
  }
}
