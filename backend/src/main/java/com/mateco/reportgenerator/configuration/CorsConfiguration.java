package com.mateco.reportgenerator.configuration;

import java.util.Arrays;
import java.util.List;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class CorsConfiguration implements WebMvcConfigurer {

  @Value("${app.cors.allowed-origins:http://localhost:5173}")
  private String allowedOrigins;

  @Override
  public void addCorsMappings(CorsRegistry registry) {
    List<String> origins = Arrays.stream(allowedOrigins.split(","))
        .map(String::trim)
        .filter(s -> !s.isEmpty())
        .toList();

    registry.addMapping("/**")
        .allowedOrigins(origins.toArray(new String[0]))
        .allowedMethods("GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS")
        .allowedHeaders("*")
        .allowCredentials(false)
        .maxAge(3600);
  }
}

