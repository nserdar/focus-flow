package com.akin.focusflow.domain.model;

import com.akin.focusflow.domain.enums.TaskStatus;
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
@Table(name = "tasks")
public class Task {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column
    private Long goalId;

    @Column(nullable = false)
    private Long userId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "userId", insertable = false, updatable = false)
    private AppUser user;

    //insertable = false, updatable = false → goalId’yı API üzerinden kontrol etmemize izin verir.
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "goalId", insertable = false, updatable = false)
    private Goal goal;

    @OneToMany(fetch = FetchType.LAZY)
    @JoinColumn(name = "taskId", insertable = false, updatable = false)
    private List<FocusSession> focusSessions;

    @Column(nullable = false, length = 150)
    private String title;

    @Column(length = 1000)
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    @Builder.Default  // = TaskStatus.TOD O; atamasını yapabilmek için kullanılır
    private TaskStatus status = TaskStatus.TODO;

    /*
    1: low, 2:normal, 3: high, 4: critical
     */
    @Builder.Default  //varsayılan değerleri korumak için kullanılır.
    private Integer priority = 2;  //@Builder.Default kullanmazsak = 2 değeri atanmaz: (goal.getPriority()); // null 😱
                                   //@Builder.Default kullandığımız için: (goal.getPriority()); // 2 ✅
    @Column(length = 100)
    private String area; // "Work", "Academic", "Health", ...

    private LocalDate dueDate;

    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private OffsetDateTime createdAt;

    @UpdateTimestamp
    private OffsetDateTime updatedAt;
}
