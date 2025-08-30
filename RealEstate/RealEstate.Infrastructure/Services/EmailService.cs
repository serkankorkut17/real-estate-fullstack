using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Mail;
using System.Threading.Tasks;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using RealEstate.Application.Interfaces;

namespace RealEstate.Infrastructure.Services
{
    public class EmailService : IEmailService
    {
        private readonly IConfiguration _configuration;
        private readonly ILogger<EmailService> _logger;

        public EmailService(IConfiguration configuration, ILogger<EmailService> logger)
        {
            _configuration = configuration;
            _logger = logger;
        }

        public async Task SendPasswordResetEmailAsync(string userName, string toEmail, string resetToken)
        {
            var smtpHost = _configuration["Smtp:Host"];
            var smtpPortString = _configuration["Smtp:Port"];
            if (string.IsNullOrWhiteSpace(smtpPortString))
            {
                _logger.LogWarning("SMTP 'Port' is not configured.");
                throw new ArgumentException("SMTP 'Port' is not configured.");
            }
            var smtpPort = int.Parse(smtpPortString);
            var smtpUser = _configuration["Smtp:User"];
            var smtpPass = _configuration["Smtp:Pass"];
            var fromEmail = _configuration["Smtp:From"];
            if (string.IsNullOrWhiteSpace(fromEmail))
            {
                _logger.LogWarning("SMTP 'From' address is not configured.");
                throw new ArgumentException("SMTP 'From' address is not configured.");
            }

            var client = new SmtpClient(smtpHost, smtpPort)
            {
                Credentials = new NetworkCredential(smtpUser, smtpPass),
                EnableSsl = true
            };

            // Create the password reset link
            var frontendUrl = _configuration["Frontend:Url"];
            var encodedToken = WebUtility.UrlEncode(resetToken);
            var encodedEmail = WebUtility.UrlEncode(toEmail);
            var resetLink = $"{frontendUrl}/reset-password/{encodedToken}/{encodedEmail}";

            // Load email template
            var templatePath = Path.Combine(AppContext.BaseDirectory, "Templates", "PasswordResetEmail.html");
            var template = await File.ReadAllTextAsync(templatePath);

            var body = template
                .Replace("{{userName}}", userName)
                .Replace("{{passwordResetLink}}", resetLink)
                .Replace("{{currentYear}}", DateTime.Now.Year.ToString());

            var mail = new MailMessage
            {
                From = new MailAddress(fromEmail, "RealEstate Support"),
                Subject = "Password Reset",
                Body = body,
                IsBodyHtml = true
            };
            mail.To.Add(toEmail);

            await client.SendMailAsync(mail);
            _logger.LogInformation("Password reset email sent to {Email}", toEmail);
        }
    }
}