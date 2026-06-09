package com.akin.focusflow.mapper;

import com.akin.focusflow.domain.model.Goal;
import com.akin.focusflow.dto.request.GoalRequest;
import com.akin.focusflow.dto.response.GoalResponse;
import org.mapstruct.*;
import org.springframework.beans.factory.annotation.Autowired;

@Mapper(componentModel = "spring", uses = {TaskMapper.class})
public interface GoalMapper {
    Goal toEntity(GoalRequest request);
    
    @Mapping(target = "tasks", ignore = true)
    GoalResponse toResponse(Goal goal);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    void updateGoalFromRequest(GoalRequest request, @MappingTarget Goal goal);
}
