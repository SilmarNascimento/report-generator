package com.mateco.reportgenerator.service.implementation;

import com.mateco.reportgenerator.controller.dto.user.UserCreateDto;
import com.mateco.reportgenerator.controller.dto.user.UserResponseDto;
import com.mateco.reportgenerator.model.entity.User;
import com.mateco.reportgenerator.model.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Transactional
    public UserResponseDto createUser(UserCreateDto dto) {
        if (userRepository.existsByUsername(dto.username())) {
            throw new IllegalArgumentException("Username já existe");
        }
        if (userRepository.existsByEmail(dto.email())) {
            throw new IllegalArgumentException("Email já existe");
        }

        User user = User.builder()
                .username(dto.username())
                .name(dto.name())
                .email(dto.email())
                .password(passwordEncoder.encode(dto.password()))
                .build();


        User savedUser = userRepository.save(user);
        return mapToResponseDTO(savedUser);
    }

    @Transactional(readOnly = true)
    public List<UserResponseDto> findAll() {
        return userRepository.findAll()
                .stream()
                .map(this::mapToResponseDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public UserResponseDto findById(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado com id: " + id));
        return mapToResponseDTO(user);
    }

    private UserResponseDto mapToResponseDTO(User user) {
        return new UserResponseDto(
                user.getId(),
                user.getUsername(),
                user.getName(),
                user.getEmail(),
                null
        );
    }
}