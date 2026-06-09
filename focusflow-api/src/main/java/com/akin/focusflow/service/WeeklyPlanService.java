package com.akin.focusflow.service;

import com.akin.focusflow.dto.request.WeeklyPlanRequest;
import com.akin.focusflow.dto.response.WeeklyPlanResponse;
import java.util.List;

public interface WeeklyPlanService {

    WeeklyPlanResponse create(WeeklyPlanRequest request);

    WeeklyPlanResponse getById(Long id);

    WeeklyPlanResponse getByWeek(Integer weekNumber, Integer year);

    WeeklyPlanResponse update(Long id, WeeklyPlanRequest request);

    void delete(Long id);

    List<WeeklyPlanResponse> getAll();
}