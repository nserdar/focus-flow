package com.akin.focusflow.service;

import com.akin.focusflow.domain.enums.GoalStatus;
import com.akin.focusflow.dto.request.GoalRequest;
import com.akin.focusflow.dto.response.PageResponse;
import com.akin.focusflow.dto.response.GoalResponse;
import org.springframework.data.domain.Pageable;

import java.time.LocalDate;
import java.util.List;

public interface GoalService {
    GoalResponse create(GoalRequest request);
    GoalResponse getById(Long id);
    List<GoalResponse> getAll();
    PageResponse<GoalResponse> getAll(Pageable pageable);
    PageResponse<GoalResponse> search(String search, GoalStatus status, Integer priority,
                                       String area, LocalDate startDate, LocalDate endDate,
                                       Pageable pageable);
    GoalResponse update(Long id, GoalRequest request);
    void delete(Long id);
    List<GoalResponse> getByArea(String area);
}
