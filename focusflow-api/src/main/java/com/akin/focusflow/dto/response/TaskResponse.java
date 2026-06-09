package com.akin.focusflow.dto.response;

import com.akin.focusflow.domain.enums.TaskStatus;
import lombok.Builder;

import java.time.LocalDate;
import java.time.OffsetDateTime;

@Builder
public record TaskResponse(
        Long id,
        String title,
        String description,
        TaskStatus status,
        LocalDate dueDate,
        Integer priority,
        String area,
        OffsetDateTime createdAt,
        OffsetDateTime updatedAt,
        Long totalFocusSeconds,
        Long goalId,
        String goalTitle
) {
}
