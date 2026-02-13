using System.Threading.Tasks;
using PlantAppBE.Models;

namespace PlantAppBE.Workflow
{
    public interface IAuthWorkflow
    {
        Task<AuthResult> RegisterAsync(RegisterRequest request);
        Task<AuthResult> LoginAsync(LoginRequest request);
        Task<AuthResult> UpdateProfileAsync(UpdateProfileRequest request);
    }
}
