// src/services/settingsService.ts
import { SystemSettings } from "../types/settings.types";
import api from "./api";

export const settingsService = {
  getSettings: async (): Promise<SystemSettings> => {
    const response = await api.get("/settings");
    return response.data;
  },

  updateSettings: async (
    settings: Partial<SystemSettings>
  ): Promise<SystemSettings> => {
    const response = await api.put("/settings", settings);
    return response.data;
  }
};
