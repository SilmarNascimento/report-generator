package com.mateco.reportgenerator.controller;

import com.mateco.reportgenerator.controller.dto.dashboard.GlobalDashboardOutputDto;
import com.mateco.reportgenerator.controller.dto.dashboard.IndividualDashboardOutputDto;
import com.mateco.reportgenerator.service.DashboardServiceInterface;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/dashboard")
@RequiredArgsConstructor
public class DashboardController {

    private final DashboardServiceInterface dashboardService;

    @GetMapping("/global")
    public ResponseEntity<GlobalDashboardOutputDto> globalDashboard(
            @RequestParam int year,
            @RequestParam(required = false) List<UUID> mockExamIds
    ) {
        return ResponseEntity
                .status(HttpStatus.OK)
                .body(dashboardService.getGlobalDashboard(year, mockExamIds));
    }

    @GetMapping("/individual/{studentId}")
    public ResponseEntity<IndividualDashboardOutputDto> individualDashboard(
            @PathVariable Long studentId,
            @RequestParam int year,
            @RequestParam(required = false) List<UUID> mockExamIds
    ) {
        return ResponseEntity
                .status(HttpStatus.OK)
                .body(dashboardService.getIndividualDashboard(studentId, year, mockExamIds));
    }
}
