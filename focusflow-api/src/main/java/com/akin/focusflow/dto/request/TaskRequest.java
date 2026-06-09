package com.akin.focusflow.dto.request;

import com.akin.focusflow.domain.enums.TaskStatus;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import java.time.LocalDate;

public record TaskRequest(

        @NotBlank
        @Size(max = 150)
        String title,

        @Size(max = 1000)
        String description,

        TaskStatus status,

        LocalDate dueDate,

        @Min(1) @Max(4)
        Integer priority,

        @Size(max = 100)
        String area,

        Long goalId
) {
}
