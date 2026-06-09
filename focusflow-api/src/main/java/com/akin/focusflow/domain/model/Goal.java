package com.akin.focusflow.domain.model;

import com.akin.focusflow.domain.enums.GoalStatus;
import com.akin.focusflow.security.model.AppUser;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDate;
import java.time.OffsetDateTime;
import java.util.List;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "goals")
public class Goal {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long userId;

    @ManyToOne(fetch = FetchType.LAZY)
    //insertable = false, updatable = false: bu field'ın sadece okunabilir (read-only) olduğunu belirtir.
    //❌ INSERT sorgusunda bu kolon kullanılmaz
    //❌ UPDATE sorgusunda bu kolon değiştirilemez
    //✅ Sadece SELECT (okuma) için kullanılır
    @JoinColumn(name = "userId", insertable = false, updatable = false)
    private AppUser user;

    @OneToMany(fetch = FetchType.LAZY)
    @JoinColumn(name = "goalId", insertable = false, updatable = false)
    private List<Task> tasks;

    @Column(nullable = false, length = 150)
    private String title;

    @Column(length = 1000)
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    @Builder.Default
    private GoalStatus status = GoalStatus.NOT_STARTED;

    private LocalDate startDate;
    private LocalDate endDate;

    /*
    1: low, 2: normal, 3: high, 4: critical
     */
    @Builder.Default
    private Integer priority = 2;

    @Column(length = 100)
    private String area;

    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private OffsetDateTime createdAt;

    @UpdateTimestamp
    private OffsetDateTime updatedAt;

}
