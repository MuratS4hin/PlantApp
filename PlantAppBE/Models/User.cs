namespace PlantAppBE.Models
{
    public class User
    {
        public int Id { get; set; }
        public string Email { get; set; } = string.Empty;
        public string PasswordHash { get; set; } = string.Empty;
        public byte[] PasswordSalt { get; set; } = System.Array.Empty<byte>();
        public long CreatedAt { get; set; }
        public string? FullName { get; set; }
        public string? PhoneNumber { get; set; }
        public string? Location { get; set; }
        public string? Bio { get; set; }
    }
}
