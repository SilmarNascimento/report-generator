import {
  AuthenticationDto,
  LoginResponseDto,
  UserCreateDto,
  UserResponseDto,
} from "@/interfaces/auth";
import apiService from "./ApiService";

export const authService = {
  login: (data: AuthenticationDto): Promise<LoginResponseDto> =>
    apiService.post<LoginResponseDto>("/auth/login", data),

  register: (data: UserCreateDto): Promise<UserResponseDto> =>
    apiService.post<UserResponseDto>("/auth/register", data),
};
