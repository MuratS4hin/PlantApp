using System.Threading.Tasks;
using PlantAppBE.Models;

namespace PlantAppBE.Workflow
{
    public interface IAuthWorkflow
    {
        Task<AuthResult> RegisterAsync(RegisterRequest request);
        Task<AuthResult> LoginAsync(LoginRequest request);
        Task<AuthResult> UpdateProfileAsync(UpdateProfileRequest request);
        Task<AuthResult> DeleteAccountAsync(int id);
        Task<AuthResult> ForgotPasswordAsync(ForgotPasswordRequest request);
        Task<AuthResult> VerifyResetCodeAsync(VerifyResetCodeRequest request);
        Task<AuthResult> ResetPasswordAsync(ResetPasswordRequest request);
    }
}
