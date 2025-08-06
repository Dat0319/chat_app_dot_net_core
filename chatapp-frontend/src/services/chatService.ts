// src/services/chatService.ts
import { ChatGroup, Message } from "../types/chat.types";
import api from "./api";

export const chatService = {
  getGroups: async (): Promise<ChatGroup[]> => {
    const response = await api.get("/chat/groups");
    return response.data;
  },

  getGroupById: async (id: string): Promise<ChatGroup> => {
    const response = await api.get(`/chat/groups/${id}`);
    return response.data;
  },

  createGroup: async (
    groupData: Omit<ChatGroup, "id" | "createdAt" | "updatedAt">
  ): Promise<ChatGroup> => {
    const response = await api.post("/chat/groups", groupData);
    return response.data;
  },

  updateGroup: async (
    id: string,
    groupData: Partial<ChatGroup>
  ): Promise<ChatGroup> => {
    const response = await api.put(`/chat/groups/${id}`, groupData);
    return response.data;
  },

  deleteGroup: async (id: string): Promise<void> => {
    await api.delete(`/chat/groups/${id}`);
  },

  getMessages: async (
    groupId: string,
    page = 1,
    limit = 50
  ): Promise<{ messages: Message[]; total: number }> => {
    const response = await api.get(`/chat/groups/${groupId}/messages`, {
      params: { page, limit }
    });
    return response.data;
  },

  sendMessage: async (
    groupId: string,
    content: string,
    attachments?: File[]
  ): Promise<Message> => {
    const formData = new FormData();
    formData.append("content", content);
    formData.append("groupId", groupId);

    if (attachments && attachments.length > 0) {
      attachments.forEach((file) => {
        formData.append("attachments", file);
      });
    }

    const response = await api.post("/chat/messages", formData, {
      headers: {
        "Content-Type": "multipart/form-data"
      }
    });

    return response.data;
  }
};
