// src/pages/ChatRoom.tsx
import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import signalRService from "../services/signalRService";

interface Message {
  id: string;
  senderId: string;
  senderUsername: string;
  content: string;
  sentAt: Date;
}

interface UserTyping {
  userId: string;
  username: string;
  lastTyped: Date;
}

function ChatRoom() {
  const { roomId } = useParams<{ roomId: string }>();
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [roomName, setRoomName] = useState("Loading...");
  const [usersTyping, setUsersTyping] = useState<UserTyping[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Fetch chat room details and messages
  useEffect(() => {
    const fetchRoomData = async () => {
      try {
        // In a real app, these would be API calls
        // For demo, we'll use mock data

        // Mock room details
        setRoomName(`Chat Room ${roomId}`);

        // Mock messages
        const mockMessages: Message[] = [
          {
            id: "1",
            senderId: "123",
            senderUsername: "Alice",
            content: "Hello everyone!",
            sentAt: new Date(Date.now() - 1000 * 60 * 5) // 5 minutes ago
          },
          {
            id: "2",
            senderId: "456",
            senderUsername: "Bob",
            content: "Hey Alice, how are you?",
            sentAt: new Date(Date.now() - 1000 * 60 * 3) // 3 minutes ago
          }
        ];

        setMessages(mockMessages);
        setIsLoading(false);
      } catch (err) {
        console.error("Error fetching chat room data:", err);
        setError("Failed to load chat room data");
        setIsLoading(false);
      }
    };

    if (roomId) {
      fetchRoomData();
    }
  }, [roomId]);

  // Set up SignalR connection
  useEffect(() => {
    if (!user || !roomId) return;

    const setupSignalR = async () => {
      try {
        // Start connection
        await signalRService.startConnection(user.id);

        // Join the chat room
        await signalRService.joinChatRoom(user.id, roomId);

        // Set up event handlers
        signalRService.on("ReceiveMessage", (message: Message) => {
          setMessages((prev) => [
            ...prev,
            {
              ...message,
              sentAt: new Date(message.sentAt)
            }
          ]);
        });

        signalRService.on("UserTyping", (userId: string, username: string) => {
          if (userId === user.id) return; // Ignore our own typing

          setUsersTyping((prev) => {
            // Check if user is already in typing list
            const existingIndex = prev.findIndex((u) => u.userId === userId);

            if (existingIndex >= 0) {
              // Update the existing entry
              const updated = [...prev];
              updated[existingIndex] = {
                ...prev[existingIndex],
                lastTyped: new Date()
              };
              return updated;
            } else {
              // Add new entry
              return [
                ...prev,
                {
                  userId,
                  username,
                  lastTyped: new Date()
                }
              ];
            }
          });
        });

        signalRService.on("UserJoined", (username: string) => {
          // Could add system message or notification
          console.log(`${username} joined the chat`);
        });

        signalRService.on("UserLeft", (username: string) => {
          // Could add system message or notification
          console.log(`${username} left the chat`);
        });
      } catch (err) {
        console.error("Error setting up SignalR:", err);
        setError("Failed to connect to chat. Please refresh the page.");
      }
    };

    setupSignalR();

    // Cleanup function
    return () => {
      const cleanupSignalR = async () => {
        if (user && roomId) {
          try {
            await signalRService.leaveChatRoom(user.id, roomId);
            await signalRService.stopConnection();
            signalRService.off("ReceiveMessage");
            signalRService.off("UserTyping");
            signalRService.off("UserJoined");
            signalRService.off("UserLeft");
          } catch (err) {
            console.error("Error cleaning up SignalR:", err);
          }
        }
      };

      cleanupSignalR();
    };
  }, [user, roomId]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Remove users from typing list after 3 seconds of inactivity
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      setUsersTyping((prev) =>
        prev.filter((user) => now.getTime() - user.lastTyped.getTime() < 3000)
      );
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newMessage.trim() || !user || !roomId) return;

    try {
      await signalRService.sendMessage(user.id, roomId, newMessage);
      setNewMessage("");

      // Clear typing timeout
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
        typingTimeoutRef.current = null;
      }
    } catch (err) {
      console.error("Error sending message:", err);
      setError("Failed to send message. Please try again.");
    }
  };

  const handleMessageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewMessage(e.target.value);

    // Notify others that user is typing
    if (!user || !roomId) return;

    // Throttle typing notifications
    if (!typingTimeoutRef.current) {
      signalRService.userIsTyping(user.id, roomId).catch(console.error);

      typingTimeoutRef.current = setTimeout(() => {
        typingTimeoutRef.current = null;
      }, 2000);
    }
  };

  if (error) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-red-600">
          <p>{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col">
      {/* Header */}
      <div className="bg-white border-b p-4">
        <h2 className="text-xl font-semibold">{roomName}</h2>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4">
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-gray-500">Loading messages...</div>
          </div>
        ) : messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-gray-500">
              No messages yet. Start the conversation!
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.senderId === user?.id
                    ? "justify-end"
                    : "justify-start"
                }`}
              >
                <div
                  className={`max-w-xs md:max-w-md rounded-lg px-4 py-2 ${
                    message.senderId === user?.id
                      ? "bg-blue-600 text-white"
                      : "bg-gray-200 text-gray-900"
                  }`}
                >
                  {message.senderId !== user?.id && (
                    <div className="font-semibold text-sm">
                      {message.senderUsername}
                    </div>
                  )}
                  <div>{message.content}</div>
                  <div className="text-xs opacity-75 text-right">
                    {formatDistanceToNow(new Date(message.sentAt), {
                      addSuffix: true
                    })}
                  </div>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Typing indicators */}
      {usersTyping.length > 0 && (
        <div className="px-4 h-6 text-sm text-gray-500">
          {usersTyping.length === 1
            ? `${usersTyping[0].username} is typing...`
            : `${usersTyping.length} people are typing...`}
        </div>
      )}

      {/* Input */}
      <div className="bg-white border-t p-4">
        <form onSubmit={handleSendMessage} className="flex">
          <input
            type="text"
            value={newMessage}
            onChange={handleMessageChange}
            placeholder="Type a message..."
            className="flex-1 border border-gray-300 rounded-l-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            disabled={!newMessage.trim()}
            className="bg-blue-600 text-white px-4 py-2 rounded-r-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
}

export default ChatRoom;
