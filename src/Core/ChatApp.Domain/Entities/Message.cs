// src/Core/ChatApp.Domain/Entities/Message.cs
namespace ChatApp.Domain.Entities
{
    public class Message
    {
        public Guid Id { get; set; }
        public string Content { get; private set; }
        public DateTime SentAt { get; private set; }
        public bool IsEdited { get; private set; }
        public DateTime? EditedAt { get; private set; }

        public Guid SenderId { get; private set; }
        public virtual User Sender { get; private set; }

        public Guid ChatRoomId { get; private set; }
        public virtual ChatRoom ChatRoom { get; private set; }

        public virtual ICollection<MessageRead> ReadBy { get; private set; } =
            new List<MessageRead>();

        // For EF Core
        private Message() { }

        public Message(string content, Guid senderId, Guid chatRoomId)
        {
            Id = Guid.NewGuid();
            Content = content;
            SentAt = DateTime.UtcNow;
            IsEdited = false;
            SenderId = senderId;
            ChatRoomId = chatRoomId;
        }

        public void Edit(string newContent)
        {
            Content = newContent;
            IsEdited = true;
            EditedAt = DateTime.UtcNow;
        }
    }
}
