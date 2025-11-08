using System.Threading.Tasks;

namespace AuthService.Services
{
    public interface IEmailService
    {
        Task SendOtpEmail(string toEmail, string otpCode);
    }
}
