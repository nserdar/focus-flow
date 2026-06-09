package com.akin.focusflow.repository;

import com.akin.focusflow.domain.model.FocusSession;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.OffsetDateTime;
import java.util.List;

public interface FocusSessionRepository extends JpaRepository<FocusSession, Long> {

    List<FocusSession> findByTaskId(Long taskId);

    List<FocusSession> findByUserId(Long userId);
    
    Page<FocusSession> findByUserId(Long userId, Pageable pageable);
    
    Page<FocusSession> findByTaskId(Long taskId, Pageable pageable);
    
    @Query("SELECT s FROM FocusSession s WHERE s.userId = :userId " +
           "AND (:taskId IS NULL OR s.taskId = :taskId) " +
           "AND (:completed IS NULL OR s.completed = :completed) " +
           "AND (:active IS NULL OR s.active = :active) " +
           "AND (:canceled IS NULL OR s.canceled = :canceled) " +
           "AND (:startDate IS NULL OR s.startedAt >= :startDate) " +
           "AND (:endDate IS NULL OR s.startedAt <= :endDate)")
    Page<FocusSession> findWithFilters(@Param("userId") Long userId,
                                       @Param("taskId") Long taskId,
                                       @Param("completed") Boolean completed,
                                       @Param("active") Boolean active,
                                       @Param("canceled") Boolean canceled,
                                       @Param("startDate") OffsetDateTime startDate,
                                       @Param("endDate") OffsetDateTime endDate,
                                       Pageable pageable);
    
    @Query("SELECT s FROM FocusSession s WHERE " +
           "(:taskId IS NULL OR s.taskId = :taskId) " +
           "AND (:completed IS NULL OR s.completed = :completed) " +
           "AND (:active IS NULL OR s.active = :active) " +
           "AND (:canceled IS NULL OR s.canceled = :canceled) " +
           "AND (:startDate IS NULL OR s.startedAt >= :startDate) " +
           "AND (:endDate IS NULL OR s.startedAt <= :endDate)")
    Page<FocusSession> findWithFiltersAdmin(@Param("taskId") Long taskId,
                                             @Param("completed") Boolean completed,
                                             @Param("active") Boolean active,
                                             @Param("canceled") Boolean canceled,
                                             @Param("startDate") OffsetDateTime startDate,
                                             @Param("endDate") OffsetDateTime endDate,
                                             Pageable pageable);
}