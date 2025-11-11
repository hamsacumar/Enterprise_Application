namespace Backend.Models;

public class AuthVerifyResult
{
    public bool IsAuthenticated { get; private set; }
    public string? UserId { get; private set; }
    public string? Email { get; private set; }
    public string? Role { get; private set; }
    public string? Error { get; private set; }

    private AuthVerifyResult() { }

    public static AuthVerifyResult Success(string? userId, string? email, string? role) => new AuthVerifyResult
    {
        IsAuthenticated = true,
        UserId = userId,
        Email = email,
        Role = role
    };

    public static AuthVerifyResult Failed(string error) => new AuthVerifyResult
    {
        IsAuthenticated = false,
        Error = error
    };
}
