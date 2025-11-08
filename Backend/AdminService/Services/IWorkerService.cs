using Backend.Models;

namespace Backend.Services
{
    public interface IWorkerService
    {
        Task<List<Worker>> GetAllAsync();
        Task CreateAsync(Worker worker);

        // Add these
        Task UpdateAsync(string id, Worker worker);
        Task DeleteAsync(string id);
    }
}
