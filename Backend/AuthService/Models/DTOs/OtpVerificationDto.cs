namespace AuthService.Models.DTOs
{
    public class OtpVerificationDto
    {
        public string Username { get; set; } = null!;
        public string OtpCode { get; set; } = null!;
    }
}