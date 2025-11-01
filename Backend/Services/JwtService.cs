using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Backend.Models;

namespace Backend.Services;

public class JwtService
{
    private readonly IConfiguration _configuration;
    
    public JwtService(IConfiguration configuration)
    {
        _configuration = configuration;
    }

    public string GenerateToken(User user)
    {
        var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:Key"] ?? "YourSecretKeyHere123456789012345678901234567890"));
        var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

        var claims = new[]
        {
            new Claim("Id", user.Id),
            new Claim("Name", user.Name),
            new Claim("Email", user.Email),
            new Claim(ClaimTypes.Role, user.Role),
            new Claim("Role", user.Role)
        };

        var token = new JwtSecurityToken(
            issuer: _configuration["Jwt:Issuer"] ?? "AutoWashProBackend",
            audience: _configuration["Jwt:Audience"] ?? "AutoWashProFrontend",
            claims: claims,
            expires: DateTime.Now.AddHours(24),
            signingCredentials: credentials
        );

        return new JwtSecurityTokenHandler().WriteToken(token);
    }

    public UserInfo? DecodeToken(string token)
    {
        try
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.UTF8.GetBytes(_configuration["Jwt:Key"] ?? "YourSecretKeyHere123456789012345678901234567890");

            tokenHandler.ValidateToken(token, new TokenValidationParameters
            {
                ValidateIssuerSigningKey = true,
                IssuerSigningKey = new SymmetricSecurityKey(key),
                ValidateIssuer = true,
                ValidIssuer = _configuration["Jwt:Issuer"] ?? "AutoWashProBackend",
                ValidateAudience = true,
                ValidAudience = _configuration["Jwt:Audience"] ?? "AutoWashProFrontend",
                ClockSkew = TimeSpan.Zero
            }, out SecurityToken validatedToken);

            var jwtToken = (JwtSecurityToken)validatedToken;

            return new UserInfo
            {
                Id = jwtToken.Claims.First(x => x.Type == "Id").Value,
                Name = jwtToken.Claims.First(x => x.Type == "Name").Value,
                Email = jwtToken.Claims.First(x => x.Type == "Email").Value,
                Role = jwtToken.Claims.First(x => x.Type == "Role").Value
            };
        }
        catch
        {
            return null;
        }
    }
}

