namespace PlantAppBE.Models
{
    public class AuthResult
    {
        public bool Success { get; set; }
        public string? Message { get; set; }
        public AuthResponse? User { get; set; }
    }
}
