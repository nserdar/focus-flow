package com.akin.focusflow.dto.response;

import lombok.Builder;

import java.time.LocalDate;
import java.time.OffsetDateTime;
import java.util.List;

@Builder
public record WeeklyPlanResponse(
        Long id,
        Integer weekNumber,
        Integer year,
        LocalDate startDate,
        LocalDate endDate,
        List<TaskResponse> tasks,
        List<GoalResponse> goals,
        OffsetDateTime createdAt,
        OffsetDateTime updatedAt
) {}