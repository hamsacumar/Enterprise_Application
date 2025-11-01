using AdminService.Models;

namespace AdminService.Services
{
    public interface IWorkerService
    {
        Task<List<Worker>> GetAllAsync();
        Task CreateAsync(Worker worker);
    }
}
