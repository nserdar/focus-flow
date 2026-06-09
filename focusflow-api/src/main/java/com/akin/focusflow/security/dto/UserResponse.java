package com.akin.focusflow.security.dto;

import lombok.Builder;

@Builder
public record UserResponse(
        Long id,
        String email,
        String role
) {}