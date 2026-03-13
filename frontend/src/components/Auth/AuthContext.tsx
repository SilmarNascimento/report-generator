import {
  AuthContextData,
  AuthenticationDto,
  UserResponseDto,
} from "@/interfaces/auth";
import { authService } from "@/service/authService";
import { decodeJwt, isTokenExpired } from "@/utils/jwt";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

const TOKEN_KEY = "@app:token";

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<UserResponseDto | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem(TOKEN_KEY);
    if (stored && !isTokenExpired(stored)) {
      setToken(stored);
      const payload = decodeJwt<{ sub: string }>(stored);
      if (payload) {
        setUser({
          id: 0,
          username: payload.sub,
          name: "",
          email: "",
          createdAt: "",
        });
      }
    } else {
      localStorage.removeItem(TOKEN_KEY);
    }
    setIsLoading(false);
  }, []);

  const login = useCallback(async (data: AuthenticationDto) => {
    const response = await authService.login(data);
    const { token: newToken } = response;

    localStorage.setItem(TOKEN_KEY, newToken);
    setToken(newToken);

    const payload = decodeJwt<{ sub: string }>(newToken);
    if (payload) {
      setUser({
        id: 0,
        username: payload.sub,
        name: "",
        email: "",
        createdAt: "",
      });
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    setToken(null);
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token,
        isLoading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextData {
  const context = useContext(AuthContext);
  if (!context.login)
    throw new Error("useAuth must be used within AuthProvider");
  return context;
}
