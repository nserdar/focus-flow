package com.akin.focusflow.controller;

import com.akin.focusflow.dto.request.FocusSessionRequest;
import com.akin.focusflow.dto.response.FocusSessionResponse;
import com.akin.focusflow.dto.response.PageResponse;
import com.akin.focusflow.service.FocusSessionService;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.OffsetDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/focus-sessions")
@Tag(name = "Focus Sessions", description = "Focus session management endpoints")
public class FocusSessionController {

    private final FocusSessionService sessionService;

    public FocusSessionController(FocusSessionService sessionService) {
        this.sessionService = sessionService;
    }

    @PostMapping
    public ResponseEntity<FocusSessionResponse> start(@Valid @RequestBody FocusSessionRequest request) {
        return ResponseEntity.ok(sessionService.start(request));
    }

    @PutMapping("/{id}/finish")
    public ResponseEntity<FocusSessionResponse> finish(
            @PathVariable Long id,
            @RequestBody FocusSessionRequest request) {
        return ResponseEntity.ok(sessionService.finish(id, request));
    }

    @GetMapping("/{id}")
    public ResponseEntity<FocusSessionResponse> getById(@PathVariable Long id) {
        return ResponseEntity.ok(sessionService.getById(id));
    }

    @GetMapping("/task/{taskId}")
    public ResponseEntity<List<FocusSessionResponse>> getByTask(@PathVariable Long taskId) {
        return ResponseEntity.ok(sessionService.getByTask(taskId));
    }

    @GetMapping
    public ResponseEntity<?> getAll(
            @RequestParam(required = false, defaultValue = "0") int page,
            @RequestParam(required = false, defaultValue = "20") int size,
            @RequestParam(required = false, defaultValue = "startedAt") String sortBy,
            @RequestParam(required = false, defaultValue = "DESC") String sortDir
    ){
        // Map frontend sortBy to entity field name
        String entitySortBy = sortBy;
        if ("startTime".equals(sortBy)) {
            entitySortBy = "startedAt";
        } else if ("endTime".equals(sortBy)) {
            entitySortBy = "finishedAt";
        }
        Sort sort = Sort.by(Sort.Direction.fromString(sortDir), entitySortBy);
        Pageable pageable = PageRequest.of(page, size, sort);
        return ResponseEntity.ok(sessionService.getAll(pageable));
    }

    @GetMapping("/search")
    public ResponseEntity<PageResponse<FocusSessionResponse>> search(
            @RequestParam(required = false) Long taskId,
            @RequestParam(required = false) Boolean completed,
            @RequestParam(required = false) Boolean active,
            @RequestParam(required = false) Boolean canceled,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) OffsetDateTime startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) OffsetDateTime endDate,
            @RequestParam(required = false, defaultValue = "0") int page,
            @RequestParam(required = false, defaultValue = "20") int size,
            @RequestParam(required = false, defaultValue = "startedAt") String sortBy,
            @RequestParam(required = false, defaultValue = "DESC") String sortDir
    ){
        Sort sort = Sort.by(Sort.Direction.fromString(sortDir), sortBy);
        Pageable pageable = PageRequest.of(page, size, sort);
        return ResponseEntity.ok(sessionService.search(taskId, completed, active, canceled, startDate, endDate, pageable));
    }

    @PutMapping("/{id}/cancel")
    public ResponseEntity<Void> cancel(@PathVariable Long id) {
        sessionService.cancel(id);
        return ResponseEntity.noContent().build();
    }
}