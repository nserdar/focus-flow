package com.akin.focusflow.dto.response;

import com.akin.focusflow.domain.enums.FocusSessionStatus;
import com.akin.focusflow.domain.enums.FocusSessionType;

import java.time.OffsetDateTime;

public record FocusSessionResponse(
        Long id,
        Long taskId,
        FocusSessionStatus status,
        FocusSessionType type,
        OffsetDateTime startTime,
        OffsetDateTime endTime,
        Long durationSeconds,
        OffsetDateTime createdAt,
        OffsetDateTime updatedAt
) {}