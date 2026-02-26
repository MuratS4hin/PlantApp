using System.Net;
using System.Net.Mail;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;

namespace PlantAppBE.Services
{
    public class EmailService : IEmailService
    {
        private readonly EmailSettings _settings;
        private readonly ILogger<EmailService> _logger;

        public EmailService(IOptions<EmailSettings> options, ILogger<EmailService> logger)
        {
            _settings = options.Value;
            _logger = logger;
        }

        public async Task SendPasswordResetCodeAsync(string toEmail, string code)
        {
            if (string.IsNullOrWhiteSpace(_settings.AuthEmail) ||
                string.IsNullOrWhiteSpace(_settings.Password) ||
                string.IsNullOrWhiteSpace(_settings.FromAddress))
            {
                _logger.LogError("Email credentials are not configured.");
                return;
            }

            try
            {
                var body = $"""
                    Hello,

                    You have requested to reset your password for your PlantApp account.
                    If you did not make this request, please ignore this email.

                    Your password reset code is:
                    {code}

                    Enter this code in the PlantApp to proceed with resetting your password.
                    This code will expire in 15 minutes.

                    Best regards,
                    PlantApp Team
                    """;

                var message = new MailMessage
                {
                    // Forwarding: display the alias address, not the auth account
                    From = new MailAddress(_settings.FromAddress, _settings.FromName),
                    Subject = "PlantApp – Password Reset Code",
                    Body = body,
                    IsBodyHtml = false,
                };
                message.To.Add(toEmail);

                using var client = new SmtpClient(_settings.SmtpHost, _settings.SmtpPort)
                {
                    // Port 587 + EnableSsl = STARTTLS (upgrades the connection)
                    EnableSsl = true,
                    // Authenticate with the actual Gmail account, not the forwarding alias
                    Credentials = new NetworkCredential(_settings.AuthEmail, _settings.Password),
                };

                await client.SendMailAsync(message);
                _logger.LogInformation("Password reset code email sent to {Email}.", toEmail);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error sending password reset email to {Email}.", toEmail);
            }
        }
    }
}
