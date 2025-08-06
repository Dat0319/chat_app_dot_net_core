// src/API/ChatApp.API/Controllers/UsersController.cs
using ChatApp.Application.Features.Users.Commands.CreateUser;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace ChatApp.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UsersController : ControllerBase
    {
        private readonly IMediator _mediator;

        public UsersController(IMediator mediator)
        {
            _mediator = mediator;
        }

        [HttpPost]
        public async Task<ActionResult<Guid>> Create(CreateUserCommand command)
        {
            return await _mediator.Send(command);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<UserDto>> Get(Guid id)
        {
            // This would be a proper query in a real app
            // For now just return a mock response
            return new UserDto
            {
                Id = id,
                Username = $"User-{id.ToString().Substring(0, 8)}",
                Email = $"user-{id.ToString().Substring(0, 8)}@example.com",
                IsOnline = true
            };
        }

        // For demo purposes
        public class UserDto
        {
            public Guid Id { get; set; }
            public string Username { get; set; }
            public string Email { get; set; }
            public bool IsOnline { get; set; }
        }
    }
}
