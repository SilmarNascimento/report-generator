package com.mateco.reportgenerator.specifications;

import com.mateco.reportgenerator.controller.dto.student.StudentFilter;
import com.mateco.reportgenerator.model.entity.Student;
import com.mateco.reportgenerator.utils.TextUtils;
import jakarta.persistence.criteria.Expression;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.util.StringUtils;

import java.util.ArrayList;
import java.util.List;

public class StudentSpecifications {

    private StudentSpecifications() {
    }

    public static Specification<Student> withFilter(StudentFilter filter) {
        return (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            if (StringUtils.hasText(filter.name())) {
                String termoTratado = "%" + TextUtils.normalize(filter.name()) + "%";

                Expression<String> unaccentNome = cb.function("unaccent", String.class, root.get("user").get("name"));
                Expression<String> lowerUnaccentNome = cb.lower(unaccentNome);

                predicates.add(cb.like(lowerUnaccentNome, termoTratado.toLowerCase()));
            }

            if (StringUtils.hasText(filter.email())) {
                String emailTratado = "%" + filter.email().toLowerCase().trim() + "%";

                predicates.add(cb.like(
                        cb.lower(root.get("user").get("email")),
                        emailTratado
                ));
            }

            if (StringUtils.hasText(filter.cpf())) {
                String cpfLimpo = filter.cpf().replaceAll("\\D", "");
                predicates.add(cb.equal(root.get("cpf"), cpfLimpo));
            }

            if (filter.classGroup() != null) {
                predicates.add(cb.equal(root.get("classGroup"), filter.classGroup()));
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }
}