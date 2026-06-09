package com.akin.focusflow.analytics.dto;

import lombok.Builder;

import java.time.LocalDate;
import java.util.Map;

@Builder
public record TaskAnalyticsResponse(
        Long taskId,
        Long totalFocusSeconds,
        Map<LocalDate, Long> dailyFocusSeconds,
        Integer totalSessions,
        String status
) {}