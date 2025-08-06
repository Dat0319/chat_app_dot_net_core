using System;

// src/Core/ChatApp.Domain/Entities/User.cs
namespace ChatApp.Domain.Entities
{
    public class User
    {
        public Guid Id { get; set; }
        public string Username { get; private set; }
        public string Email { get; private set; }
        public string PasswordHash { get; private set; }
        public DateTime CreatedAt { get; private set; }
        public DateTime LastActive { get; set; }
        public bool IsOnline { get; set; }
        public virtual ICollection<ChatRoom> OwnedRooms { get; private set; } =
            new List<ChatRoom>();
        public virtual ICollection<ChatRoomMember> JoinedRooms { get; private set; } =
            new List<ChatRoomMember>();

        // For EF Core
        private User() { }

        public User(string username, string email, string passwordHash)
        {
            Id = Guid.NewGuid();
            Username = username;
            Email = email;
            PasswordHash = passwordHash;
            CreatedAt = DateTime.UtcNow;
            LastActive = DateTime.UtcNow;
            IsOnline = false;
        }

        public void UpdateUsername(string username)
        {
            Username = username;
        }
    }
}
