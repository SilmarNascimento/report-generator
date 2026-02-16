package com.mateco.reportgenerator.model.entity;

import com.mateco.reportgenerator.enums.ClassGroup;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.SQLRestriction;

import java.io.Serializable;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@SQLRestriction("deleted_at IS NULL")
@SQLDelete(sql = "UPDATE student SET deleted_at = current_timestamp WHERE id = ?")
public class Student implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(cascade = CascadeType.ALL, optional = false)
    @JoinColumn(name = "user_id", referencedColumnName = "id", unique = true)
    private User user;

    @Column(nullable = false, unique = true, length = 11)
    private String cpf;

    @Column(length = 4, nullable = false)
    private Integer enrollmentYear;

    @ElementCollection(targetClass = ClassGroup.class, fetch = FetchType.EAGER)
    @CollectionTable(name = "student_class_groups", joinColumns = @JoinColumn(name = "student_id"))
    @Enumerated(EnumType.STRING)
    @Column(name = "class_group")
    private List<ClassGroup> classGroups = new ArrayList<>();

    @Column(nullable = false)
    private Instant activationDate;

    private String photoUrl;

    @Column(name = "deleted_at")
    private Instant deletedAt;

    @Embedded
    private Address address;

    @OneToMany(mappedBy = "student", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<MockExamResponse> mockExamResponses;

    public String getStudentName() {
        return user != null ? user.getName() : null;
    }

    public String getStudentEmail() {
        return user != null ? user.getEmail() : null;
    }
}