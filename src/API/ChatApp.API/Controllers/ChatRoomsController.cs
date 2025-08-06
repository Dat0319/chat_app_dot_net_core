// src/API/ChatApp.API/Controllers/ChatRoomsController.cs
using ChatApp.Application.Common.Models;
using ChatApp.Application.Features.Messages.Queries.GetRecentMessages;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace ChatApp.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ChatRoomsController : ControllerBase
    {
        private readonly IMediator _mediator;

        public ChatRoomsController(IMediator mediator)
        {
            _mediator = mediator;
        }

        [HttpGet]
        public async Task<ActionResult<List<ChatRoomDto>>> GetAll()
        {
            // This would be a proper query in a real app
            // For now just return mock data
            return new List<ChatRoomDto>
            {
                new ChatRoomDto
                {
                    Id = Guid.NewGuid(),
                    Name = "General",
                    Description = "General chat room",
                    MemberCount = 125
                },
                new ChatRoomDto
                {
                    Id = Guid.NewGuid(),
                    Name = "Tech",
                    Description = "Tech discussions",
                    MemberCount = 85
                }
            };
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<ChatRoomDto>> Get(Guid id)
        {
            // This would be a proper query in a real app
            return new ChatRoomDto
            {
                Id = id,
                Name = $"Room-{id.ToString().Substring(0, 8)}",
                Description = "A chat room",
                MemberCount = 42
            };
        }

        [HttpGet("{id}/messages")]
        public async Task<ActionResult<PaginatedList<MessageDto>>> GetMessages(
            Guid id,
            [FromQuery] int pageNumber = 1,
            [FromQuery] int pageSize = 50
        )
        {
            return await _mediator.Send(
                new GetRecentMessagesQuery
                {
                    ChatRoomId = id,
                    PageNumber = pageNumber,
                    PageSize = pageSize
                }
            );
        }

        [HttpPost]
        public async Task<ActionResult<Guid>> Create(CreateChatRoomCommand command)
        {
            // This would be a proper command in a real app
            return Guid.NewGuid();
        }

        public class ChatRoomDto
        {
            public Guid Id { get; set; }
            public string Name { get; set; }
            public string Description { get; set; }
            public int MemberCount { get; set; }
        }

        public class CreateChatRoomCommand
        {
            public string Name { get; set; }
            public string Description { get; set; }
            public bool IsPrivate { get; set; }
            public Guid OwnerId { get; set; }
        }
    }
}
