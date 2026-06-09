package com.akin.focusflow.security.dto;

import jakarta.validation.constraints.*;

public record AuthRequest(
        @NotBlank @Email String email,
        @NotBlank String password
) {}