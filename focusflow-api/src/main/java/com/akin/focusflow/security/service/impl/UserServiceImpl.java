package com.akin.focusflow.security.service.impl;

import com.akin.focusflow.common.exception.NotFoundException;
import com.akin.focusflow.security.dto.*;
import com.akin.focusflow.security.model.AppUser;
import com.akin.focusflow.security.repository.UserRepository;
import com.akin.focusflow.security.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();

    @Override
    public UserResponse getCurrentUser() {
        var principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        if (principal instanceof AppUser user) {
            return UserResponse.builder()
                    .id(user.getId())
                    .email(user.getEmail())
                    .role(user.getRole())
                    .build();
        }

        throw new NotFoundException("Authenticated user not found");
    }

    @Override
    public UserResponse getById(Long id) {
        AppUser user = userRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("User not found"));

        return mapToResponse(user);
    }

    @Override
    public List<UserResponse> getAll() {
        return userRepository.findAll().stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Override
    public UserResponse updateUser(Long id, UpdateUserRequest request) {
        AppUser user = userRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("User not found"));

        if (request.email() != null) {
            user.setEmail(request.email());
        }

        if (request.password() != null) {
            user.setPassword(encoder.encode(request.password()));
        }

        userRepository.save(user);

        return mapToResponse(user);
    }

    @Override
    public void updatePassword(Long id, UpdatePasswordRequest request) {
        AppUser user = userRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("User not found"));

        if (!encoder.matches(request.oldPassword(), user.getPassword())) {
            throw new IllegalArgumentException("Old password is incorrect");
        }

        user.setPassword(encoder.encode(request.newPassword()));
        userRepository.save(user);
    }

    @Override
    public void deleteUser(Long id) {
        if (!userRepository.existsById(id)) {
            throw new NotFoundException("User not found");
        }
        userRepository.deleteById(id);
    }

    private UserResponse mapToResponse(AppUser user) {
        return UserResponse.builder()
                .id(user.getId())
                .email(user.getEmail())
                .role(user.getRole())
                .build();
    }
}