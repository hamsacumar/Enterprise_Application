using AdminService.Models;
using Microsoft.Extensions.Options;
using MongoDB.Driver;
using System.Security.Cryptography;
using System.Text;

namespace AdminService.Services
{
    public class WorkerService : IWorkerService
    {
        private readonly IMongoCollection<Worker> _workers;

        public WorkerService(IOptions<MongoDbSettings> settings)
        {
            var client = new MongoClient(settings.Value.ConnectionString);
            var database = client.GetDatabase(settings.Value.DatabaseName);
            _workers = database.GetCollection<Worker>("Workers");
        }

        public async Task<List<Worker>> GetAllAsync()
        {
            return await _workers.Find(_ => true).ToListAsync();
        }

        public async Task CreateAsync(Worker worker)
        {
            worker.PasswordHash = HashPassword(worker.PasswordHash);
            await _workers.InsertOneAsync(worker);
        }

        private string HashPassword(string password)
        {
            using var sha256 = SHA256.Create();
            var bytes = sha256.ComputeHash(Encoding.UTF8.GetBytes(password));
            return BitConverter.ToString(bytes).Replace("-", "").ToLower();
        }
    }
}
