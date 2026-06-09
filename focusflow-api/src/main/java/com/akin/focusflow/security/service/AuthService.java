package com.akin.focusflow.security.service;

import com.akin.focusflow.security.dto.*;

public interface AuthService {
    JwtResponse register(RegisterRequest request);
    JwtResponse login(AuthRequest request);
    JwtResponse refresh(String refreshToken);
}