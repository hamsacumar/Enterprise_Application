namespace AuthService.Models.DTOs
{
    public class RegisterDto
    {
        public string Username { get; set; } = null!;
        public string FirstName { get; set; } = null!;
        public string LastName { get; set; } = null!;
        public string Email { get; set; } = null!;
        public string Password { get; set; } = null!;
        public string Role { get; set; } = "Customer"; // Default role is Customer



    }

    public class LoginDto
    {
        public string Username { get; set; } = null!;
        public string Password { get; set; } = null!;
    }

    public class LoginResultDto
    {
        public string UserId { get; set; } = null!;
        public string Token { get; set; } = null!;
        public string Role { get; set; } = null!;

    }

    public class OtpVerifyDto
{
    public string Username { get; set; } = null!;
    public string OtpCode { get; set; } = null!;
}

public class ClassifyDto
{
    public string Username { get; set; } = null!;
    public string? Address { get; set; }
    public string? CarModel { get; set; }
    public string? CarLicensePlate { get; set; }
    public string? PhoneNumber { get; set; }
}
}