package com.akin.focusflow.repository;

import com.akin.focusflow.domain.enums.TaskStatus;
import com.akin.focusflow.domain.model.Task;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;

public interface TaskRepository extends JpaRepository<Task, Long>, JpaSpecificationExecutor<Task> {
    List<Task> findByStatus(TaskStatus status);
    List<Task> findByDueDateBetween(LocalDate start, LocalDate end);
    List<Task> findByUserId(Long userId);
    List<Task> findByUserIdAndDueDateBetween(Long userId, LocalDate start, LocalDate end);
    
    Page<Task> findByUserId(Long userId, Pageable pageable);
    
    @Query("SELECT t FROM Task t WHERE t.userId = :userId " +
           "AND (:status IS NULL OR t.status = :status) " +
           "AND (:priority IS NULL OR t.priority = :priority) " +
           "AND (:area IS NULL OR t.area = :area) " +
           "AND (:startDate IS NULL OR t.dueDate >= :startDate) " +
           "AND (:endDate IS NULL OR t.dueDate <= :endDate) " +
           "AND (:search IS NULL OR LOWER(t.title) LIKE LOWER(CONCAT('%', :search, '%')) " +
           "OR LOWER(t.description) LIKE LOWER(CONCAT('%', :search, '%')))")
    Page<Task> findWithFilters(@Param("userId") Long userId,
                                @Param("status") TaskStatus status,
                                @Param("priority") Integer priority,
                                @Param("area") String area,
                                @Param("startDate") LocalDate startDate,
                                @Param("endDate") LocalDate endDate,
                                @Param("search") String search,
                                Pageable pageable);
    
    @Query("SELECT t FROM Task t WHERE " +
           "(:status IS NULL OR t.status = :status) " +
           "AND (:priority IS NULL OR t.priority = :priority) " +
           "AND (:area IS NULL OR t.area = :area) " +
           "AND (:startDate IS NULL OR t.dueDate >= :startDate) " +
           "AND (:endDate IS NULL OR t.dueDate <= :endDate) " +
           "AND (:search IS NULL OR LOWER(t.title) LIKE LOWER(CONCAT('%', :search, '%')) " +
           "OR LOWER(t.description) LIKE LOWER(CONCAT('%', :search, '%')))")
    Page<Task> findWithFiltersAdmin(@Param("status") TaskStatus status,
                                     @Param("priority") Integer priority,
                                     @Param("area") String area,
                                     @Param("startDate") LocalDate startDate,
                                     @Param("endDate") LocalDate endDate,
                                     @Param("search") String search,
                                     Pageable pageable);
}
