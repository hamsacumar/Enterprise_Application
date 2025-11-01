using Backend.Models;
using Backend.Settings;
using Microsoft.Extensions.Options;
using MongoDB.Driver;

namespace Backend.Services
{
    public class ServiceService : IServiceService
    {
        private readonly IMongoCollection<ServiceItem> _collection;

        public ServiceService(IOptions<MongoDbSettings> settings, IMongoClient client)
        {
            var db = client.GetDatabase(settings.Value.DatabaseName);
            _collection = db.GetCollection<ServiceItem>("services");
        }

        public async Task<List<ServiceItem>> GetAllAsync() =>
            await _collection.Find(_ => true).SortByDescending(s => s.CreatedAt).ToListAsync();

        public async Task<ServiceItem?> GetByIdAsync(string id) =>
            await _collection.Find(s => s.Id == id).FirstOrDefaultAsync();

        public async Task CreateAsync(ServiceItem item) =>
            await _collection.InsertOneAsync(item);

        public async Task<bool> UpdateAsync(string id, ServiceItem item)
        {
            var result = await _collection.ReplaceOneAsync(s => s.Id == id, item);
            return result.IsAcknowledged && result.ModifiedCount > 0;
        }

        public async Task<bool> DeleteAsync(string id)
        {
            var result = await _collection.DeleteOneAsync(s => s.Id == id);
            return result.IsAcknowledged && result.DeletedCount > 0;
        }
    }
}
