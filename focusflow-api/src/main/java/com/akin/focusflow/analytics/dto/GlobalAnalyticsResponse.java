package com.akin.focusflow.analytics.dto;

import lombok.Builder;

import java.time.LocalDate;
import java.util.Map;

@Builder
public record GlobalAnalyticsResponse(
        Long totalFocusSeconds,
        Long totalCompletedTasks,
        Long totalSessions,
        Map<LocalDate, Long> focusTrendLast7Days,
        Map<LocalDate, Long> focusTrendLast30Days
) {}