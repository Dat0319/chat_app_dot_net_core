// src/Core/ChatApp.Application/Common/Interfaces/IApplicationDbContext.cs
using ChatApp.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace ChatApp.Application.Common.Interfaces
{
    public interface IApplicationDbContext
    {
        DbSet<User> Users { get; }
        DbSet<ChatRoom> ChatRooms { get; }
        DbSet<ChatRoomMember> ChatRoomMembers { get; }
        DbSet<Message> Messages { get; }
        DbSet<MessageRead> MessageReads { get; }

        Task<int> SaveChangesAsync(CancellationToken cancellationToken);
    }
}
