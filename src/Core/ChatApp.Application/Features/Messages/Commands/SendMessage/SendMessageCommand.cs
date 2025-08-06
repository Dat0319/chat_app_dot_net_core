// src/Core/ChatApp.Application/Features/Messages/Commands/SendMessage/SendMessageCommand.cs
using MediatR;

namespace ChatApp.Application.Features.Messages.Commands.SendMessage
{
    public class SendMessageCommand : IRequest<Guid>
    {
        public Guid SenderId { get; set; }
        public Guid ChatRoomId { get; set; }
        public string Content { get; set; }
    }
}
