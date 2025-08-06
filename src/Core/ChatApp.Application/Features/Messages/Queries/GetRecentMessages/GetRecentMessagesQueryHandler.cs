// src/Core/ChatApp.Application/Features/Messages/Queries/GetRecentMessages/GetRecentMessagesQueryHandler.cs
using AutoMapper;
using ChatApp.Application.Common.Interfaces;
using ChatApp.Application.Common.Models;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace ChatApp.Application.Features.Messages.Queries.GetRecentMessages
{
    public class GetRecentMessagesQueryHandler
        : IRequestHandler<GetRecentMessagesQuery, PaginatedList<MessageDto>>
    {
        private readonly IApplicationDbContext _context;
        private readonly ICacheService _cacheService;
        private readonly IMapper _mapper;

        public GetRecentMessagesQueryHandler(
            IApplicationDbContext context,
            ICacheService cacheService,
            IMapper mapper
        )
        {
            _context = context;
            _cacheService = cacheService;
            _mapper = mapper;
        }

        public async Task<PaginatedList<MessageDto>> Handle(
            GetRecentMessagesQuery request,
            CancellationToken cancellationToken
        )
        {
            // Try to get from cache first
            var cacheKey =
                $"recent-messages-{request.ChatRoomId}-p{request.PageNumber}-s{request.PageSize}";

            return await _cacheService.GetOrCreateAsync(
                cacheKey,
                async () =>
                {
                    var query = _context
                        .Messages.Where(m => m.ChatRoomId == request.ChatRoomId)
                        .OrderByDescending(m => m.SentAt)
                        .Include(m => m.Sender)
                        .Select(m => new MessageDto
                        {
                            Id = m.Id,
                            Content = m.Content,
                            SentAt = m.SentAt,
                            IsEdited = m.IsEdited,
                            EditedAt = m.EditedAt,
                            SenderId = m.SenderId,
                            SenderUsername = m.Sender.Username
                        });

                    return await PaginatedList<MessageDto>.CreateAsync(
                        query,
                        request.PageNumber,
                        request.PageSize
                    );
                },
                TimeSpan.FromMinutes(5)
            ); // Cache for 5 minutes
        }
    }
}
