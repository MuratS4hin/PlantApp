namespace PlantAppBE.Models
{
    public class UpdateProfileRequest
    {
        public int Id { get; set; }
        public string? FullName { get; set; }
        public string? PhoneNumber { get; set; }
        public string? Location { get; set; }
        public string? Bio { get; set; }
    }
}
