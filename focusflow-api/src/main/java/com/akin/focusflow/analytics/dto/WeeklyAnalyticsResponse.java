package com.akin.focusflow.analytics.dto;

import lombok.Builder;

@Builder
public record WeeklyAnalyticsResponse(
        Integer weekNumber,
        Integer year,
        Long totalFocusSeconds,
        Integer totalTasks,
        Integer completedTasks,
        Integer inProgressTasks,
        Integer todoTasks,
        Integer cancelledTasks,
        Integer completedGoals,
        Integer totalGoals
) {}