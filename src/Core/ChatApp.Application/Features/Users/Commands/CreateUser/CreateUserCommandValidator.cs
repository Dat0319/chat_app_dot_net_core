// src/Core/ChatApp.Application/Features/Users/Commands/CreateUser/CreateUserCommandValidator.cs
using FluentValidation;

namespace ChatApp.Application.Features.Users.Commands.CreateUser
{
    public class CreateUserCommandValidator : AbstractValidator<CreateUserCommand>
    {
        public CreateUserCommandValidator()
        {
            RuleFor(v => v.Username)
                .NotEmpty()
                .WithMessage("Username is required.")
                .MinimumLength(3)
                .WithMessage("Username must be at least 3 characters.")
                .MaximumLength(30)
                .WithMessage("Username must not exceed 30 characters.");

            RuleFor(v => v.Email)
                .NotEmpty()
                .WithMessage("Email is required.")
                .EmailAddress()
                .WithMessage("Email is not valid.");

            RuleFor(v => v.Password)
                .NotEmpty()
                .WithMessage("Password is required.")
                .MinimumLength(6)
                .WithMessage("Password must be at least 6 characters.");
        }
    }
}
