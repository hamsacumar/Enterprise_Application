using Backend.Models;

namespace Backend.Services
{
    public interface IServiceService
    {
        Task<List<ServiceItem>> GetAllAsync();
        Task<ServiceItem?> GetByIdAsync(string id);
        Task CreateAsync(ServiceItem item);
        Task<bool> UpdateAsync(string id, ServiceItem item);
        Task<bool> DeleteAsync(string id);
    }
}
