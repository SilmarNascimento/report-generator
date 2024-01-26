package com.mateco.reportgenerator.service;

import java.io.IOException;
import java.util.List;
import org.springframework.web.multipart.MultipartFile;

public interface ImageServiceInterface {
  List<String> uploadImages(List<MultipartFile> images) throws IOException;

}
