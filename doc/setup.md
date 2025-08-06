# Create solution and projects
dotnet new sln -n ChatApp
mkdir -p src/Core/ChatApp.Domain
mkdir -p src/Core/ChatApp.Application
mkdir -p src/Infrastructure/ChatApp.Infrastructure
mkdir -p src/Infrastructure/ChatApp.Persistence
mkdir -p src/API/ChatApp.API
mkdir -p tests/ChatApp.UnitTests
mkdir -p tests/ChatApp.IntegrationTests

# Create Domain project
cd src/Core/ChatApp.Domain
dotnet new classlib
cd ../../..

# Create Application project
cd src/Core/ChatApp.Application
dotnet new classlib
cd ../../..

# Create Infrastructure project
cd src/Infrastructure/ChatApp.Infrastructure
dotnet new classlib
cd ../../..

# Create Persistence project
cd src/Infrastructure/ChatApp.Persistence
dotnet new classlib
cd ../../..

# Create API project
cd src/API/ChatApp.API
dotnet new webapi
cd ../../..

# Create test projects
cd tests/ChatApp.UnitTests
dotnet new xunit
cd ../..
cd tests/ChatApp.IntegrationTests
dotnet new xunit
cd ../..

# Add projects to solution
dotnet sln ChatApp.sln add src/Core/ChatApp.Domain/ChatApp.Domain.csproj
dotnet sln ChatApp.sln add src/Core/ChatApp.Application/ChatApp.Application.csproj
dotnet sln ChatApp.sln add src/Infrastructure/ChatApp.Infrastructure/ChatApp.Infrastructure.csproj
dotnet sln ChatApp.sln add src/Infrastructure/ChatApp.Persistence/ChatApp.Persistence.csproj
dotnet sln ChatApp.sln add src/API/ChatApp.API/ChatApp.API.csproj
dotnet sln ChatApp.sln add tests/ChatApp.UnitTests/ChatApp.UnitTests.csproj
dotnet sln ChatApp.sln add tests/ChatApp.IntegrationTests/ChatApp.IntegrationTests.csproj

# Add project references
dotnet add src/Core/ChatApp.Application/ChatApp.Application.csproj reference src/Core/ChatApp.Domain/ChatApp.Domain.csproj
dotnet add src/Infrastructure/ChatApp.Infrastructure/ChatApp.Infrastructure.csproj reference src/Core/ChatApp.Application/ChatApp.Application.csproj
dotnet add src/Infrastructure/ChatApp.Persistence/ChatApp.Persistence.csproj reference src/Core/ChatApp.Application/ChatApp.Application.csproj
dotnet add src/API/ChatApp.API/ChatApp.API.csproj reference src/Core/ChatApp.Application/ChatApp.Application.csproj
dotnet add src/API/ChatApp.API/ChatApp.API.csproj reference src/Infrastructure/ChatApp.Infrastructure/ChatApp.Infrastructure.csproj
dotnet add src/API/ChatApp.API/ChatApp.API.csproj reference src/Infrastructure/ChatApp.Persistence/ChatApp.Persistence.csproj

# Install necessary packages to API project
cd src/API/ChatApp.API
dotnet add package Microsoft.EntityFrameworkCore.Design
dotnet add package Microsoft.AspNetCore.SignalR
dotnet add package Microsoft.Extensions.Caching.StackExchangeRedis
cd ../../..

# Install necessary packages to Persistence project
cd src/Infrastructure/ChatApp.Persistence
dotnet add package Microsoft.EntityFrameworkCore
dotnet add package Microsoft.EntityFrameworkCore.Tools
dotnet add package Pomelo.EntityFrameworkCore.MySql
cd ../../..

# Install necessary packages to Infrastructure project
cd src/Infrastructure/ChatApp.Infrastructure
dotnet add package StackExchange.Redis
cd ../../..

# Install necessary packages to Application project
cd src/Core/ChatApp.Application
dotnet add package MediatR
dotnet add package FluentValidation
dotnet add package AutoMapper
cd ../../..