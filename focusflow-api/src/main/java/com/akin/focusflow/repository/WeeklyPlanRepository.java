package com.akin.focusflow.repository;

import com.akin.focusflow.domain.model.WeeklyPlan;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface WeeklyPlanRepository extends JpaRepository<WeeklyPlan, Long> {

    List<WeeklyPlan> findByUserId(Long userId);

    Optional<WeeklyPlan> findByWeekNumberAndYear(Integer weekNumber, Integer year);

    Optional<WeeklyPlan> findByWeekNumberAndYearAndUserId(Integer weekNumber, Integer year, Long userId);
}