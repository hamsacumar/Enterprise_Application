namespace Backend.Models;

public class User
{
    public string Id { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
    public string Role { get; set; } = string.Empty; // "Admin", "Worker", "User"
}

public class LoginRequest
{
    public string Email { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
}

public class LoginResponse
{
    public bool Success { get; set; }
    public string Message { get; set; } = string.Empty;
    public string Token { get; set; } = string.Empty;
    public UserInfo? User { get; set; }
}

public class UserInfo
{
    public string Id { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Role { get; set; } = string.Empty;
}

public class DecodeTokenRequest
{
    public string Token { get; set; } = string.Empty;
}

public class DecodeTokenResponse
{
    public bool Success { get; set; }
    public string Message { get; set; } = string.Empty;
    public UserInfo? User { get; set; }
}

public class UsersListResponse
{
    public List<UserInfo> Admins { get; set; } = new();
    public List<UserInfo> Workers { get; set; } = new();
    public List<UserInfo> Users { get; set; } = new();
}

