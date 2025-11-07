using System.Net;
using System.Net.Mail;

namespace AuthService.Services
{
    public class EmailService : IEmailService
    {
        private readonly IConfiguration _config;
        public EmailService(IConfiguration config)
        {
            _config = config;
        }

        public async Task SendOtpEmail(string toEmail, string otpCode)
        {
            var smtpHost = _config["Smtp:Host"];
            var smtpPort = int.Parse(_config["Smtp:Port"] ?? "587");
            var smtpUser = _config["Smtp:User"];
            var smtpPass = _config["Smtp:Pass"];

            using var client = new SmtpClient(smtpHost, smtpPort)
            {
                Credentials = new NetworkCredential(smtpUser, smtpPass),
                EnableSsl = true
            };

            if (string.IsNullOrEmpty(smtpUser))
            {
                throw new InvalidOperationException("SMTP user is not configured.");
            }

            var msg = new MailMessage(smtpUser, toEmail,
            "Your OTP Code", $"Your OTP code is: {otpCode}. It is valid for 5 minutes.");
            await client.SendMailAsync(msg);
        }
    }
}