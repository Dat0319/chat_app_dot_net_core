// src/services/roleService.ts
import { Permission, Role, RoleFormData } from "../types/role.types";
import api from "./api";

export const roleService = {
  getRoles: async (): Promise<Role[]> => {
    const response = await api.get("/roles");
    return response.data;
  },

  getRoleById: async (id: string): Promise<Role> => {
    const response = await api.get(`/roles/${id}`);
    return response.data;
  },

  createRole: async (roleData: RoleFormData): Promise<Role> => {
    const response = await api.post("/roles", roleData);
    return response.data;
  },

  updateRole: async (
    id: string,
    roleData: Partial<RoleFormData>
  ): Promise<Role> => {
    const response = await api.put(`/roles/${id}`, roleData);
    return response.data;
  },

  deleteRole: async (id: string): Promise<void> => {
    await api.delete(`/roles/${id}`);
  },

  getPermissions: async (): Promise<Permission[]> => {
    const response = await api.get("/permissions");
    return response.data;
  }
};
