package com.mateco.reportgenerator.model.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Role {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(updatable = false, unique = true)
    private Long id;

    @Enumerated(EnumType.STRING)
    private RoleName name;

    public Role(RoleName roleName) {
        this.name = roleName;
    }
}