using System.Net;
using System.Net.Mail;
using Microsoft.Extensions.Options;

namespace Aplication.Services;

public class EmailSettings
{
    public string SmtpServer { get; set; } = string.Empty;
    public int SmtpPort { get; set; }
    public string SenderEmail { get; set; } = string.Empty;
    public string SenderPassword { get; set; } = string.Empty;
    public bool EnableSsl { get; set; } = true;
}

public interface IEmailService
{
    Task SendVerificationCodeAsync(string recipientEmail, string code);
    string GenerateToken();
}

public class EmailService : IEmailService
{
    private readonly EmailSettings _settings;

    public EmailService(IOptions<EmailSettings> settings)
    {
        _settings = settings.Value;
    }

    public async Task SendVerificationCodeAsync(string recipientEmail, string code)
    {
        var subject = "Your access code";
        var body = $"Your access code: {code}\n\nPrint it in app for finish verification.";

        using var client = new SmtpClient(_settings.SmtpServer, _settings.SmtpPort)
        {
            Credentials = new NetworkCredential(_settings.SenderEmail, _settings.SenderPassword),
            EnableSsl = _settings.EnableSsl
        };

        var message = new MailMessage(_settings.SenderEmail, recipientEmail, subject, body);
        await client.SendMailAsync(message);
    }

    public string GenerateToken()
    {
        return System.Security.Cryptography.RandomNumberGenerator.GetInt32(100000, 999999).ToString();
    }
}