using Backend.Models;
using Backend.Settings;
using Microsoft.Extensions.Options;
using MongoDB.Driver;
using System.Security.Cryptography;
using System.Text;

namespace Backend.Services
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

        public async Task UpdateAsync(string id, Worker worker)
{
    var update = Builders<Worker>.Update
        .Set(w => w.Name, worker.Name)
        .Set(w => w.Email, worker.Email)
        .Set(w => w.Contact, worker.Contact)
        .Set(w => w.Role, worker.Role)
        .Set(w => w.Specialization, worker.Specialization);

    if (!string.IsNullOrEmpty(worker.PasswordHash))
    {
        update = update.Set(w => w.PasswordHash, HashPassword(worker.PasswordHash));
    }

    await _workers.UpdateOneAsync(w => w.Id == id, update);
}

public async Task DeleteAsync(string id)
{
    await _workers.DeleteOneAsync(w => w.Id == id);
}

    }
}
