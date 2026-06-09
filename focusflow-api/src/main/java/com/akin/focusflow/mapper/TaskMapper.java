package com.akin.focusflow.mapper;

import com.akin.focusflow.domain.model.Task;
import com.akin.focusflow.dto.request.TaskRequest;
import com.akin.focusflow.dto.response.TaskResponse;
import org.mapstruct.*;

@Mapper(componentModel = "spring")
public interface TaskMapper {
    // Manual mapping - MapStruct has issues with record to entity mapping
    default Task toEntity(TaskRequest request) {
        if (request == null) {
            return null;
        }
        return Task.builder()
                .title(request.title())
                .description(request.description())
                .status(request.status() != null ? request.status() : com.akin.focusflow.domain.enums.TaskStatus.TODO)
                .dueDate(request.dueDate())
                .priority(request.priority() != null ? request.priority() : 2)
                .area(request.area())
                .goalId(request.goalId())
                .build();
    }
    
    @Mapping(target = "totalFocusSeconds", expression = "java(calculateTotalFocusSeconds(task))")
    @Mapping(target = "goalId", expression = "java(task.getGoal() != null ? task.getGoal().getId() : null)")
    @Mapping(target = "goalTitle", expression = "java(task.getGoal() != null ? task.getGoal().getTitle() : null)")
    TaskResponse toResponse(Task task);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    void updateTaskFromRequest(TaskRequest request, @MappingTarget Task task);

    default Long calculateTotalFocusSeconds(Task task) {
        if (task.getFocusSessions() == null) {
            return 0L;
        }
        return task.getFocusSessions()
                .stream()
                .filter(s -> s.getDurationMinutes() != null)
                .mapToLong(s -> s.getDurationMinutes() * 60L) // Convert minutes to seconds
                .sum();
    }
}