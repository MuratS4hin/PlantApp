using System;
using System.Threading.Tasks;
using PlantAppBE.DataAccess;
using PlantAppBE.Models;
using PlantAppBE.Security;
using PlantAppBE.Services;

namespace PlantAppBE.Workflow
{
    public class AuthWorkflow : IAuthWorkflow
    {
        private readonly Database _database;
        private readonly IEmailService _emailService;

        public AuthWorkflow(Database database, IEmailService emailService)
        {
            _database = database;
            _emailService = emailService;
        }

        public async Task<AuthResult> RegisterAsync(RegisterRequest request)
        {
            var validationError = ValidateCredentials(request.Email, request.Password);
            if (validationError != null)
            {
                return new AuthResult { Success = false, Message = validationError };
            }

            var existingUser = await _database.GetUserByEmailAsync(request.Email);
            if (existingUser != null)
            {
                return new AuthResult { Success = false, Message = "Email is already registered." };
            }

            var (hash, salt) = PasswordHasher.HashPassword(request.Password);
            var user = new User
            {
                Email = request.Email.Trim(),
                PasswordHash = hash,
                PasswordSalt = salt,
                CreatedAt = DateTimeOffset.UtcNow.ToUnixTimeSeconds()
            };

            var createdUser = await _database.CreateUserAsync(user);

            return new AuthResult
            {
                Success = true,
                User = new AuthResponse
                {
                    Id = createdUser.Id,
                    Email = createdUser.Email,
                    CreatedAt = createdUser.CreatedAt,
                    FullName = createdUser.FullName,
                    PhoneNumber = createdUser.PhoneNumber,
                    Location = createdUser.Location,
                    Bio = createdUser.Bio
                }
            };
        }

        public async Task<AuthResult> LoginAsync(LoginRequest request)
        {
            var validationError = ValidateCredentials(request.Email, request.Password);
            if (validationError != null)
            {
                return new AuthResult { Success = false, Message = validationError };
            }

            var user = await _database.GetUserByEmailAsync(request.Email);
            if (user == null)
            {
                return new AuthResult { Success = false, Message = "Invalid email or password." };
            }

            var isValid = PasswordHasher.VerifyPassword(request.Password, user.PasswordHash, user.PasswordSalt);
            if (!isValid)
            {
                return new AuthResult { Success = false, Message = "Invalid email or password." };
            }

            return new AuthResult
            {
                Success = true,
                User = new AuthResponse
                {
                    Id = user.Id,
                    Email = user.Email,
                    CreatedAt = user.CreatedAt,
                    FullName = user.FullName,
                    PhoneNumber = user.PhoneNumber,
                    Location = user.Location,
                    Bio = user.Bio
                }
            };
        }

        public async Task<AuthResult> UpdateProfileAsync(UpdateProfileRequest request)
        {
            if (request.Id <= 0)
            {
                return new AuthResult { Success = false, Message = "Invalid user id." };
            }

            var updatedUser = await _database.UpdateUserProfileAsync(
                request.Id,
                request.FullName,
                request.PhoneNumber,
                request.Location,
                request.Bio);

            if (updatedUser == null)
            {
                return new AuthResult { Success = false, Message = "User not found." };
            }

            return new AuthResult
            {
                Success = true,
                User = new AuthResponse
                {
                    Id = updatedUser.Id,
                    Email = updatedUser.Email,
                    CreatedAt = updatedUser.CreatedAt,
                    FullName = updatedUser.FullName,
                    PhoneNumber = updatedUser.PhoneNumber,
                    Location = updatedUser.Location,
                    Bio = updatedUser.Bio
                }
            };
        }

        public async Task<AuthResult> DeleteAccountAsync(int id)
        {
            if (id <= 0)
            {
                return new AuthResult { Success = false, Message = "Invalid user id." };
            }

            var deleted = await _database.DeleteUserAsync(id);
            if (!deleted)
            {
                return new AuthResult { Success = false, Message = "User not found." };
            }

            return new AuthResult { Success = true, Message = "Account deleted successfully." };
        }

        public async Task<AuthResult> ForgotPasswordAsync(ForgotPasswordRequest request)
        {
            if (string.IsNullOrWhiteSpace(request.Email) || !request.Email.Contains("@"))
            {
                return new AuthResult { Success = false, Message = "Please enter a valid email address." };
            }

            var user = await _database.GetUserByEmailAsync(request.Email);
            if (user == null)
            {
                return new AuthResult { Success = false, Message = "No account found with that email." };
            }

            var code = GenerateResetCode();
            var expiresAt = DateTimeOffset.UtcNow.AddMinutes(15).ToUnixTimeSeconds();

            await _database.CreatePasswordResetTokenAsync(user.Id, code, expiresAt);

            try
            {
                await _emailService.SendPasswordResetCodeAsync(request.Email.Trim(), code);
            }
            catch (Exception ex)
            {
                return new AuthResult { Success = false, Message = "Failed to send reset code. Please try again later." };
            }

            return new AuthResult { Success = true, Message = "Reset code sent to your email." };
        }

        public async Task<AuthResult> VerifyResetCodeAsync(VerifyResetCodeRequest request)
        {
            var token = await _database.GetValidPasswordResetTokenAsync(request.Email, request.Code);
            if (token == null)
            {
                return new AuthResult { Success = false, Message = "Invalid or expired code. Please try again." };
            }

            return new AuthResult { Success = true, Message = "Code verified." };
        }

        public async Task<AuthResult> ResetPasswordAsync(ResetPasswordRequest request)
        {
            if (string.IsNullOrWhiteSpace(request.NewPassword) || request.NewPassword.Length < 6)
            {
                return new AuthResult { Success = false, Message = "Password must be at least 6 characters." };
            }

            var token = await _database.GetValidPasswordResetTokenAsync(request.Email, request.Code);
            if (token == null)
            {
                return new AuthResult { Success = false, Message = "Invalid or expired code. Please start over." };
            }

            var (hash, salt) = PasswordHasher.HashPassword(request.NewPassword);
            await _database.UpdateUserPasswordAsync(token.UserId, hash, salt);
            await _database.MarkResetTokenUsedAsync(token.Id);

            return new AuthResult { Success = true, Message = "Password reset successfully. You can now log in." };
        }

        private static string GenerateResetCode()
        {
            var random = new Random();
            return random.Next(100000, 999999).ToString();
        }

        private static string? ValidateCredentials(string email, string password)
        {
            if (string.IsNullOrWhiteSpace(email) || !email.Contains("@"))
            {
                return "Please enter a valid email address.";
            }

            if (string.IsNullOrWhiteSpace(password) || password.Length < 6)
            {
                return "Password must be at least 6 characters.";
            }

            return null;
        }
    }
}
