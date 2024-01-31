package com.mateco.reportgenerator.service;

import com.mateco.reportgenerator.model.entity.AdaptedQuestion;
import com.mateco.reportgenerator.model.entity.Alternative;
import com.mateco.reportgenerator.model.entity.MainQuestion;
import com.mateco.reportgenerator.model.entity.Subject;
import java.util.List;
import java.util.UUID;

public interface AlternativeServiceInterface {
  List<Alternative> findAllAlternativesByMainQuestionId(UUID mainQuestionId);
  List<Alternative> findAllAlternativesByAdaptedQuestionId(UUID adaptedQuestionId);
  Alternative findAlternativeById(UUID alternativeId);
  List<Alternative> createAlternatives(MainQuestion mainQuestion, List<Alternative> alternative);
  List<Alternative> createAlternatives(AdaptedQuestion adaptedQuestion, List<Alternative> alternative);
  Alternative updateAlternativeById(UUID alternativeId, Alternative alternative);
  void deleteAlternativeById(UUID alternativeId);
}