package com.mateco.reportgenerator.service;

import com.mateco.reportgenerator.model.entity.Handout;
import com.mateco.reportgenerator.model.entity.MainQuestion;
import java.util.List;
import java.util.UUID;

public interface HandoutServiceInterface {
  List<Handout> findAllHandout();
  Handout findHandoutById(UUID handoutId);
  Handout createHandout(MainQuestion question, List<String> questionImages);
  Handout updateHandoutById(UUID handoutId, MainQuestion question, List<String> questionImages);
  void deleteHandoutById(UUID handoutId);

  Handout addQuestion(UUID questionId, List<UUID> subjecstId);
  void removeQuestion(UUID questionId, List<UUID> subjectsId);

}
