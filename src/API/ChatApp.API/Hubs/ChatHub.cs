// src/API/ChatApp.API/Hubs/ChatHub.cs
using ChatApp.Application.Features.Messages.Commands.SendMessage;
using ChatApp.Application.Features.Messages.Queries.GetRecentMessages;
using MediatR;
using Microsoft.AspNetCore.SignalR;

namespace ChatApp.API.Hubs
{
    public class ChatHub : Hub
    {
        private readonly IMediator _mediator;
        private static readonly ConnectionMapping<string> _connections =
            new ConnectionMapping<string>();

        public ChatHub(IMediator mediator)
        {
            _mediator = mediator;
        }

        public override async Task OnConnectedAsync()
        {
            var userId = Context.GetHttpContext().Request.Query["userId"].ToString();

            if (!string.IsNullOrEmpty(userId))
            {
                _connections.Add(userId, Context.ConnectionId);

                // Add user to groups (chatrooms) they belong to
                // This would be fetched from a service in a real app
                var userChatRooms = await GetUserChatRoomsAsync(userId);

                foreach (var roomId in userChatRooms)
                {
                    await Groups.AddToGroupAsync(Context.ConnectionId, roomId.ToString());
                }
            }

            await base.OnConnectedAsync();
        }

        public override async Task OnDisconnectedAsync(Exception exception)
        {
            var userId = Context.GetHttpContext().Request.Query["userId"].ToString();

            if (!string.IsNullOrEmpty(userId))
            {
                _connections.Remove(userId, Context.ConnectionId);
            }

            await base.OnDisconnectedAsync(exception);
        }

        public async Task SendMessage(Guid senderId, Guid chatRoomId, string message)
        {
            // Validate user is member of this chat room
            if (!await IsUserInChatRoomAsync(senderId, chatRoomId))
            {
                throw new HubException("You are not a member of this chat room.");
            }

            // Send message using MediatR
            var messageId = await _mediator.Send(
                new SendMessageCommand
                {
                    SenderId = senderId,
                    ChatRoomId = chatRoomId,
                    Content = message
                }
            );

            // Broadcast to all clients in the chatroom
            await Clients
                .Group(chatRoomId.ToString())
                .SendAsync(
                    "ReceiveMessage",
                    new
                    {
                        Id = messageId,
                        SenderId = senderId,
                        SenderUsername = await GetUsernameAsync(senderId),
                        ChatRoomId = chatRoomId,
                        Content = message,
                        SentAt = DateTime.UtcNow
                    }
                );
        }

        public async Task JoinChatRoom(Guid userId, Guid chatRoomId)
        {
            if (!await IsUserInChatRoomAsync(userId, chatRoomId))
            {
                throw new HubException("You are not a member of this chat room.");
            }

            // Add all active connections for this user to the group
            foreach (var connectionId in _connections.GetConnections(userId.ToString()))
            {
                await Groups.AddToGroupAsync(connectionId, chatRoomId.ToString());
            }

            // Notify other users in the room
            await Clients
                .Group(chatRoomId.ToString())
                .SendAsync("UserJoined", await GetUsernameAsync(userId));
        }

        public async Task LeaveChatRoom(Guid userId, Guid chatRoomId)
        {
            // Remove all active connections for this user from the group
            foreach (var connectionId in _connections.GetConnections(userId.ToString()))
            {
                await Groups.RemoveFromGroupAsync(connectionId, chatRoomId.ToString());
            }

            // Notify other users in the room
            await Clients
                .Group(chatRoomId.ToString())
                .SendAsync("UserLeft", await GetUsernameAsync(userId));
        }

        // Helper methods - in real app these would be proper services
        private Task<List<Guid>> GetUserChatRoomsAsync(string userId)
        {
            // This would query the database in a real app
            return Task.FromResult(new List<Guid>());
        }

        private Task<bool> IsUserInChatRoomAsync(Guid userId, Guid chatRoomId)
        {
            // This would check from database in a real app
            return Task.FromResult(true);
        }

        // src/API/ChatApp.API/Hubs/ChatHub.cs (completed)
        private Task<string> GetUsernameAsync(Guid userId)
        {
            // This would query the database or cache in a real app
            // For demo, return placeholder
            return Task.FromResult($"User-{userId.ToString().Substring(0, 8)}");
        }

        // Additional methods for a complete chat experience
        public async Task MarkAsRead(Guid userId, Guid messageId)
        {
            // Store in database that user has read this message
            // In a real app this would be a proper MediatR command

            // Notify sender that the message was read
            var message = await GetMessageAsync(messageId); // This would be a proper query

            if (message != null)
            {
                var senderConnections = _connections.GetConnections(message.SenderId.ToString());
                if (senderConnections.Any())
                {
                    await Clients
                        .Clients(senderConnections)
                        .SendAsync("MessageRead", messageId, userId);
                }
            }
        }

        public async Task UserIsTyping(Guid userId, Guid chatRoomId)
        {
            if (!await IsUserInChatRoomAsync(userId, chatRoomId))
            {
                return;
            }

            var username = await GetUsernameAsync(userId);

            // Notify others in the chatroom that user is typing
            await Clients
                .GroupExcept(chatRoomId.ToString(), Context.ConnectionId)
                .SendAsync("UserTyping", userId, username);
        }

        // Helper method stub
        private Task<dynamic> GetMessageAsync(Guid messageId)
        {
            // This would fetch the message from database in a real app
            return Task.FromResult<dynamic>(new { SenderId = Guid.NewGuid() });
        }
    }
}
