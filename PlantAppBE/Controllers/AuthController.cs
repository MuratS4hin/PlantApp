using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using PlantAppBE.Models;
using PlantAppBE.Workflow;

namespace PlantAppBE.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly IAuthWorkflow _workflow;

        public AuthController(IAuthWorkflow workflow)
        {
            _workflow = workflow;
        }

        [HttpPost("register")]
        public async Task<ActionResult<AuthResponse>> Register(RegisterRequest request)
        {
            Console.WriteLine($"Received registration request for email: {request}");
            var result = await _workflow.RegisterAsync(request);
            if (!result.Success)
            {
                return BadRequest(new { message = result.Message });
            }

            return Ok(result.User);
        }

        [HttpPost("login")]
        public async Task<ActionResult<AuthResponse>> Login(LoginRequest request)
        {
            var result = await _workflow.LoginAsync(request);
            if (!result.Success)
            {
                return Unauthorized(new { message = result.Message });
            }

            return Ok(result.User);
        }

        [HttpPut("profile")]
        public async Task<ActionResult<AuthResponse>> UpdateProfile(UpdateProfileRequest request)
        {
            var result = await _workflow.UpdateProfileAsync(request);
            if (!result.Success)
            {
                return BadRequest(new { message = result.Message });
            }

            return Ok(result.User);
        }
    }
}
