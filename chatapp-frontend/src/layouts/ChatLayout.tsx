// // src/layouts/ChatLayout.tsx
// import { Link, Outlet, useParams } from "react-router-dom";

// interface ChatRoom {
//   id: string;
//   name: string;
//   description: string;
//   memberCount: number;
// }

// function ChatLayout() {
//   const { user, logout } = useAuth();
//   const [chatRooms, setChatRooms] = useState<ChatRoom[]>([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const { roomId } = useParams();

//   useEffect(() => {
//     // Fetch chat rooms from API
//     // For demo, we'll use mock data
//     const mockRooms = [
//       {
//         id: "1",
//         name: "General",
//         description: "General chat room",
//         memberCount: 125
//       },
//       {
//         id: "2",
//         name: "Tech",
//         description: "Tech discussions",
//         memberCount: 85
//       },
//       { id: "3", name: "Random", description: "Random topics", memberCount: 42 }
//     ];

//     setChatRooms(mockRooms);
//     setIsLoading(false);
//   }, []);

//   return (
//     <div className="flex h-screen">
//       {/* Sidebar */}
//       <div className="w-64 bg-gray-800 text-white flex flex-col">
//         <div className="p-4 border-b border-gray-700">
//           <h1 className="text-xl font-bold">Chat App</h1>
//         </div>

//         <div className="p-4 border-b border-gray-700">
//           <div className="text-sm text-gray-400">Logged in as</div>
//           <div className="font-semibold">{user?.username}</div>
//           <button
//             onClick={logout}
//             className="mt-2 text-xs text-gray-400 hover:text-white"
//           >
//             Logout
//           </button>
//         </div>

//         <div className="flex-1 overflow-y-auto">
//           <div className="p-4">
//             <h2 className="text-gray-400 text-xs uppercase tracking-wider mb-2">
//               Chat Rooms
//             </h2>
//             {isLoading ? (
//               <div className="text-gray-400">Loading...</div>
//             ) : (
//               <ul>
//                 {chatRooms.map((room) => (
//                   <li key={room.id} className="mb-1">
//                     <Link
//                       to={`/room/${room.id}`}
//                       className={`block px-2 py-1 rounded ${
//                         roomId === room.id ? "bg-blue-600" : "hover:bg-gray-700"
//                       }`}
//                     >
//                       {room.name}
//                     </Link>
//                   </li>
//                 ))}
//               </ul>
//             )}
//           </div>
//         </div>
//       </div>

//       {/* Main content */}
//       <div className="flex-1 flex flex-col">
//         <Outlet />
//       </div>
//     </div>
//   );
// }

// export default ChatLayout;

// src/components/chat/ChatLayout.tsx
import { useEffect, useState } from "react";
import GroupList from "../components/chat/GroupList";
import MessageInput from "../components/chat/MessageInput";
import MessageList from "../components/chat/MessageList";
import { chatService } from "../services/chatService";
import { ChatGroup, Message } from "../types/chat.types";

const ChatLayout: React.FC = () => {
  const [groups, setGroups] = useState<ChatGroup[]>([]);
  const [selectedGroup, setSelectedGroup] = useState<ChatGroup | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        setLoading(true);
        const groupsData = await chatService.getGroups();
        setGroups(groupsData);

        // Select first group by default if available
        if (groupsData.length > 0) {
          setSelectedGroup(groupsData[0]);
        }

        setError(null);
      } catch (err: any) {
        setError(err.message || "Failed to fetch chat groups");
      } finally {
        setLoading(false);
      }
    };

    fetchGroups();
  }, []);

  useEffect(() => {
    if (selectedGroup) {
      const fetchMessages = async () => {
        try {
          const result = await chatService.getMessages(selectedGroup.id);
          setMessages(result.messages);
        } catch (err: any) {
          console.error("Failed to fetch messages:", err);
        }
      };

      fetchMessages();
    }
  }, [selectedGroup]);

  const handleGroupSelect = (group: ChatGroup) => {
    setSelectedGroup(group);
  };

  const handleSendMessage = async (content: string, attachments?: File[]) => {
    if (!selectedGroup) return;

    try {
      const newMessage = await chatService.sendMessage(
        selectedGroup.id,
        content,
        attachments
      );
      setMessages((prev) => [...prev, newMessage]);
    } catch (err) {
      console.error("Failed to send message:", err);
    }
  };

  if (loading) {
    return <div className="flex justify-center py-6">Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500 text-center py-6">{error}</div>;
  }

  return (
    <div className="flex h-[calc(100vh-64px)]">
      <div className="w-64 border-r border-gray-200">
        <GroupList
          groups={groups}
          selectedGroup={selectedGroup}
          onSelectGroup={handleGroupSelect}
        />
      </div>
      <div className="flex-1 flex flex-col">
        {selectedGroup ? (
          <>
            <div className="p-4 border-b border-gray-200">
              <h2 className="font-medium text-lg">{selectedGroup.name}</h2>
              <p className="text-sm text-gray-500">
                {selectedGroup.description}
              </p>
            </div>
            <div className="flex-1 overflow-y-auto p-4">
              <MessageList messages={messages} />
            </div>
            <div className="border-t border-gray-200 p-4">
              <MessageInput onSendMessage={handleSendMessage} />
            </div>
          </>
        ) : (
          <div className="flex flex-1 items-center justify-center text-gray-500">
            Select a chat group to start messaging
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatLayout;
