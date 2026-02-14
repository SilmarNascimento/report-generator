package com.mateco.reportgenerator.mapper;

import com.mateco.reportgenerator.controller.dto.student.StudentRequestDto;
import com.mateco.reportgenerator.controller.dto.student.StudentResponseDto;
import com.mateco.reportgenerator.model.entity.Student;
import org.mapstruct.*;

@Mapper(componentModel = "spring", uses = {DateMapper.class}, unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface StudentMapper {

    @Mapping(target = "user.name", source = "name")
    @Mapping(target = "user.email", source = "email")
    @Mapping(target = "address", source = "address")
    @Mapping(target = "user.username", ignore = true)
    @Mapping(target = "user.password", ignore = true)
    @Mapping(target = "user.roles", ignore = true)
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "deletedAt", ignore = true)
    Student toEntity(StudentRequestDto dto);

    @Mapping(target = "name", source = "user.name")
    @Mapping(target = "email", source = "user.email")
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
}