// src/API/ChatApp.API/Program.cs
using System.Reflection;
using ChatApp.API.Hubs;
using ChatApp.Application.Common.Interfaces;
using ChatApp.Infrastructure;
using ChatApp.Persistence;
using FluentValidation;
using MediatR;

using global System;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Add application layer
builder.Services.AddMediatR(cfg =>
    cfg.RegisterServicesFromAssembly(Assembly.GetAssembly(typeof(IApplicationDbContext)))
);
builder.Services.AddValidatorsFromAssembly(Assembly.GetAssembly(typeof(IApplicationDbContext)));
builder.Services.AddAutoMapper(Assembly.GetAssembly(typeof(IApplicationDbContext)));

// Add persistence and infrastructure layers
builder.Services.AddPersistence(builder.Configuration);
builder.Services.AddInfrastructure(builder.Configuration);

// Add SignalR
builder
    .Services.AddSignalR(options =>
    {
        options.EnableDetailedErrors = true;
        options.MaximumReceiveMessageSize = 102400; // 100 KB
        options.StreamBufferCapacity = 10;
        options.MaximumParallelInvocationsPerClient = 5;
    })
    .AddStackExchangeRedis(
        builder.Configuration.GetConnectionString("Redis"),
        options =>
        {
            options.Configuration.ChannelPrefix = "ChatApp";
        }
    );

// Add CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy(
        "CorsPolicy",
        builder =>
            builder
                .WithOrigins("http://localhost:5173") // Frontend URL
                .AllowAnyMethod()
                .AllowAnyHeader()
                .AllowCredentials()
    );
});

// Configure health checks
builder
    .Services.AddHealthChecks()
    .AddMySql(builder.Configuration.GetConnectionString("DefaultConnection"))
    .AddRedis(builder.Configuration.GetConnectionString("Redis"));

var app = builder.Build();

// Configure middleware pipeline
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseCors("CorsPolicy");
app.UseAuthorization();
app.MapControllers();
app.MapHealthChecks("/health");

// Map SignalR hub
app.MapHub<ChatHub>("/chatHub");

app.Run();
