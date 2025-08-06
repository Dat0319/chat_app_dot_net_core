// src/components/chat/MessageList.tsx
import { dateUtils } from "../../helper/common";
import { useAuth } from "../../hooks/useAuth";
import { Message } from "../../types/chat.types";

interface MessageListProps {
  messages: Message[];
}

const MessageList: React.FC<MessageListProps> = ({ messages }) => {
  const { user } = useAuth();

  if (messages.length === 0) {
    return (
      <div className="text-center text-gray-500 py-6">
        No messages yet. Start the conversation!
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {messages.map((message) => {
        const isCurrentUser = user?.id === message.senderId;

        return (
          <div
            key={message.id}
            className={`flex ${
              isCurrentUser ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-[70%] ${
                isCurrentUser
                  ? "bg-blue-600 text-white rounded-tl-xl rounded-tr-none"
                  : "bg-gray-100 text-gray-800 rounded-tr-xl rounded-tl-none"
              } rounded-bl-xl rounded-br-xl p-3`}
            >
              {!isCurrentUser && (
                <div className="flex items-center mb-1">
                  <div className="w-6 h-6 rounded-full bg-gray-300 flex items-center justify-center mr-2">
                    {message.senderAvatar ? (
                      <img
                        src={message.senderAvatar}
                        alt={message.senderName}
                        className="w-full h-full rounded-full"
                      />
                    ) : (
                      <span className="text-xs">
                        {message.senderName.charAt(0)}
                      </span>
                    )}
                  </div>
                  <span className="text-xs font-medium">
                    {message.senderName}
                  </span>
                </div>
              )}
              <p className="break-words">{message.content}</p>
              <div
                className={`text-xs mt-1 text-right ${
                  isCurrentUser ? "text-blue-200" : "text-gray-500"
                }`}
              >
                {dateUtils.formatDate(message.timestamp, "HH:mm")}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default MessageList;
