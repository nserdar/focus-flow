package com.akin.focusflow.security.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record UpdatePasswordRequest(
        @NotBlank String oldPassword,
        @NotBlank @Size(min = 6) String newPassword
) {}