package com.akin.focusflow.domain.model;

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
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "weekly_plan")
public class WeeklyPlan {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long userId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "userId", insertable = false, updatable = false)
    private AppUser user;

    private Integer weekNumber;

    private Integer year;

    @Column(nullable = false)
    private LocalDate startDate;

    @Column(nullable = false)
    private LocalDate endDate;

    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private OffsetDateTime createdAt;  //OffsetDateTime, UTC'den sapma bilgisini (+03:00, -05:00 vb.) içerir. Global uygulamalar için ideal

    @UpdateTimestamp
    private OffsetDateTime updatedAt;

    /**
     * WeeklyPlan → Task listesi
     */
    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
            name = "weekly_plan_tasks",
            joinColumns = @JoinColumn(name = "weekly_plan_id"),
            inverseJoinColumns = @JoinColumn(name = "task_id")
    )
    private List<Task> tasks;

    /**
     * WeeklyPlan → Goal listesi
     */
    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(  //Yeni bir ara tablo (junction table) oluşturur,
            name = "weekly_plan_goals",  // adı weekly_plan_goals.
            joinColumns = @JoinColumn(name = "weekly_plan_id"),  //Mevcut sınıfın (WeeklyPlan) ID'sini tutar
            inverseJoinColumns = @JoinColumn(name = "goal_id")   //Karşı tarafın (Goal) ID'sini tutar
    )
    private List<Goal> goals;
}