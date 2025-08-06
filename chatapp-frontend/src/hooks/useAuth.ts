// src/hooks/useAuth.ts
import { useCallback, useEffect, useState } from "react";
import api from "../services/api";
import { User } from "../types/user.types";

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

interface LoginCredentials {
  username: string;
  password: string;
}

interface RegisterData {
  username: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export const useAuth = () => {
  const [auth, setAuth] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
    error: null
  });

  const checkAuthStatus = useCallback(async () => {
    try {
      const token = localStorage.getItem("authToken");

      if (!token) {
        setAuth((prev) => ({ ...prev, isLoading: false }));
        return;
      }

      const response = await api.get("/auth/me");
      setAuth({
        user: response.data,
        isAuthenticated: true,
        isLoading: false,
        error: null
      });
    } catch (error) {
      localStorage.removeItem("authToken");
      setAuth({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: "Authentication failed"
      });
    }
  }, []);

  useEffect(() => {
    checkAuthStatus();
  }, [checkAuthStatus]);

  const login = async (credentials: LoginCredentials) => {
    try {
      setAuth((prev) => ({ ...prev, isLoading: true, error: null }));
      const response = await api.post("/auth/login", credentials);
      const { token, user } = response.data;

      localStorage.setItem("authToken", token);
      setAuth({
        user,
        isAuthenticated: true,
        isLoading: false,
        error: null
      });

      return true;
    } catch (error: any) {
      setAuth((prev) => ({
        ...prev,
        isLoading: false,
        error: error.response?.data?.message || "Login failed"
      }));
      return false;
    }
  };

  const register = async (data: RegisterData) => {
    try {
      setAuth((prev) => ({ ...prev, isLoading: true, error: null }));
      const response = await api.post("/auth/register", data);
      const { token, user } = response.data;

      localStorage.setItem("authToken", token);
      setAuth({
        user,
        isAuthenticated: true,
        isLoading: false,
        error: null
      });

      return true;
    } catch (error: any) {
      setAuth((prev) => ({
        ...prev,
        isLoading: false,
        error: error.response?.data?.message || "Registration failed"
      }));
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem("authToken");
    setAuth({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null
    });
  };

  return {
    user: auth.user,
    isAuthenticated: auth.isAuthenticated,
    isLoading: auth.isLoading,
    error: auth.error,
    login,
    register,
    logout,
    checkAuthStatus
  };
};
