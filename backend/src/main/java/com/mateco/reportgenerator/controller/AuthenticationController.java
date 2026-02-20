package com.mateco.reportgenerator.controller;

import com.mateco.reportgenerator.controller.dto.auth.AuthenticationDto;
import com.mateco.reportgenerator.controller.dto.auth.LoginResponseDto;
import com.mateco.reportgenerator.controller.dto.user.UserCreateDto;
import com.mateco.reportgenerator.controller.dto.user.UserResponseDto;
import com.mateco.reportgenerator.model.entity.User;
import com.mateco.reportgenerator.service.implementation.TokenService;
import com.mateco.reportgenerator.service.implementation.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthenticationController {

    private final AuthenticationManager authenticationManager;
    private final TokenService tokenService;
    private final UserService userService;

    @PostMapping("/login")
    public ResponseEntity<LoginResponseDto> login(@RequestBody @Validated AuthenticationDto data) {
        var usernamePassword = new UsernamePasswordAuthenticationToken(data.username(), data.password());
        var auth = authenticationManager.authenticate(usernamePassword);
        var token = tokenService.generateToken((User) auth.getPrincipal());

        return ResponseEntity.ok(new LoginResponseDto(token));
    }

    @PostMapping("/register")
    public ResponseEntity<UserResponseDto> register(@RequestBody @Validated UserCreateDto data) {
        var userResponse = userService.createUser(data);
        return ResponseEntity.ok(userResponse);
    }
}