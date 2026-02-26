namespace PlantAppBE.Services
{
    public class EmailSettings
    {
        public string SmtpHost { get; set; } = "smtp.gmail.com";
        public int SmtpPort { get; set; } = 587;
        /// <summary>The actual Gmail account used for SMTP authentication.</summary>
        public string AuthEmail { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
        /// <summary>The forwarding alias displayed as the sender (From address).</summary>
        public string FromAddress { get; set; } = string.Empty;
        public string FromName { get; set; } = "PlantApp";
    }
}
