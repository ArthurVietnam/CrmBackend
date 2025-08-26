using System.Net;
using System.Net.Mail;

namespace Aplication.Services;

public static class EmailService
{
    private const string SmtpServer = "smtp.your-email-provider.com"; // SMTP-сервер (например, smtp.gmail.com)
    private const int SmtpPort = 587; // 587 (TLS) или 465 (SSL)
    private const string SenderEmail = "your-email@example.com"; // Почта, с которой отправляем
    private const string SenderPassword = "your-email-password"; // Пароль (или App Password, если это Gmail)
    
    public static async Task<string> SendVerificationCodeAsync(string recipientEmail,string token)
    {
        string subject = "Your access code";
        string body = $"Your access code: {token}\n\nPrint it in app for finish verification.";

        using (var client = new SmtpClient(SmtpServer, SmtpPort))
        {
            client.Credentials = new NetworkCredential(SenderEmail, SenderPassword);
            client.EnableSsl = true; // Используем SSL

            var message = new MailMessage(SenderEmail, recipientEmail, subject, body);
            await client.SendMailAsync(message);
        }

        Console.WriteLine($"Code {token} send to {recipientEmail}");
        return token;
    }

    public static string GenerateToken()
    {
        Random rnd = new Random();
        return rnd.Next(100000, 999999).ToString();
    }
}