using System.Threading.Tasks;
using AuthService.Models;

namespace AuthService.Services
{
    public interface IUserService
    {
        Task<User?> GetByUsernameAsync(string username);
        Task<User?> GetByIdAsync(string id);
        Task CreateAsync(User user);
        Task<bool> AnyUserAsync();
        Task UpdateAsync(string id, User updated);
        Task<User?> GetByOtpAsync(string otpCode);
        Task<User?> GetByEmailAsync(string email);
    }
}
