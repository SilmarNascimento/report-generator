package com.mateco.reportgenerator.service;

import com.mateco.reportgenerator.controller.dto.dashboard.GlobalDashboardOutputDto;
import com.mateco.reportgenerator.controller.dto.dashboard.IndividualDashboardOutputDto;

import java.util.List;
import java.util.UUID;

public interface DashboardServiceInterface {

    GlobalDashboardOutputDto getGlobalDashboard(int year, List<UUID> mockExamIds);

    IndividualDashboardOutputDto getIndividualDashboard(Long studentId, int year, List<UUID> mockExamIds);
}
