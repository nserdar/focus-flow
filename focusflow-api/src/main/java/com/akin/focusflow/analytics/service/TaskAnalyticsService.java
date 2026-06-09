package com.akin.focusflow.analytics.service;

import com.akin.focusflow.analytics.dto.TaskAnalyticsResponse;

public interface TaskAnalyticsService {
    TaskAnalyticsResponse getTaskAnalytics(Long taskId);
}