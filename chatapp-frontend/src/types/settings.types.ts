// src/types/settings.types.ts
export interface SystemSettings {
  siteName: string;
  logoUrl: string;
  theme: "light" | "dark" | "system";
  language: string;
  dateFormat: string;
  timeFormat: string;
  defaultUserRole: string;
  userRegistrationEnabled: boolean;
  emailNotificationsEnabled: boolean;
  sessionTimeout: number; // in minutes
  maxFileUploadSize: number; // in MB
}
