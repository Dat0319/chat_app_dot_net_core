// src/Core/ChatApp.Application/Features/Users/Commands/CreateUser/CreateUserCommand.cs
using MediatR;

namespace ChatApp.Application.Features.Users.Commands.CreateUser
{
    public class CreateUserCommand : IRequest<Guid>
    {
        public string Username { get; set; }
        public string Email { get; set; }
        public string Password { get; set; }
    }
}
