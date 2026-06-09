package com.akin.focusflow.analytics.service.impl;

import com.akin.focusflow.analytics.dto.GlobalAnalyticsResponse;
import com.akin.focusflow.analytics.service.GlobalAnalyticsService;
import com.akin.focusflow.domain.model.FocusSession;
import com.akin.focusflow.repository.FocusSessionRepository;
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
public class GlobalAnalyticsServiceImpl implements GlobalAnalyticsService {

    private final FocusSessionRepository sessionRepository;
    private final TaskRepository taskRepository;

    @Override
    public GlobalAnalyticsResponse getGlobalAnalytics() {

        var allSessions = sessionRepository.findAll();
        long totalFocus = allSessions.stream()
                .filter(fs -> fs.getDurationMinutes() != null)
                .mapToLong(fs -> fs.getDurationMinutes() * 60L) // Convert minutes to seconds
                .sum();

        LocalDate now = LocalDate.now();

        Map<LocalDate, Long> last7Days = allSessions.stream()
                .filter(fs -> fs.getFinishedAt() != null &&
                        !fs.getFinishedAt().toLocalDate().isBefore(now.minusDays(7)) &&
                        fs.getDurationMinutes() != null)
                .collect(Collectors.groupingBy(
                        fs -> fs.getFinishedAt().toLocalDate(),
                        Collectors.summingLong(fs -> fs.getDurationMinutes() * 60L) // Convert minutes to seconds
                ));

        Map<LocalDate, Long> last30Days = allSessions.stream()
                .filter(fs -> fs.getFinishedAt() != null &&
                        !fs.getFinishedAt().toLocalDate().isBefore(now.minusDays(30)) &&
                        fs.getDurationMinutes() != null)
                .collect(Collectors.groupingBy(
                        fs -> fs.getFinishedAt().toLocalDate(),
                        Collectors.summingLong(fs -> fs.getDurationMinutes() * 60L) // Convert minutes to seconds
                ));

        long completedTasks = taskRepository.findAll()
                .stream()
                .filter(t -> t.getStatus().name().equals("COMPLETED"))
                .count();

        return GlobalAnalyticsResponse.builder()
                .totalFocusSeconds(totalFocus)
                .totalSessions((long) allSessions.size())
                .totalCompletedTasks(completedTasks)
                .focusTrendLast7Days(last7Days)
                .focusTrendLast30Days(last30Days)
                .build();
    }
}