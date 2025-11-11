using AuthService.Models;
using Microsoft.Extensions.Options;
using Microsoft.VisualBasic;
using MongoDB.Driver;


namespace AuthService.Services
{
    public class MongoDbSettings
    {
        public string ConnectionString { get; set; } = null!;
        public string DatabaseName { get; set; } = null!;
        public string UsersCollectionName { get; set; } = null!;
    }

public class UserService : IUserService
    {
        private readonly IMongoCollection<User> _users;
        public UserService(IOptions<MongoDbSettings> settings)
        {
            var client = new MongoClient(settings.Value.ConnectionString);
            var db = client.GetDatabase(settings.Value.DatabaseName);
            _users = db.GetCollection<User>(settings.Value.UsersCollectionName);
        }
      public async Task<List<User>> GetAllClassifiedUsersAsync()
{
    // Only return users who are verified and have classified details (non-null fields)
    var filter = Builders<User>.Filter.And(
        Builders<User>.Filter.Eq(u => u.IsVerified, true),
        Builders<User>.Filter.Ne(u => u.Address, null),
        Builders<User>.Filter.Ne(u => u.CarModel, null),
        Builders<User>.Filter.Ne(u => u.CarLicensePlate, null),
        Builders<User>.Filter.Ne(u => u.PhoneNumber, null)
    );

    return await _users.Find(filter).ToListAsync();
}



        public async Task<User?> GetByUsernameAsync(string username) =>
            await _users.Find(u => u.Username.ToLower() == username.ToLower()).FirstOrDefaultAsync();

        public async Task<User?> GetByIdAsync(string id) =>
            await _users.Find(u => u.Id == id).FirstOrDefaultAsync();

        public async Task CreateAsync(User user) =>
            await _users.InsertOneAsync(user);

        public async Task<bool> AnyUserAsync() =>
            await (await _users.FindAsync(FilterDefinition<User>.Empty)).AnyAsync();


        public async Task UpdateAsync(string id, User updated) =>
            await _users.ReplaceOneAsync(u => u.Id == id, updated);

        public async Task<User?> GetByOtpAsync(string otpCode)
        {
            return await _users.Find(u => u.OtpCode == otpCode).FirstOrDefaultAsync();
        }

        public async Task<User?> GetByEmailAsync(string email) =>
        await _users.Find(u => u.Email.ToLower() == email.ToLower()).FirstOrDefaultAsync();


    }
}