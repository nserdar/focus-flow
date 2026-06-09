package com.akin.focusflow.dto.request;

import com.akin.focusflow.domain.enums.FocusSessionType;
import jakarta.validation.constraints.NotNull;

import java.time.OffsetDateTime;

public record FocusSessionRequest(

        @NotNull
        Long taskId,

        Integer durationMinutes,

        FocusSessionType type,

        @NotNull
        OffsetDateTime startTime,

        OffsetDateTime endTime
) {}