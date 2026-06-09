package com.akin.focusflow.service.impl;

import com.akin.focusflow.common.exception.NotFoundException;
import com.akin.focusflow.domain.model.FocusSession;
import com.akin.focusflow.domain.model.Task;
import com.akin.focusflow.dto.request.FocusSessionRequest;
import com.akin.focusflow.dto.response.FocusSessionResponse;
import com.akin.focusflow.dto.response.PageResponse;
import com.akin.focusflow.mapper.FocusSessionMapper;
import com.akin.focusflow.repository.FocusSessionRepository;
import com.akin.focusflow.repository.TaskRepository;
import com.akin.focusflow.security.model.AppUser;
import com.akin.focusflow.service.FocusSessionService;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.OffsetDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class FocusSessionServiceImpl implements FocusSessionService {

    private final FocusSessionRepository sessionRepository;
    private final TaskRepository taskRepository;
    private final FocusSessionMapper mapper;

    // ============================================================
    // 🔥 Helper — Current User
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
    // 🔥 1) START SESSION
    // ============================================================

    @Override
    public FocusSessionResponse start(FocusSessionRequest request) {

        Task task = taskRepository.findById(request.taskId())
                .orElseThrow(() -> new NotFoundException("Task not found"));

        // ⭐ Task sahiplik kontrolü
        if (!task.getUserId().equals(getCurrentUserId()) && !isAdmin()) {
            throw new AccessDeniedException("You cannot start a session on this task");
        }

        FocusSession session = mapper.toEntity(request);

        // ⭐ session userId
        session.setUserId(getCurrentUserId());
        session.setActive(true);
        session.setCompleted(false);
        session.setCanceled(false);

        FocusSession saved = sessionRepository.save(session);
        return mapper.toResponse(saved);
    }

    // ============================================================
    // 🔥 2) FINISH SESSION
    // ============================================================

    @Override
    public FocusSessionResponse finish(Long id, FocusSessionRequest request) {

        FocusSession session = sessionRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Session not found"));

        // ⭐ sahiplik kontrolü
        if (!session.getUserId().equals(getCurrentUserId()) && !isAdmin()) {
            throw new AccessDeniedException("You cannot finish this session");
        }

        mapper.updateSessionFromRequest(request, session);

        session.setActive(false);
        session.setCompleted(true);

        FocusSession saved = sessionRepository.save(session);
        return mapper.toResponse(saved);
    }

    // ============================================================
    // 🔥 3) GET BY ID
    // ============================================================

    @Override
    public FocusSessionResponse getById(Long id) {

        FocusSession session = sessionRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Session not found"));

        // ⭐ sahiplik kontrolü
        if (!session.getUserId().equals(getCurrentUserId()) && !isAdmin()) {
            throw new AccessDeniedException("You cannot view this session");
        }

        return mapper.toResponse(session);
    }

    // ============================================================
    // 🔥 4) GET SESSIONS BY TASK
    // ============================================================

    @Override
    @Transactional(readOnly = true)
    public List<FocusSessionResponse> getByTask(Long taskId) {

        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new NotFoundException("Task not found"));

        // ⭐ Task'ın sahibi misin?
        if (!task.getUserId().equals(getCurrentUserId()) && !isAdmin()) {
            throw new AccessDeniedException("You cannot view sessions of this task");
        }

        return sessionRepository.findByTaskId(taskId)
                .stream()
                .map(mapper::toResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public PageResponse<FocusSessionResponse> getAll(Pageable pageable) {
        Page<FocusSession> page;
        
        if (!isAdmin()) {
            page = sessionRepository.findByUserId(getCurrentUserId(), pageable);
        } else {
            page = sessionRepository.findAll(pageable);
        }

        List<FocusSessionResponse> content = page.getContent()
                .stream()
                .map(mapper::toResponse)
                .toList();

        return PageResponse.of(content, page.getNumber(), page.getSize(), page.getTotalElements());
    }

    @Override
    @Transactional(readOnly = true)
    public PageResponse<FocusSessionResponse> search(Long taskId, Boolean completed, Boolean active,
                                                      Boolean canceled, OffsetDateTime startDate,
                                                      OffsetDateTime endDate, Pageable pageable) {
        Page<FocusSession> page;
        
        if (!isAdmin()) {
            page = sessionRepository.findWithFilters(
                    getCurrentUserId(), taskId, completed, active, canceled, startDate, endDate, pageable
            );
        } else {
            page = sessionRepository.findWithFiltersAdmin(
                    taskId, completed, active, canceled, startDate, endDate, pageable
            );
        }

        List<FocusSessionResponse> content = page.getContent()
                .stream()
                .map(mapper::toResponse)
                .toList();

        return PageResponse.of(content, page.getNumber(), page.getSize(), page.getTotalElements());
    }

    // ============================================================
    // 🔥 5) CANCEL SESSION
    // ============================================================

    @Override
    public void cancel(Long id) {

        FocusSession session = sessionRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Session not found"));

        // ⭐ sahiplik kontrolü
        if (!session.getUserId().equals(getCurrentUserId()) && !isAdmin()) {
            throw new AccessDeniedException("You cannot cancel this session");
        }

        session.setActive(false);
        session.setCompleted(false);
        session.setCanceled(true);

        sessionRepository.save(session);
    }
}