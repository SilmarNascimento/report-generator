export interface AuthenticationDto {
  username: string;
  password: string;
}

export interface LoginResponseDto {
  token: string;
}

export interface UserCreateDto {
  username: string;
  name: string;
  email: string;
  password: string;
}

export interface UserResponseDto {
  id: number;
  username: string;
  name: string;
  email: string;
  createdAt: string;
}

export interface AuthContextData {
  user: UserResponseDto | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (data: AuthenticationDto) => Promise<void>;
  logout: () => void;
}
