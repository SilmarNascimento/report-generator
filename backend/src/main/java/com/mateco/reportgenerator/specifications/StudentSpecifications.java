package com.mateco.reportgenerator.specifications;

import com.mateco.reportgenerator.controller.dto.student.StudentFilter;
import com.mateco.reportgenerator.model.entity.Student;
import com.mateco.reportgenerator.utils.TextUtils;
import jakarta.persistence.criteria.JoinType;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.util.StringUtils;

import java.util.ArrayList;
import java.util.List;

public class StudentSpecifications {

    private StudentSpecifications() {}

    public static Specification<Student> withFilter(StudentFilter filter) {
        return (root, query, cb) -> {
            if (query.getResultType().equals(Student.class)) {
                root.fetch("user", JoinType.LEFT);
            }

            if (filter == null || !StringUtils.hasText(filter.query())) {
                return null;
            }

            String termo = filter.query().trim();
            String termoNormalizado = TextUtils.normalize(termo).toLowerCase();
            String likePattern = "%" + termoNormalizado + "%";

            List<Predicate> predicates = new ArrayList<>();

            try {
                var unaccentFunc = cb.function("unaccent", String.class, root.get("user").get("name"));
                predicates.add(cb.like(cb.lower(unaccentFunc), likePattern));
            } catch (Exception e) {
                predicates.add(cb.like(cb.lower(root.get("user").get("name")), likePattern));
            }

            predicates.add(cb.like(cb.lower(root.get("user").get("email")), likePattern));

            String termoNumerico = termo.replaceAll("\\D", "");
            if (StringUtils.hasText(termoNumerico)) {
                predicates.add(cb.like(root.get("cpf"), "%" + termoNumerico + "%"));
            }

            var groupsJoin = root.join("classGroups", JoinType.LEFT);
            predicates.add(cb.like(
                    cb.lower(groupsJoin.as(String.class)),
                    likePattern
            ));

            return cb.or(predicates.toArray(new Predicate[0]));
        };
    }
}