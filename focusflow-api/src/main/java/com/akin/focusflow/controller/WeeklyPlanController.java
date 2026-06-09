package com.akin.focusflow.controller;

import com.akin.focusflow.dto.request.WeeklyPlanRequest;
import com.akin.focusflow.dto.response.WeeklyPlanResponse;
import com.akin.focusflow.service.WeeklyPlanService;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/weekly-plans")
@Tag(name = "Weekly Plans", description = "Weekly plan management endpoints")
public class WeeklyPlanController {

    private final WeeklyPlanService weeklyPlanService;

    public WeeklyPlanController(WeeklyPlanService weeklyPlanService) {
        this.weeklyPlanService = weeklyPlanService;
    }

    @PostMapping
    public ResponseEntity<WeeklyPlanResponse> create(@Valid @RequestBody WeeklyPlanRequest request) {
        return ResponseEntity.ok(weeklyPlanService.create(request));
    }

    @GetMapping("/{id}")
    public ResponseEntity<WeeklyPlanResponse> getById(@PathVariable Long id) {
        return ResponseEntity.ok(weeklyPlanService.getById(id));
    }

    @GetMapping("/week")
    public ResponseEntity<WeeklyPlanResponse> getByWeek(
            @RequestParam Integer weekNumber,
            @RequestParam Integer year
    ) {
        return ResponseEntity.ok(weeklyPlanService.getByWeek(weekNumber, year));
    }

    @GetMapping
    public ResponseEntity<List<WeeklyPlanResponse>> getAll() {
        return ResponseEntity.ok(weeklyPlanService.getAll());
    }

    @PutMapping("/{id}")
    public ResponseEntity<WeeklyPlanResponse> update(
            @PathVariable Long id,
            @Valid @RequestBody WeeklyPlanRequest request) {
        return ResponseEntity.ok(weeklyPlanService.update(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        weeklyPlanService.delete(id);
        return ResponseEntity.noContent().build();
    }
}