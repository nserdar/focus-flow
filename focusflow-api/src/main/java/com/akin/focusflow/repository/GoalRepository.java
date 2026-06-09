package com.akin.focusflow.repository;

import com.akin.focusflow.domain.enums.GoalStatus;
import com.akin.focusflow.domain.model.Goal;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;

public interface GoalRepository extends JpaRepository<Goal, Long> {
    List<Goal> findByStatus(GoalStatus status);
    List<Goal> findByArea(String area);
    List<Goal> findByUserId(Long userId);
    
    Page<Goal> findByUserId(Long userId, Pageable pageable);
    
    @Query("SELECT g FROM Goal g WHERE g.userId = :userId " +
           "AND (:status IS NULL OR g.status = :status) " +
           "AND (:priority IS NULL OR g.priority = :priority) " +
           "AND (:area IS NULL OR g.area = :area) " +
           "AND (:startDate IS NULL OR g.startDate >= :startDate) " +
           "AND (:endDate IS NULL OR g.endDate <= :endDate) " +
           "AND (:search IS NULL OR LOWER(g.title) LIKE LOWER(CONCAT('%', :search, '%')) " +
           "OR LOWER(g.description) LIKE LOWER(CONCAT('%', :search, '%')))")
    Page<Goal> findWithFilters(@Param("userId") Long userId,
                                @Param("status") GoalStatus status,
                                @Param("priority") Integer priority,
                                @Param("area") String area,
                                @Param("startDate") LocalDate startDate,
                                @Param("endDate") LocalDate endDate,
                                @Param("search") String search,
                                Pageable pageable);
    
    @Query("SELECT g FROM Goal g WHERE " +
           "(:status IS NULL OR g.status = :status) " +
           "AND (:priority IS NULL OR g.priority = :priority) " +
           "AND (:area IS NULL OR g.area = :area) " +
           "AND (:startDate IS NULL OR g.startDate >= :startDate) " +
           "AND (:endDate IS NULL OR g.endDate <= :endDate) " +
           "AND (:search IS NULL OR LOWER(g.title) LIKE LOWER(CONCAT('%', :search, '%')) " +
           "OR LOWER(g.description) LIKE LOWER(CONCAT('%', :search, '%')))")
    Page<Goal> findWithFiltersAdmin(@Param("status") GoalStatus status,
                                     @Param("priority") Integer priority,
                                     @Param("area") String area,
                                     @Param("startDate") LocalDate startDate,
                                     @Param("endDate") LocalDate endDate,
                                     @Param("search") String search,
                                     Pageable pageable);
}
