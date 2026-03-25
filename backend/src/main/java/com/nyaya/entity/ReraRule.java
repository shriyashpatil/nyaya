package com.nyaya.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "rera_rules", indexes = {
    @Index(name = "idx_rera_state", columnList = "state"),
    @Index(name = "idx_rera_rule_id", columnList = "rule_id", unique = true)
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ReraRule {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "rule_id", nullable = false, unique = true, length = 50)
    private String ruleId;

    @Column(nullable = false, length = 100)
    private String state;

    @Column(nullable = false, length = 255)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(length = 500)
    private String penalty;

    @Column(name = "documents_required", columnDefinition = "TEXT")
    private String documentsRequired;

    @Column(length = 200)
    private String timeline;

    @Column(name = "source_reference", length = 200)
    private String sourceReference;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;
}
