namespace PlantAppBE.Models
{
    public class PasswordResetToken
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public string Code { get; set; } = string.Empty;
        public long ExpiresAt { get; set; }
        public bool Used { get; set; }
    }
}
