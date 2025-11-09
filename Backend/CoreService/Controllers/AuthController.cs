using Backend.Models;
using Backend.Services;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers;

[ApiController]
[Route("api/auth")]
public class AuthController : ControllerBase
{
    private readonly JwtService _jwtService;
    
    // Mock database - In production, use real database
    private static readonly List<User> _users = new()
    {
        new User { Id = "1", Name = "Admin User", Email = "admin@autowash.com", Password = "admin123", Role = "Admin" },
        new User { Id = "2", Name = "John Worker", Email = "worker@autowash.com", Password = "worker123", Role = "Worker" },
        new User { Id = "3", Name = "Jane Customer", Email = "user@autowash.com", Password = "user123", Role = "User" },
        new User { Id = "4", Name = "Sarah Admin", Email = "sarah@autowash.com", Password = "admin123", Role = "Admin" },
        new User { Id = "5", Name = "Mike Worker", Email = "mike@autowash.com", Password = "worker123", Role = "Worker" }
    };

    public AuthController(JwtService jwtService)
    {
        _jwtService = jwtService;
    }

    [HttpPost("login")]
    public IActionResult Login([FromBody] LoginRequest request)
    {
        var user = _users.FirstOrDefault(u => 
            u.Email.Equals(request.Email, StringComparison.OrdinalIgnoreCase) && 
            u.Password == request.Password);

        if (user == null)
        {
            return Unauthorized(new LoginResponse 
            { 
                Success = false, 
                Message = "Invalid email or password" 
            });
        }

        var token = _jwtService.GenerateToken(user);

        return Ok(new LoginResponse
        {
            Success = true,
            Message = "Login successful",
            Token = token,
            User = new UserInfo
            {
                Id = user.Id,
                Name = user.Name,
                Email = user.Email,
                Role = user.Role
            }
        });
    }

    [HttpPost("decode")]
    public IActionResult DecodeToken([FromBody] DecodeTokenRequest request)
    {
        var userInfo = _jwtService.DecodeToken(request.Token);

        if (userInfo == null)
        {
            return Unauthorized(new DecodeTokenResponse
            {
                Success = false,
                Message = "Invalid or expired token"
            });
        }

        return Ok(new DecodeTokenResponse
        {
            Success = true,
            Message = "Token decoded successfully",
            User = userInfo
        });
    }

    [HttpGet("users")]
    public IActionResult GetAllUsers()
    {
        var response = new UsersListResponse
        {
            Admins = _users.Where(u => u.Role == "Admin")
                          .Select(u => new UserInfo { Id = u.Id, Name = u.Name, Email = u.Email, Role = u.Role })
                          .ToList(),
            Workers = _users.Where(u => u.Role == "Worker")
                           .Select(u => new UserInfo { Id = u.Id, Name = u.Name, Email = u.Email, Role = u.Role })
                           .ToList(),
            Users = _users.Where(u => u.Role == "User")
                         .Select(u => new UserInfo { Id = u.Id, Name = u.Name, Email = u.Email, Role = u.Role })
                         .ToList()
        };

        return Ok(response);
    }

    [HttpGet("profile")]
    public IActionResult GetProfile()
    {
        var token = Request.Headers["Authorization"].ToString().Replace("Bearer ", "");
        
        if (string.IsNullOrEmpty(token))
        {
            return Unauthorized(new { success = false, message = "No token provided" });
        }

        var userInfo = _jwtService.DecodeToken(token);

        if (userInfo == null)
        {
            return Unauthorized(new { success = false, message = "Invalid token" });
        }

        return Ok(new { success = true, user = userInfo });
    }

    [HttpGet("health")]
    public IActionResult Health()
    {
        return Ok(new { status = "healthy", timestamp = DateTime.UtcNow });
    }
}

