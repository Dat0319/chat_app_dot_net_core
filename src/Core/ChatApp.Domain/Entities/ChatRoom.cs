// src/Core/ChatApp.Domain/Entities/ChatRoom.cs
namespace ChatApp.Domain.Entities
{
    public class ChatRoom
    {
        public Guid Id { get; set; }
        public string Name { get; private set; }
        public string Description { get; private set; }
        public bool IsPrivate { get; private set; }
        public DateTime CreatedAt { get; private set; }
        public Guid OwnerId { get; private set; }
        public virtual User Owner { get; private set; }
        public virtual ICollection<ChatRoomMember> Members { get; private set; } =
            new List<ChatRoomMember>();
        public virtual ICollection<Message> Messages { get; private set; } = new List<Message>();

        // For EF Core
        private ChatRoom() { }

        public ChatRoom(string name, string description, bool isPrivate, Guid ownerId)
        {
            Id = Guid.NewGuid();
            Name = name;
            Description = description;
            IsPrivate = isPrivate;
            CreatedAt = DateTime.UtcNow;
            OwnerId = ownerId;
        }

        public void UpdateDetails(string name, string description)
        {
            Name = name;
            Description = description;
        }

        public void SetPrivacy(bool isPrivate)
        {
            IsPrivate = isPrivate;
        }
    }
}
