// src/Infrastructure/ChatApp.Persistence/ApplicationDbContext.cs
using System.Reflection;
using ChatApp.Application.Common.Interfaces;
using ChatApp.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace ChatApp.Persistence
{
    public class ApplicationDbContext : DbContext, IApplicationDbContext
    {
        public DbSet<User> Users => Set<User>();
        public DbSet<ChatRoom> ChatRooms => Set<ChatRoom>();
        public DbSet<ChatRoomMember> ChatRoomMembers => Set<ChatRoomMember>();
        public DbSet<Message> Messages => Set<Message>();
        public DbSet<MessageRead> MessageReads => Set<MessageRead>();

        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options) { }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            builder.ApplyConfigurationsFromAssembly(Assembly.GetExecutingAssembly());

            // Configure composite primary keys
            builder.Entity<ChatRoomMember>().HasKey(m => new { m.UserId, m.ChatRoomId });

            builder.Entity<MessageRead>().HasKey(m => new { m.UserId, m.MessageId });

            // Configure indexes for high performance
            builder.Entity<User>().HasIndex(u => u.Username).IsUnique();

            builder.Entity<User>().HasIndex(u => u.Email).IsUnique();

            builder.Entity<User>().HasIndex(u => u.IsOnline);

            builder.Entity<ChatRoom>().HasIndex(r => r.OwnerId);

            builder.Entity<Message>().HasIndex(m => m.ChatRoomId);

            builder.Entity<Message>().HasIndex(m => m.SentAt);

            builder.Entity<Message>().HasIndex(m => new { m.ChatRoomId, m.SentAt });

            base.OnModelCreating(builder);
        }
    }
}
