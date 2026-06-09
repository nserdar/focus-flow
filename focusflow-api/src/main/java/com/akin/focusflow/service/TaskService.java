package com.akin.focusflow.service;

import com.akin.focusflow.domain.enums.TaskStatus;
import com.akin.focusflow.dto.request.TaskRequest;
import com.akin.focusflow.dto.response.PageResponse;
import com.akin.focusflow.dto.response.TaskResponse;
import org.springframework.data.domain.Pageable;

import java.time.LocalDate;
import java.util.List;

public interface TaskService {
    TaskResponse create(TaskRequest request);
    TaskResponse getById(Long id);
    List<TaskResponse> getAll();
    PageResponse<TaskResponse> getAll(Pageable pageable);
    PageResponse<TaskResponse> search(String search, TaskStatus status, Integer priority, 
                                      String area, LocalDate startDate, LocalDate endDate, 
                                      Pageable pageable);
    TaskResponse update(Long id, TaskRequest request);
    void delete(Long id);
    List<TaskResponse> getByWeek(LocalDate startOfWeek, LocalDate endOfWeek);
}
