package com.akin.focusflow.mapper;

import com.akin.focusflow.domain.enums.FocusSessionStatus;
import com.akin.focusflow.domain.model.FocusSession;
import com.akin.focusflow.dto.request.FocusSessionRequest;
import com.akin.focusflow.dto.response.FocusSessionResponse;
import org.mapstruct.*;

@Mapper(componentModel = "spring")
public interface FocusSessionMapper {

    // Manual mapping - MapStruct has issues with record to entity mapping
    default FocusSession toEntity(FocusSessionRequest request) {
        if (request == null) {
            return null;
        }
        return FocusSession.builder()
                .taskId(request.taskId())
                .durationMinutes(request.durationMinutes())
                .type(request.type())
                .startedAt(request.startTime())
                .finishedAt(request.endTime())
                .active(false)
                .completed(false)
                .canceled(false)
                .build();
    }

    default FocusSessionResponse toResponse(FocusSession session) {
        if (session == null) {
            return null;
        }
        return new FocusSessionResponse(
                session.getId(),
                session.getTaskId(),
                mapStatus(session),
                session.getType(),
                session.getStartedAt(),
                session.getFinishedAt(),
                calculateDurationSeconds(session),
                session.getStartedAt(),
                session.getFinishedAt()
        );
    }

    default void updateSessionFromRequest(FocusSessionRequest request, @MappingTarget FocusSession session) {
        if (request == null || session == null) {
            return;
        }
        if (request.taskId() != null) {
            session.setTaskId(request.taskId());
        }
        if (request.durationMinutes() != null) {
            session.setDurationMinutes(request.durationMinutes());
        }
        if (request.type() != null) {
            session.setType(request.type());
        }
        if (request.startTime() != null) {
            session.setStartedAt(request.startTime());
        }
        if (request.endTime() != null) {
            session.setFinishedAt(request.endTime());
        }
    }
    
    default FocusSessionStatus mapStatus(FocusSession session) {
        if (session == null) {
            return FocusSessionStatus.IN_PROGRESS;
        }
        if (session.isCanceled()) {
            return FocusSessionStatus.CANCELLED;
        } else if (session.isCompleted()) {
            return FocusSessionStatus.COMPLETED;
        } else if (session.isActive()) {
            return FocusSessionStatus.IN_PROGRESS;
        }
        return FocusSessionStatus.IN_PROGRESS;
    }
    
    default Long calculateDurationSeconds(FocusSession session) {
        if (session == null) {
            return 0L;
        }
        if (session.getDurationMinutes() != null) {
            return session.getDurationMinutes() * 60L;
        }
        if (session.getStartedAt() != null && session.getFinishedAt() != null) {
            return java.time.Duration.between(session.getStartedAt(), session.getFinishedAt()).getSeconds();
        }
        return 0L;
    }
}