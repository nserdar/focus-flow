package com.akin.focusflow.dto.request;

import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;
import java.util.List;

public record WeeklyPlanRequest(
        @NotNull Integer weekNumber,
        @NotNull Integer year,
        @NotNull LocalDate startDate,
        @NotNull LocalDate endDate,
        List<Long> taskIds,
        List<Long> goalIds
) {}