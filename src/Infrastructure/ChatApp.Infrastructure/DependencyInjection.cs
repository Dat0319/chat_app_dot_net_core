// src/Infrastructure/ChatApp.Infrastructure/DependencyInjection.cs
using ChatApp.Application.Common.Interfaces;
using ChatApp.Infrastructure.Cache;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace ChatApp.Infrastructure
{
    public static class DependencyInjection
    {
        public static IServiceCollection AddInfrastructure(
            this IServiceCollection services,
            IConfiguration configuration
        )
        {
            services.AddStackExchangeRedisCache(options =>
            {
                options.Configuration = configuration.GetConnectionString("Redis");
                options.InstanceName = "ChatApp_";
            });

            services.AddScoped<ICacheService, RedisCacheService>();

            return services;
        }
    }
}
