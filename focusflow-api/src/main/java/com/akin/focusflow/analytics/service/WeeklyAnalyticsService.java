package com.akin.focusflow.analytics.service;

import com.akin.focusflow.analytics.dto.WeeklyAnalyticsResponse;

public interface WeeklyAnalyticsService {

    WeeklyAnalyticsResponse getWeeklyAnalytics(Integer weekNumber, Integer year);
}