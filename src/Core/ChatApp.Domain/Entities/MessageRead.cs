// src/Core/ChatApp.Domain/Entities/MessageRead.cs
namespace ChatApp.Domain.Entities
{
    public class MessageRead
    {
        public Guid UserId { get; set; }
        public virtual User User { get; private set; }

        public Guid MessageId { get; set; }
        public virtual Message Message { get; private set; }

        public DateTime ReadAt { get; private set; }

        // For EF Core
        private MessageRead() { }

        public MessageRead(Guid userId, Guid messageId)
        {
            UserId = userId;
            MessageId = messageId;
            ReadAt = DateTime.UtcNow;
        }
    }
}
