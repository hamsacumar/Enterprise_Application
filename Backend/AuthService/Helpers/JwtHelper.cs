using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using AuthService.Models;
using Microsoft.IdentityModel.Tokens;


namespace AuthService.Helpers
{
    public class JwtSettings
    {
        public string Secret { get; set; } = null!;
        public string Issuer { get; set; } = null!;
        public string Audience { get; set; } = null!;

        public int ExpiryMinutes { get; set; }

    }

    public class JwtHelper
    {
        private readonly JwtSettings _settings;
        public JwtHelper(JwtSettings settings) { _settings = settings; }

        public string GenerateToken(User user)
        {
            var claims = new[]
            {
            new Claim(JwtRegisteredClaimNames.Sub, user.Id ?? string.Empty),
            new Claim("username", user.Username),
            new Claim(ClaimTypes.Role, user.Role.ToString()),
            new Claim("firstName",user.FirstName),

        };

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_settings.Secret));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                issuer: _settings.Issuer,
                audience: _settings.Audience,
                claims: claims,
                expires: DateTime.UtcNow.AddMinutes(_settings.ExpiryMinutes),
                signingCredentials: creds
            );

            return new JwtSecurityTokenHandler().WriteToken(token);

        }
    }
}