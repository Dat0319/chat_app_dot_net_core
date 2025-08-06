// src/types/chat.types.ts
export interface Message {
  id: string;
  content: string;
  senderId: string;
  senderName: string;
  senderAvatar?: string;
  groupId: string;
  timestamp: string;
  attachments?: Attachment[];
  readBy: string[]; // User IDs
}

export interface Attachment {
  id: string;
  name: string;
  url: string;
  type: string;
  size: number;
}

export interface ChatGroup {
  id: string;
  name: string;
  description?: string;
  avatar?: string;
  members: string[]; // User IDs
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}
