package com.akin.focusflow.security.service.impl;

import com.akin.focusflow.security.dto.AuthRequest;
import com.akin.focusflow.security.dto.JwtResponse;
import com.akin.focusflow.security.dto.RegisterRequest;
import com.akin.focusflow.security.jwt.JwtService;
import com.akin.focusflow.security.model.AppUser;
import com.akin.focusflow.security.repository.UserRepository;
import com.akin.focusflow.security.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final AuthenticationManager authManager;
    private final JwtService jwtService;
    private final PasswordEncoder passwordEncoder;

    @Override
    public JwtResponse register(RegisterRequest request) {

        if (userRepository.existsByEmail(request.email())) {
            throw new IllegalArgumentException("Email already registered");
        }

        var user = AppUser.builder()
                .email(request.email())
                .password(passwordEncoder.encode(request.password()))
                .role("USER")
                .build();

        userRepository.save(user);

        String token = jwtService.generateToken(user);
        String refresh = jwtService.generateRefreshToken(user);

        return JwtResponse.builder()
                .accessToken(token)
                .refreshToken(refresh)
                .email(user.getEmail())
                .userId(user.getId())
                .build();
    }

    @Override
    public JwtResponse login(AuthRequest request) {

        authManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.email(), request.password()
                )
        );

        var user = userRepository.findByEmail(request.email())
                .orElseThrow();

        return JwtResponse.builder()
                .accessToken(jwtService.generateToken(user))
                .refreshToken(jwtService.generateRefreshToken(user))
                .email(user.getEmail())
                .userId(user.getId())
                .build();
    }

    @Override
    public JwtResponse refresh(String refreshToken) {

        String email = jwtService.extractEmail(refreshToken);
        var user = userRepository.findByEmail(email).orElseThrow();

        return JwtResponse.builder()
                .accessToken(jwtService.generateToken(user))
                .refreshToken(jwtService.generateRefreshToken(user))
                .userId(user.getId())
                .email(user.getEmail())
                .build();
    }
}