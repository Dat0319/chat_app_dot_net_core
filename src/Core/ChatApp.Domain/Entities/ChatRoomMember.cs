// src/Core/ChatApp.Domain/Entities/ChatRoomMember.cs
namespace ChatApp.Domain.Entities
{
    public class ChatRoomMember
    {
        public Guid UserId { get; set; }
        public virtual User User { get; private set; }

        public Guid ChatRoomId { get; set; }
        public virtual ChatRoom ChatRoom { get; private set; }

        public bool IsAdmin { get; private set; }
        public DateTime JoinedAt { get; private set; }
        public DateTime? LastRead { get; set; }

        // For EF Core
        private ChatRoomMember() { }

        public ChatRoomMember(Guid userId, Guid chatRoomId, bool isAdmin = false)
        {
            UserId = userId;
            ChatRoomId = chatRoomId;
            IsAdmin = isAdmin;
            JoinedAt = DateTime.UtcNow;
            LastRead = DateTime.UtcNow;
        }

        public void MakeAdmin()
        {
            IsAdmin = true;
        }

        public void RemoveAdmin()
        {
            IsAdmin = false;
        }
    }
}
