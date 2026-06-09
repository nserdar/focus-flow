package com.akin.focusflow.security.dto;

import lombok.Builder;

@Builder
public record JwtResponse(
        String accessToken,
        String refreshToken,
        Long userId,
        String email
) {}