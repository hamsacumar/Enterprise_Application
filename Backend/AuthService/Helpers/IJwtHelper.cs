using System.Security.Claims;
using AuthService.Models;

namespace AuthService.Helpers
{
    public interface IJwtHelper
    {
        string GenerateToken(User user);
    }
}
