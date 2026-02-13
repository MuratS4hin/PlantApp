namespace PlantAppBE.Models
{
    public class AuthResponse
    {
        public int Id { get; set; }
        public string Email { get; set; } = string.Empty;
        public long CreatedAt { get; set; }
        public string? FullName { get; set; }
        public string? PhoneNumber { get; set; }
        public string? Location { get; set; }
        public string? Bio { get; set; }
    }
}
