package com.akin.focusflow.security.service;

import com.akin.focusflow.security.dto.UpdatePasswordRequest;
import com.akin.focusflow.security.dto.UpdateUserRequest;
import com.akin.focusflow.security.dto.UserResponse;

import java.util.List;

public interface UserService {

    UserResponse getCurrentUser();

    UserResponse getById(Long id);

    List<UserResponse> getAll();

    UserResponse updateUser(Long id, UpdateUserRequest request);

    void updatePassword(Long id, UpdatePasswordRequest request);

    void deleteUser(Long id);
}