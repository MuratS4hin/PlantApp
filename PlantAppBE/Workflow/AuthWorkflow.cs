using System;
using System.Threading.Tasks;
using PlantAppBE.DataAccess;
using PlantAppBE.Models;
using PlantAppBE.Security;

namespace PlantAppBE.Workflow
{
    public class AuthWorkflow : IAuthWorkflow
    {
        private readonly Database _database;

        public AuthWorkflow(Database database)
        {
            _database = database;
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

        private static string? ValidateCredentials(string email, string password)
        {
            Console.WriteLine($"Validating credentials: email='{email}', password length={password?.Length ?? 0}");
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
