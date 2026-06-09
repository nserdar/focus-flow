package com.akin.focusflow.analytics.service.impl;

import com.akin.focusflow.analytics.dto.TaskAnalyticsResponse;
import com.akin.focusflow.analytics.service.TaskAnalyticsService;
import com.akin.focusflow.common.exception.NotFoundException;
import com.akin.focusflow.domain.model.Task;
import com.akin.focusflow.repository.TaskRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class TaskAnalyticsServiceImpl implements TaskAnalyticsService {

    private final TaskRepository taskRepository;

    @Override
    public TaskAnalyticsResponse getTaskAnalytics(Long taskId) {

        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new NotFoundException("Task not found: " + taskId));

        long total = task.getFocusSessions()
                .stream()
                .filter(fs -> fs.getDurationMinutes() != null)
                .mapToLong(fs -> fs.getDurationMinutes() * 60L) // Convert minutes to seconds
                .sum();

        Map<LocalDate, Long> daily = task.getFocusSessions()
                .stream()
                .filter(fs -> fs.getFinishedAt() != null && fs.getDurationMinutes() != null)
                .collect(Collectors.groupingBy(
                        fs -> fs.getFinishedAt().toLocalDate(),
                        Collectors.summingLong(fs -> fs.getDurationMinutes() * 60L) // Convert minutes to seconds
                ));

        return TaskAnalyticsResponse.builder()
                .taskId(taskId)
                .totalFocusSeconds(total)
                .dailyFocusSeconds(daily)
                .totalSessions(task.getFocusSessions().size())
                .status(task.getStatus().name())
                .build();
    }
}