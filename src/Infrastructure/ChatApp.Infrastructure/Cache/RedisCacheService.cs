// src/Infrastructure/ChatApp.Infrastructure/Cache/RedisCacheService.cs
using System.Text.Json;
using ChatApp.Application.Common.Interfaces;
using Microsoft.Extensions.Caching.Distributed;

namespace ChatApp.Infrastructure.Cache
{
    public class RedisCacheService : ICacheService
    {
        private readonly IDistributedCache _distributedCache;

        public RedisCacheService(IDistributedCache distributedCache)
        {
            _distributedCache = distributedCache;
        }

        public async Task<T> GetAsync<T>(string key)
        {
            var cachedResponse = await _distributedCache.GetStringAsync(key);

            return cachedResponse == null ? default : JsonSerializer.Deserialize<T>(cachedResponse);
        }

        public async Task SetAsync<T>(string key, T value, TimeSpan? expiry = null)
        {
            var options = new DistributedCacheEntryOptions
            {
                AbsoluteExpirationRelativeToNow = expiry ?? TimeSpan.FromHours(1)
            };

            var serializedResponse = JsonSerializer.Serialize(value);

            await _distributedCache.SetStringAsync(key, serializedResponse, options);
        }

        public async Task RemoveAsync(string key)
        {
            await _distributedCache.RemoveAsync(key);
        }

        public async Task<bool> ExistsAsync(string key)
        {
            return await _distributedCache.GetStringAsync(key) != null;
        }

        public async Task<T> GetOrCreateAsync<T>(
            string key,
            Func<Task<T>> factory,
            TimeSpan? expiry = null
        )
        {
            var cachedValue = await GetAsync<T>(key);

            if (cachedValue != null)
            {
                return cachedValue;
            }

            var value = await factory();

            await SetAsync(key, value, expiry);

            return value;
        }
    }
}
