package com.mateco.reportgenerator.configuration;

import java.io.IOException;
import java.io.InputStream;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.ResourceLoader;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class FileLoader {
  @Value("${directory.resources.static.files}")
  private String resourceDirectory;

  private final ResourceLoader resourceLoader;

  public InputStream loadMockResponsesFile() throws IOException {
    return resourceLoader.getResource(resourceDirectory + "MockResponses.xlsx").getInputStream();
  }
}
