package com.akin.focusflow.service;

import com.akin.focusflow.dto.request.FocusSessionRequest;
import com.akin.focusflow.dto.response.FocusSessionResponse;
import com.akin.focusflow.dto.response.PageResponse;
import org.springframework.data.domain.Pageable;

import java.time.OffsetDateTime;
import java.util.List;

public interface FocusSessionService {

    FocusSessionResponse start(FocusSessionRequest request);

    FocusSessionResponse finish(Long id, FocusSessionRequest request);

    FocusSessionResponse getById(Long id);

    List<FocusSessionResponse> getByTask(Long taskId);
    
    PageResponse<FocusSessionResponse> getAll(Pageable pageable);
    
    PageResponse<FocusSessionResponse> search(Long taskId, Boolean completed, Boolean active, 
                                             Boolean canceled, OffsetDateTime startDate, 
                                             OffsetDateTime endDate, Pageable pageable);

    void cancel(Long id);


}