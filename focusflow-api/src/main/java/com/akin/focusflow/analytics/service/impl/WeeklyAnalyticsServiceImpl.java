package com.akin.focusflow.analytics.service.impl;

import com.akin.focusflow.analytics.dto.WeeklyAnalyticsResponse;
import com.akin.focusflow.analytics.service.WeeklyAnalyticsService;
import com.akin.focusflow.common.exception.NotFoundException;
import com.akin.focusflow.domain.enums.TaskStatus;
import com.akin.focusflow.domain.enums.GoalStatus;
import com.akin.focusflow.domain.model.Task;
import com.akin.focusflow.domain.model.WeeklyPlan;
import com.akin.focusflow.repository.WeeklyPlanRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class WeeklyAnalyticsServiceImpl implements WeeklyAnalyticsService {

    private final WeeklyPlanRepository weeklyPlanRepository;

    @Override
    public WeeklyAnalyticsResponse getWeeklyAnalytics(Integer weekNumber, Integer year) {

        WeeklyPlan plan = weeklyPlanRepository
                .findByWeekNumberAndYear(weekNumber, year)
                .orElseThrow(() -> new NotFoundException("Weekly plan not found"));

        long totalFocus = plan.getTasks()
                .stream()
                .flatMap(t -> t.getFocusSessions().stream())
                .filter(fs -> fs.getDurationMinutes() != null)
                .mapToLong(fs -> fs.getDurationMinutes() * 60L) // Convert minutes to seconds
                .sum();

        int completedGoals = (int) plan.getGoals()
                .stream()
                .filter(g -> g.getStatus() == GoalStatus.COMPLETED)
                .count();

        return WeeklyAnalyticsResponse.builder()
                .weekNumber(weekNumber)
                .year(year)
                .totalFocusSeconds(totalFocus)
                .totalTasks(plan.getTasks().size())
                .completedTasks((int) plan.getTasks().stream().filter(t -> t.getStatus() == TaskStatus.DONE).count())
                .inProgressTasks((int) plan.getTasks().stream().filter(t -> t.getStatus() == TaskStatus.IN_PROGRESS).count())
                .todoTasks((int) plan.getTasks().stream().filter(t -> t.getStatus() == TaskStatus.TODO).count())
                .cancelledTasks((int) plan.getTasks().stream().filter(t -> t.getStatus() == TaskStatus.CANCELLED).count())
                .completedGoals(completedGoals)
                .totalGoals(plan.getGoals().size())
                .build();
    }
}