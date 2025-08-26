namespace CrmPridnestrovye.Caching;

public interface ICacheService
{
    Task<T?> GetAsync<T>(string key);
    Task SetAsync<T>(string key, T value, int minutes = 10);
    Task RemoveAsync(string key);
}
