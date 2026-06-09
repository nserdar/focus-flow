package com.akin.focusflow.domain.model;

import com.akin.focusflow.security.model.AppUser;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.OffsetDateTime;

@Entity
@Table(name = "focus_sessions")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FocusSession {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // ⭐ Session hangi task'a bağlı?
    @Column(nullable = false)
    private Long taskId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "taskId", insertable = false, updatable = false)
    private Task task;

    // ⭐ Session hangi kullanıcıya ait?
    @Column(nullable = false)
    private Long userId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "userId", insertable = false, updatable = false)
    private AppUser user;

    // ⭐ Session başlangıç - bitiş zamanları
    @CreationTimestamp
    private OffsetDateTime startedAt;

    private OffsetDateTime finishedAt;

    // ⭐ Session durumları
    @Column(nullable = false)
    @Builder.Default
    private boolean active = false;

    @Column(nullable = false)
    @Builder.Default
    private boolean completed = false;

    @Column(nullable = false)
    @Builder.Default
    private boolean canceled = false;

    // ⭐ Süre veya ek bilgiler varsa
    private Integer durationMinutes; // opsiyonel
    
    // ⭐ Session tipi
    @Enumerated(EnumType.STRING)
    @Column(length = 20)
    private com.akin.focusflow.domain.enums.FocusSessionType type;
}