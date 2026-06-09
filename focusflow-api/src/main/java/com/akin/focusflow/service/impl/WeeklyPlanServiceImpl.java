package com.akin.focusflow.service.impl;

import com.akin.focusflow.common.exception.NotFoundException;
import com.akin.focusflow.domain.model.WeeklyPlan;
import com.akin.focusflow.domain.model.Task;
import com.akin.focusflow.domain.model.Goal;
import com.akin.focusflow.dto.request.WeeklyPlanRequest;
import com.akin.focusflow.dto.response.WeeklyPlanResponse;
import com.akin.focusflow.mapper.WeeklyPlanMapper;
import com.akin.focusflow.mapper.TaskMapper;
import com.akin.focusflow.mapper.GoalMapper;
import com.akin.focusflow.repository.WeeklyPlanRepository;
import com.akin.focusflow.repository.TaskRepository;
import com.akin.focusflow.repository.GoalRepository;
import com.akin.focusflow.security.model.AppUser;

import com.akin.focusflow.service.WeeklyPlanService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class WeeklyPlanServiceImpl implements WeeklyPlanService {

    private final WeeklyPlanRepository weeklyPlanRepository;
    private final TaskRepository taskRepository;
    private final GoalRepository goalRepository;
    private final WeeklyPlanMapper weeklyPlanMapper;
    private final TaskMapper taskMapper;
    private final GoalMapper goalMapper;

    // ============================================================
    // 🔥 1) User Helper
    // ============================================================

    private Long getCurrentUserId() {
        var principal = SecurityContextHolder.getContext()
                .getAuthentication().getPrincipal();

        if (principal instanceof AppUser user) return user.getId();
        throw new RuntimeException("User not authenticated");
    }

    private boolean isAdmin() {
        var principal = SecurityContextHolder.getContext()
                .getAuthentication().getPrincipal();

        if (principal instanceof AppUser user) {
            return user.getRole().equals("ADMIN");
        }
        return false;
    }

    // ============================================================
    // 🔥 2) Create WeeklyPlan
    // ============================================================

    @Override
    public WeeklyPlanResponse create(WeeklyPlanRequest request) {

        WeeklyPlan plan = weeklyPlanMapper.toEntity(request);

        // ⭐ WeeklyPlan userId set
        plan.setUserId(getCurrentUserId());

        // ⭐ Eklenen her task → doğru kullanıcıya ait olmalı
        for (Long taskId : request.taskIds()) {
            Task task = taskRepository.findById(taskId)
                    .orElseThrow(() -> new NotFoundException("Task not found"));

            if (!task.getUserId().equals(getCurrentUserId()) && !isAdmin()) {
                throw new AccessDeniedException("This task does not belong to you: " + taskId);
            }
        }

        // ⭐ Eklenen her goal → doğru kullanıcıya ait olmalı
        for (Long goalId : request.goalIds()) {
            Goal goal = goalRepository.findById(goalId)
                    .orElseThrow(() -> new NotFoundException("Goal not found"));

            if (!goal.getUserId().equals(getCurrentUserId()) && !isAdmin()) {
                throw new AccessDeniedException("This goal does not belong to you: " + goalId);
            }
        }

        WeeklyPlan saved = weeklyPlanRepository.save(plan);
        return buildResponse(saved);
    }

    // ============================================================
    // 🔥 3) Get WeeklyPlan by ID (Sahiplik kontrolü)
    // ============================================================

    @Override
    public WeeklyPlanResponse getById(Long id) {

        WeeklyPlan plan = weeklyPlanRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Weekly plan not found"));

        // ⭐ SAHİPLİK
        if (!plan.getUserId().equals(getCurrentUserId()) && !isAdmin()) {
            throw new AccessDeniedException("You cannot access this weekly plan");
        }

        return buildResponse(plan);
    }

    @Override
    @Transactional(readOnly = true)
    public WeeklyPlanResponse getByWeek(Integer weekNumber, Integer year) {

        WeeklyPlan plan;

        // ⭐ Admin ise userId filtrelemesi gerekmez
        if (isAdmin()) {

            plan = weeklyPlanRepository
                    .findByWeekNumberAndYear(weekNumber, year)
                    .orElseThrow(() -> new NotFoundException("Weekly plan not found"));

        } else {

            // ⭐ Sadece kendi weekly planını görebilir
            plan = weeklyPlanRepository
                    .findByWeekNumberAndYearAndUserId(
                            weekNumber,
                            year,
                            getCurrentUserId()
                    )
                    .orElseThrow(() -> new NotFoundException("Weekly plan not found"));
        }

        return buildResponse(plan);
    }

    // ============================================================
    // 🔥 4) List WeeklyPlans (Filtreleme)
    // ============================================================

    @Override
    @Transactional(readOnly = true)
    public List<WeeklyPlanResponse> getAll() {

        if (!isAdmin()) {
            return weeklyPlanRepository.findByUserId(getCurrentUserId())
                    .stream()
                    .map(this::buildResponse)
                    .toList();
        }

        return weeklyPlanRepository.findAll()
                .stream()
                .map(this::buildResponse)
                .toList();
    }

    // ============================================================
    // 🔥 5) Update WeeklyPlan (Sahiplik kontrolü + Task/Goal Validation)
    // ============================================================

    @Override
    public WeeklyPlanResponse update(Long id, WeeklyPlanRequest request) {

        WeeklyPlan plan = weeklyPlanRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Weekly plan not found"));

        if (!plan.getUserId().equals(getCurrentUserId()) && !isAdmin()) {
            throw new AccessDeniedException("You cannot update this weekly plan");
        }

        // ⭐ Task/Goal validation
        for (Long taskId : request.taskIds()) {
            Task task = taskRepository.findById(taskId)
                    .orElseThrow(() -> new NotFoundException("Task not found"));
            if (!task.getUserId().equals(getCurrentUserId()) && !isAdmin()) {
                throw new AccessDeniedException("This task does not belong to you: " + taskId);
            }
        }
        for (Long goalId : request.goalIds()) {
            Goal goal = goalRepository.findById(goalId)
                    .orElseThrow(() -> new NotFoundException("Goal not found"));
            if (!goal.getUserId().equals(getCurrentUserId()) && !isAdmin()) {
                throw new AccessDeniedException("This goal does not belong to you: " + goalId);
            }
        }

        weeklyPlanMapper.updateWeeklyPlanFromRequest(request, plan);

        WeeklyPlan saved = weeklyPlanRepository.save(plan);
        return buildResponse(saved);
    }

    // ============================================================
    // 🔥 Helper: Build Response with Tasks and Goals
    // ============================================================
    
    private WeeklyPlanResponse buildResponse(WeeklyPlan plan) {
        WeeklyPlanResponse base = weeklyPlanMapper.toResponse(plan);
        
        // Map tasks and goals manually
        var taskResponses = plan.getTasks() != null 
            ? plan.getTasks().stream().map(taskMapper::toResponse).toList()
            : java.util.Collections.<com.akin.focusflow.dto.response.TaskResponse>emptyList();
            
        var goalResponses = plan.getGoals() != null
            ? plan.getGoals().stream().map(goalMapper::toResponse).toList()
            : java.util.Collections.<com.akin.focusflow.dto.response.GoalResponse>emptyList();
        
        return new WeeklyPlanResponse(
            base.id(),
            base.weekNumber(),
            base.year(),
            base.startDate(),
            base.endDate(),
            taskResponses,
            goalResponses,
            base.createdAt(),
            base.updatedAt()
        );
    }

    // ============================================================
    // 🔥 6) Delete WeeklyPlan
    // ============================================================

    @Override
    public void delete(Long id) {

        WeeklyPlan plan = weeklyPlanRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Weekly plan not found"));

        if (!plan.getUserId().equals(getCurrentUserId()) && !isAdmin()) {
            throw new AccessDeniedException("You cannot delete this weekly plan");
        }

        weeklyPlanRepository.delete(plan);
    }
}