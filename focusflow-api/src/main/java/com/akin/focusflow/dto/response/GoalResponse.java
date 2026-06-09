package com.akin.focusflow.dto.response;

import com.akin.focusflow.domain.enums.GoalStatus;
import lombok.Builder;

import java.time.LocalDate;
import java.time.OffsetDateTime;
import java.util.List;

@Builder
public record GoalResponse(
        Long id,
        String title,
        String description,
        GoalStatus status,
        LocalDate startDate,
        LocalDate endDate,
        Integer priority,
        String area,
        OffsetDateTime createdAt,
        OffsetDateTime updatedAt,
        List<TaskResponse> tasks
) {}
