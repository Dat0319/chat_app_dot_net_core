// src/Core/ChatApp.Application/Features/Messages/Commands/SendMessage/SendMessageCommandHandler.cs
using ChatApp.Application.Common.Interfaces;
using ChatApp.Domain.Entities;
using MediatR;

namespace ChatApp.Application.Features.Messages.Commands.SendMessage
{
    public class SendMessageCommandHandler : IRequestHandler<SendMessageCommand, Guid>
    {
        private readonly IApplicationDbContext _context;
        private readonly ICacheService _cacheService;

        public SendMessageCommandHandler(IApplicationDbContext context, ICacheService cacheService)
        {
            _context = context;
            _cacheService = cacheService;
        }

        public async Task<Guid> Handle(
            SendMessageCommand request,
            CancellationToken cancellationToken
        )
        {
            var message = new Message(request.Content, request.SenderId, request.ChatRoomId);

            _context.Messages.Add(message);
            await _context.SaveChangesAsync(cancellationToken);

            // Invalidate cache for this chatroom's recent messages
            await _cacheService.RemoveAsync($"recent-messages-{request.ChatRoomId}");

            return message.Id;
        }
    }
}
