package com.akin.focusflow.mapper;

import com.akin.focusflow.domain.model.WeeklyPlan;
import com.akin.focusflow.dto.request.WeeklyPlanRequest;
import com.akin.focusflow.dto.response.WeeklyPlanResponse;
import org.mapstruct.*;

@Mapper(componentModel = "spring")
public interface WeeklyPlanMapper {

    // Manual mapping - MapStruct has issues with record to entity mapping
    default WeeklyPlan toEntity(WeeklyPlanRequest request) {
        if (request == null) {
            return null;
        }
        return WeeklyPlan.builder()
                .weekNumber(request.weekNumber())
                .year(request.year())
                .startDate(request.startDate())
                .endDate(request.endDate())
                .build();
    }

    default WeeklyPlanResponse toResponse(WeeklyPlan weeklyPlan) {
        if (weeklyPlan == null) {
            return null;
        }
        // Tasks and goals will be set in service layer
        return WeeklyPlanResponse.builder()
                .id(weeklyPlan.getId())
                .weekNumber(weeklyPlan.getWeekNumber())
                .year(weeklyPlan.getYear())
                .startDate(weeklyPlan.getStartDate())
                .endDate(weeklyPlan.getEndDate())
                .tasks(java.util.Collections.emptyList())
                .goals(java.util.Collections.emptyList())
                .createdAt(weeklyPlan.getCreatedAt())
                .updatedAt(weeklyPlan.getUpdatedAt())
                .build();
    }

    default void updateWeeklyPlanFromRequest(WeeklyPlanRequest request, @MappingTarget WeeklyPlan weeklyPlan) {
        if (request == null || weeklyPlan == null) {
            return;
        }
        if (request.weekNumber() != null) {
            weeklyPlan.setWeekNumber(request.weekNumber());
        }
        if (request.year() != null) {
            weeklyPlan.setYear(request.year());
        }
        if (request.startDate() != null) {
            weeklyPlan.setStartDate(request.startDate());
        }
        if (request.endDate() != null) {
            weeklyPlan.setEndDate(request.endDate());
        }
    }
}