using System.Threading.Tasks;

namespace PlantAppBE.Services
{
    public interface IEmailService
    {
        Task SendPasswordResetCodeAsync(string toEmail, string code);
    }
}
