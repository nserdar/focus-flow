package com.akin.focusflow.service.impl;

import com.akin.focusflow.common.exception.NotFoundException;
import com.akin.focusflow.domain.enums.TaskStatus;
import com.akin.focusflow.domain.model.Task;
import com.akin.focusflow.dto.request.TaskRequest;
import com.akin.focusflow.dto.response.PageResponse;
import com.akin.focusflow.dto.response.TaskResponse;
import com.akin.focusflow.mapper.TaskMapper;
import com.akin.focusflow.repository.TaskRepository;
import com.akin.focusflow.security.model.AppUser;

import com.akin.focusflow.service.TaskService;
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
public class TaskServiceImpl implements TaskService {

    private final TaskRepository taskRepository;
    private final TaskMapper taskMapper;

    // ============================================================
    // 🔥 1) YARDIMCI METOTLAR — HER ŞEYİN TEMELİ
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
    // 🔥 2) CREATE — (userId set etme BURADA)
    // ============================================================

    @Override
    public TaskResponse create(TaskRequest request) {

        Task task = taskMapper.toEntity(request);

        // ⭐ Task → userId set
        task.setUserId(getCurrentUserId());

        Task saved = taskRepository.save(task);
        return taskMapper.toResponse(saved);
    }

    // ============================================================
    // 🔥 3) GET BY ID — (Sahiplik kontrolü BURADA)
    // ============================================================

    @Override
    @Transactional(readOnly = true)
    public TaskResponse getById(Long id) {

        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Task not found"));

        // ⭐ Bu task bana mı ait?
        if (!task.getUserId().equals(getCurrentUserId()) && !isAdmin()) {
            throw new AccessDeniedException("You cannot access this task");
        }

        return taskMapper.toResponse(task);
    }

    // ============================================================
    // 🔥 4) GET ALL — (Kullanıcıya göre filtreleme BURADA)
    // ============================================================

    @Override
    @Transactional(readOnly = true)
    public List<TaskResponse> getAll() {

        // ⭐ USER: sadece kendi task'larını görür
        if (!isAdmin()) {
            return taskRepository.findByUserId(getCurrentUserId())
                    .stream()
                    .map(taskMapper::toResponse)
                    .toList();
        }

        // ⭐ ADMIN: tüm task'ları görür
        return taskRepository.findAll()
                .stream()
                .map(taskMapper::toResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public PageResponse<TaskResponse> getAll(Pageable pageable) {
        Page<Task> page;
        
        if (!isAdmin()) {
            page = taskRepository.findByUserId(getCurrentUserId(), pageable);
        } else {
            page = taskRepository.findAll(pageable);
        }

        List<TaskResponse> content = page.getContent()
                .stream()
                .map(taskMapper::toResponse)
                .toList();

        return PageResponse.of(content, page.getNumber(), page.getSize(), page.getTotalElements());
    }

    @Override
    @Transactional(readOnly = true)
    public PageResponse<TaskResponse> search(String search, TaskStatus status, Integer priority,
                                              String area, LocalDate startDate, LocalDate endDate,
                                              Pageable pageable) {
        Page<Task> page;
        
        if (!isAdmin()) {
            page = taskRepository.findWithFilters(
                    getCurrentUserId(), status, priority, area, startDate, endDate, search, pageable
            );
        } else {
            page = taskRepository.findWithFiltersAdmin(
                    status, priority, area, startDate, endDate, search, pageable
            );
        }

        List<TaskResponse> content = page.getContent()
                .stream()
                .map(taskMapper::toResponse)
                .toList();

        return PageResponse.of(content, page.getNumber(), page.getSize(), page.getTotalElements());
    }

    // ============================================================
    // 🔥 5) UPDATE — (Sahiplik kontrolü BURADA)
    // ============================================================

    @Override
    public TaskResponse update(Long id, TaskRequest request) {

        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Task not found"));

        // ⭐ Sahiplik kontrolü
        if (!task.getUserId().equals(getCurrentUserId()) && !isAdmin()) {
            throw new AccessDeniedException("You cannot update this task");
        }

        taskMapper.updateTaskFromRequest(request, task);

        Task saved = taskRepository.save(task);
        return taskMapper.toResponse(saved);
    }

    // ============================================================
    // 🔥 6) DELETE — (Sahiplik kontrolü BURADA)
    // ============================================================

    @Override
    public void delete(Long id) {

        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Task not found"));

        // ⭐ Sahiplik kontrolü
        if (!task.getUserId().equals(getCurrentUserId()) && !isAdmin()) {
            throw new AccessDeniedException("You cannot delete this task");
        }

        taskRepository.delete(task);
    }

    @Override
    @Transactional(readOnly = true)
    public List<TaskResponse> getByWeek(LocalDate startOfWeek, LocalDate endOfWeek) {
        // ⭐ USER: sadece kendi task'larını görür
        if (!isAdmin()) {
            return taskRepository.findByUserIdAndDueDateBetween(getCurrentUserId(), startOfWeek, endOfWeek)
                    .stream()
                    .map(taskMapper::toResponse)
                    .toList();
        }

        // ⭐ ADMIN: tüm task'ları görür
        return taskRepository.findByDueDateBetween(startOfWeek, endOfWeek)
                .stream()
                .map(taskMapper::toResponse)
                .toList();
    }
}