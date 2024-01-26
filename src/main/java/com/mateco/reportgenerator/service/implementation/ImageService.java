package com.mateco.reportgenerator.service.implementation;

import com.mateco.reportgenerator.service.ImageServiceInterface;
import java.io.BufferedOutputStream;
import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.util.List;
import java.util.UUID;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
public class ImageService implements ImageServiceInterface {
  @Value("${directory.resources.static.image}")
  private String imageDirectoryPath;

  @Override
  public List<String> uploadImages(List<MultipartFile> images) throws IOException {
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

        return filePath;
      })
      .toList();
  }

}
