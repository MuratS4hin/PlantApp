using System;
using System.Security.Cryptography;

namespace PlantAppBE.Security
{
    public static class PasswordHasher
    {
        private const int SaltSize = 16;
        private const int HashSize = 32;
        private const int Iterations = 100_000;

        public static (string Hash, byte[] Salt) HashPassword(string password)
        {
            var salt = RandomNumberGenerator.GetBytes(SaltSize);
            var hashBytes = Rfc2898DeriveBytes.Pbkdf2(
                password,
                salt,
                Iterations,
                HashAlgorithmName.SHA256,
                HashSize);

            return (Convert.ToBase64String(hashBytes), salt);
        }

        public static bool VerifyPassword(string password, string storedHash, byte[] storedSalt)
        {
            var hashBytes = Rfc2898DeriveBytes.Pbkdf2(
                password,
                storedSalt,
                Iterations,
                HashAlgorithmName.SHA256,
                HashSize);

            var storedHashBytes = Convert.FromBase64String(storedHash);
            return CryptographicOperations.FixedTimeEquals(storedHashBytes, hashBytes);
        }
    }
}
