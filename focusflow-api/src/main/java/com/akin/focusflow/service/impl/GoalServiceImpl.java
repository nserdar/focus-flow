package com.akin.focusflow.service.impl;

import com.akin.focusflow.common.exception.NotFoundException;
import com.akin.focusflow.domain.enums.GoalStatus;
import com.akin.focusflow.domain.model.Goal;
import com.akin.focusflow.dto.request.GoalRequest;
import com.akin.focusflow.dto.response.PageResponse;
import com.akin.focusflow.dto.response.GoalResponse;
import com.akin.focusflow.mapper.GoalMapper;
import com.akin.focusflow.mapper.TaskMapper;
import com.akin.focusflow.repository.GoalRepository;
import com.akin.focusflow.security.model.AppUser;

import com.akin.focusflow.service.GoalService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class GoalServiceImpl implements GoalService {

    private final GoalRepository goalRepository;
    private final GoalMapper goalMapper;
    private final TaskMapper taskMapper;

    // ============================================================
    // 🔥 1) YARDIMCI — User kim?
    // ============================================================

    private Long getCurrentUserId() {
        var principal = SecurityContextHolder.getContext()
                .getAuthentication().getPrincipal();

        if (principal instanceof AppUser user) {
            return user.getId();
        }
        throw new RuntimeException("User not authenticated");
    }

    private boolean isAdmin() {
        var principal = SecurityContextHolder.getContext()
                .getAuthentication().getPrincipal();

        if (principal instanceof AppUser user) {
            return "ADMIN".equals(user.getRole());
        }
        return false;
    }

    // ============================================================
    // 🔥 2) CREATE — userId set ETME
    // ============================================================

    @Override
    public GoalResponse create(GoalRequest request) {

        Goal goal = goalMapper.toEntity(request);

        goalRepository.save(goal);
        goal.setUserId(getCurrentUserId());

        Goal saved = goalRepository.save(goal);
        return buildResponse(saved);
    }

    // ============================================================
    // 🔥 Helper: Build Response with Tasks
    // ============================================================
    
    private GoalResponse buildResponse(Goal goal) {
        GoalResponse base = goalMapper.toResponse(goal);
        
        // Map tasks manually
        var taskResponses = goal.getTasks() != null 
            ? goal.getTasks().stream().map(taskMapper::toResponse).toList()
            : java.util.Collections.<com.akin.focusflow.dto.response.TaskResponse>emptyList();
        
        return new GoalResponse(
            base.id(),
            base.title(),
            base.description(),
            base.status(),
            base.startDate(),
            base.endDate(),
            base.priority(),
            base.area(),
            base.createdAt(),
            base.updatedAt(),
            taskResponses
        );
    }

    // ============================================================
    // 🔥 3) GET BY ID — Sahiplik kontrolü
    // ============================================================

    @Override
    @Transactional(readOnly = true)
    public GoalResponse getById(Long id) {

        Goal goal = goalRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Goal not found"));

        // ⭐ Bu goal bana mı ait?
        if (!goal.getUserId().equals(getCurrentUserId()) && !isAdmin()) {
            throw new AccessDeniedException("You cannot access this goal");
        }

        return buildResponse(goal);
    }

    // ============================================================
    // 🔥 4) GET ALL — kullanıcıya göre filtreleme
    // ============================================================

    @Override
    @Transactional(readOnly = true)
    public List<GoalResponse> getAll() {

        // USER → sadece kendi goal'larını görür
        if (!isAdmin()) {
            return goalRepository.findByUserId(getCurrentUserId())
                    .stream()
                    .map(this::buildResponse)
                    .toList();
        }

        // ADMIN → hepsini görür
        return goalRepository.findAll()
                .stream()
                .map(this::buildResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public PageResponse<GoalResponse> getAll(Pageable pageable) {
        Page<Goal> page;
        
        if (!isAdmin()) {
            page = goalRepository.findByUserId(getCurrentUserId(), pageable);
        } else {
            page = goalRepository.findAll(pageable);
        }

        List<GoalResponse> content = page.getContent()
                .stream()
                .map(this::buildResponse)
                .toList();

        return PageResponse.of(content, page.getNumber(), page.getSize(), page.getTotalElements());
    }

    @Override
    @Transactional(readOnly = true)
    public PageResponse<GoalResponse> search(String search, GoalStatus status, Integer priority,
                                              String area, LocalDate startDate, LocalDate endDate,
                                              Pageable pageable) {
        Page<Goal> page;
        
        if (!isAdmin()) {
            page = goalRepository.findWithFilters(
                    getCurrentUserId(), status, priority, area, startDate, endDate, search, pageable
            );
        } else {
            page = goalRepository.findWithFiltersAdmin(
                    status, priority, area, startDate, endDate, search, pageable
            );
        }

        List<GoalResponse> content = page.getContent()
                .stream()
                .map(this::buildResponse)
                .toList();

        return PageResponse.of(content, page.getNumber(), page.getSize(), page.getTotalElements());
    }

    // ============================================================
    // 🔥 5) UPDATE — sahiplik kontrolü
    // ============================================================

    @Override
    public GoalResponse update(Long id, GoalRequest request) {

        Goal goal = goalRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Goal not found"));

        if (!goal.getUserId().equals(getCurrentUserId()) && !isAdmin()) {
            throw new AccessDeniedException("You cannot update this goal");
        }

        goalMapper.updateGoalFromRequest(request, goal);

        Goal saved = goalRepository.save(goal);
        return buildResponse(saved);
    }

    // ============================================================
    // 🔥 6) DELETE — sahiplik kontrolü
    // ============================================================

    @Override
    public void delete(Long id) {

        Goal goal = goalRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Goal not found"));

        if (!goal.getUserId().equals(getCurrentUserId()) && !isAdmin()) {
            throw new AccessDeniedException("You cannot delete this goal");
        }

        goalRepository.delete(goal);
    }

    @Override
    public List<GoalResponse> getByArea(String area) {
        return goalRepository.findByArea(area)
                .stream()
                .map(this::buildResponse)
                .toList();
    }
}