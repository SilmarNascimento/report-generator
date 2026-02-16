package com.mateco.reportgenerator.mapper;

import com.mateco.reportgenerator.controller.dto.mockExamDto.MockExamResponseDto;
import com.mateco.reportgenerator.controller.dto.student.ClassGroupPerformanceDto;
import com.mateco.reportgenerator.controller.dto.student.StudentRequestDto;
import com.mateco.reportgenerator.controller.dto.student.StudentResponseDto;
import com.mateco.reportgenerator.controller.dto.student.YearlyPerformanceDto;
import com.mateco.reportgenerator.enums.ClassGroup;
import com.mateco.reportgenerator.model.entity.MockExamResponse;
import com.mateco.reportgenerator.model.entity.Student;
import org.mapstruct.*;

import java.util.*;
import java.util.stream.Collectors;

@Mapper(componentModel = "spring", uses = {DateMapper.class}, unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface StudentMapper {

    @Mapping(target = "user.name", source = "name")
    @Mapping(target = "user.email", source = "email")
    @Mapping(target = "address", source = "address")
    @Mapping(target = "classGroups", source = "classGroups")
    @Mapping(target = "user.username", ignore = true)
    @Mapping(target = "user.password", ignore = true)
    @Mapping(target = "user.roles", ignore = true)
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "deletedAt", ignore = true)
    @Mapping(target = "mockExamResponses", ignore = true)
    Student toEntity(StudentRequestDto dto);

    @Mapping(target = "name", source = "user.name")
    @Mapping(target = "email", source = "user.email")
    @Mapping(target = "performanceHistory", source = "mockExamResponses", qualifiedByName = "mapPerformanceHistory")
    StudentResponseDto toDto(Student student);

    @Mapping(target = "user.name", source = "name")
    @Mapping(target = "user.email", source = "email")
    @Mapping(target = "address", source = "address")
    @Mapping(target = "user.username", ignore = true)
    @Mapping(target = "user.password", ignore = true)
    @Mapping(target = "user.roles", ignore = true)
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "deletedAt", ignore = true)
    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    void updateEntity(StudentRequestDto dto, @MappingTarget Student student);

    @Named("mapClassGroups")
    default List<ClassGroup> mapClassGroups(List<MockExamResponse> responses) {
        if (responses == null) return Collections.emptyList();

        return responses.stream()
                .filter(r -> r.getMockExam() != null
                        && r.getMockExam().getClassName() != null
                        && !r.getMockExam().getClassName().isEmpty())

                .map(r -> {
                    try {
                        String classString = r.getMockExam().getClassName().get(0);
                        return ClassGroup.valueOf(classString);
                    } catch (IllegalArgumentException e) {
                        return null;
                    }
                })
                .filter(Objects::nonNull)
                .distinct()
                .sorted()
                .toList();
    }

    @Named("mapPerformanceHistory")
    default List<YearlyPerformanceDto> mapPerformanceHistory(List<MockExamResponse> responses) {
        if (responses == null) return Collections.emptyList();

        Map<Integer, List<MockExamResponse>> byYear = responses.stream()
                .collect(Collectors.groupingBy(r -> r.getMockExam().getReleasedYear()));

        List<YearlyPerformanceDto> yearlyDtos = new ArrayList<>();

        for (Map.Entry<Integer, List<MockExamResponse>> entryYear : byYear.entrySet()) {
            Integer year = entryYear.getKey();

            Map<ClassGroup, List<MockExamResponse>> byClass = entryYear.getValue().stream()
                    .filter(r -> r.getMockExam().getClassName() != null && !r.getMockExam().getClassName().isEmpty())
                    .collect(Collectors.groupingBy(r -> {
                        String classString = r.getMockExam().getClassName().get(0);
                        return ClassGroup.valueOf(classString);
                    }));

            List<ClassGroupPerformanceDto> classDtos = new ArrayList<>();

            for (Map.Entry<ClassGroup, List<MockExamResponse>> entryClass : byClass.entrySet()) {

                ClassGroup groupEnum = entryClass.getKey();

                List<MockExamResponseDto> examDtos = entryClass.getValue().stream()
                        .map(r -> new MockExamResponseDto(
                                r.getId(),
                                r.getMockExam().getName(),
                                r.getMockExam().getNumber(),
                                r.getCorrectAnswers(),
                                r.getIpmScore()
                        ))
                        .toList();

                classDtos.add(new ClassGroupPerformanceDto(groupEnum, examDtos));
            }
            yearlyDtos.add(new YearlyPerformanceDto(year, classDtos));
        }

        yearlyDtos.sort(Comparator.comparing(YearlyPerformanceDto::year).reversed());
        return yearlyDtos;
    }
}