package com.akin.focusflow.controller;

import com.akin.focusflow.domain.enums.GoalStatus;
import com.akin.focusflow.dto.request.GoalRequest;
import com.akin.focusflow.dto.response.PageResponse;
import com.akin.focusflow.dto.response.GoalResponse;
import com.akin.focusflow.service.GoalService;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/goals")
@Tag(name = "Goals", description = "Goal management endpoints")
public class GoalController {

    private final GoalService goalService;

    public GoalController(GoalService goalService) {
        this.goalService = goalService;
    }

    @PostMapping
    public ResponseEntity<GoalResponse> create(@Valid @RequestBody GoalRequest request){
        return ResponseEntity.status(HttpStatus.CREATED).body(goalService.create(request));
    }

    @GetMapping("/{id}")
    public ResponseEntity<GoalResponse> getById(@PathVariable Long id){
        return ResponseEntity.ok(goalService.getById(id));
    }

    @GetMapping
    public ResponseEntity<?> getAll(
            @RequestParam(required = false, defaultValue = "0") int page,
            @RequestParam(required = false, defaultValue = "20") int size,
            @RequestParam(required = false, defaultValue = "createdAt") String sortBy,
            @RequestParam(required = false, defaultValue = "DESC") String sortDir
    ){
        // Eğer pagination parametreleri yoksa eski getAll metodunu kullan
        if (page == 0 && size == 20 && "createdAt".equals(sortBy) && "DESC".equals(sortDir)) {
            return ResponseEntity.ok(goalService.getAll());
        }
        
        Sort sort = Sort.by(Sort.Direction.fromString(sortDir), sortBy);
        Pageable pageable = PageRequest.of(page, size, sort);
        return ResponseEntity.ok(goalService.getAll(pageable));
    }

    @GetMapping("/search")
    public ResponseEntity<PageResponse<GoalResponse>> search(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) GoalStatus status,
            @RequestParam(required = false) Integer priority,
            @RequestParam(required = false) String area,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate,
            @RequestParam(required = false, defaultValue = "0") int page,
            @RequestParam(required = false, defaultValue = "20") int size,
            @RequestParam(required = false, defaultValue = "createdAt") String sortBy,
            @RequestParam(required = false, defaultValue = "DESC") String sortDir
    ){
        Sort sort = Sort.by(Sort.Direction.fromString(sortDir), sortBy);
        Pageable pageable = PageRequest.of(page, size, sort);
        return ResponseEntity.ok(goalService.search(search, status, priority, area, startDate, endDate, pageable));
    }

    @PutMapping("/{id}")
    public ResponseEntity<GoalResponse> update(@PathVariable Long id,
                                               @Valid @RequestBody GoalRequest request) {
        return ResponseEntity.ok(goalService.update(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id){
        goalService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/area/{area}")
    public ResponseEntity<List<GoalResponse>> getByArea(@PathVariable String area){
        return ResponseEntity.ok(goalService.getByArea(area));
    }


}
