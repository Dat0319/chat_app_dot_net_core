# Backend Dockerfile
# src/API/ChatApp.API/Dockerfile
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
WORKDIR /app
EXPOSE 80
EXPOSE 443

FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src
COPY ["src/API/ChatApp.API/ChatApp.API.csproj", "src/API/ChatApp.API/"]
COPY ["src/Core/ChatApp.Application/ChatApp.Application.csproj", "src/Core/ChatApp.Application/"]
COPY ["src/Core/ChatApp.Domain/ChatApp.Domain.csproj", "src/Core/ChatApp.Domain/"]
COPY ["src/Infrastructure/ChatApp.Infrastructure/ChatApp.Infrastructure.csproj", "src/Infrastructure/ChatApp.Infrastructure/"]
COPY ["src/Infrastructure/ChatApp.Persistence/ChatApp.Persistence.csproj", "src/Infrastructure/ChatApp.Persistence/"]
RUN dotnet restore "src/API/ChatApp.API/ChatApp.API.csproj"
COPY . .
WORKDIR "/src/src/API/ChatApp.API"
RUN dotnet build "ChatApp.API.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "ChatApp.API.csproj" -c Release -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "ChatApp.API.dll"]

# Frontend Dockerfile
# chatapp-frontend/Dockerfile
FROM node:18-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
