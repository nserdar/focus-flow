package com.akin.focusflow.analytics.controller;

import com.akin.focusflow.analytics.dto.GlobalAnalyticsResponse;
import com.akin.focusflow.analytics.dto.TaskAnalyticsResponse;
import com.akin.focusflow.analytics.dto.WeeklyAnalyticsResponse;
import com.akin.focusflow.analytics.service.GlobalAnalyticsService;
import com.akin.focusflow.analytics.service.TaskAnalyticsService;
import com.akin.focusflow.analytics.service.WeeklyAnalyticsService;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/analytics")
@Tag(name = "Analytics", description = "Analytics and reporting endpoints")
public class AnalyticsController {

    private final TaskAnalyticsService taskAnalyticsService;
    private final WeeklyAnalyticsService weeklyAnalyticsService;
    private final GlobalAnalyticsService globalAnalyticsService;

    public AnalyticsController(TaskAnalyticsService taskAnalyticsService,
                               WeeklyAnalyticsService weeklyAnalyticsService,
                               GlobalAnalyticsService globalAnalyticsService) {
        this.taskAnalyticsService = taskAnalyticsService;
        this.weeklyAnalyticsService = weeklyAnalyticsService;
        this.globalAnalyticsService = globalAnalyticsService;
    }

    // Task Bazlı Analytics
    @GetMapping("/task/{taskId}")
    public ResponseEntity<TaskAnalyticsResponse> getTaskAnalytics(@PathVariable Long taskId) {
        return ResponseEntity.ok(taskAnalyticsService.getTaskAnalytics(taskId));
    }

    // Haftalık Analytics
    @GetMapping("/weekly")
    public ResponseEntity<WeeklyAnalyticsResponse> getWeeklyAnalytics(
            @RequestParam Integer weekNumber,
            @RequestParam Integer year
    ) {
        return ResponseEntity.ok(weeklyAnalyticsService.getWeeklyAnalytics(weekNumber, year));
    }

    // Global Analytics
    @GetMapping("/global")
    public ResponseEntity<GlobalAnalyticsResponse> getGlobalAnalytics() {
        return ResponseEntity.ok(globalAnalyticsService.getGlobalAnalytics());
    }
}