// src/services/userService.ts
import { User, UserFormData } from "../types/user.types";
import api from "./api";
export const userService = {
  getUsers: async (
    page = 1,
    limit = 10,
    search = ""
  ): Promise<{ users: User[]; total: number }> => {
    const response = await api.get("/users", {
      params: { page, limit, search }
    });
    return response.data;
  },

  getUserById: async (id: string): Promise<User> => {
    const response = await api.get(`/users/${id}`);
    return response.data;
  },

  createUser: async (userData: UserFormData): Promise<User> => {
    const response = await api.post("/users", userData);
    return response.data;
  },

  updateUser: async (
    id: string,
    userData: Partial<UserFormData>
  ): Promise<User> => {
    const response = await api.put(`/users/${id}`, userData);
    return response.data;
  },

  deleteUser: async (id: string): Promise<void> => {
    await api.delete(`/users/${id}`);
  }
};
