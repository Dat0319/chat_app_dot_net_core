// src/Core/ChatApp.Application/Features/Messages/Queries/GetRecentMessages/GetRecentMessagesQuery.cs
using ChatApp.Application.Common.Models;
using MediatR;

namespace ChatApp.Application.Features.Messages.Queries.GetRecentMessages
{
    public class GetRecentMessagesQuery : IRequest<PaginatedList<MessageDto>>
    {
        public Guid ChatRoomId { get; set; }
        public int PageNumber { get; set; } = 1;
        public int PageSize { get; set; } = 50;
    }

    public class MessageDto
    {
        public Guid Id { get; set; }
        public string Content { get; set; }
        public DateTime SentAt { get; set; }
        public bool IsEdited { get; set; }
        public DateTime? EditedAt { get; set; }
        public Guid SenderId { get; set; }
        public string SenderUsername { get; set; }
    }
}
