namespace PlantAppBE.DataAccess
{
    public class DatabaseSettings
    {
        public string Host { get; set; } = "localhost";
        public int Port { get; set; } = 5432;
        public string Database { get; set; } = "plantapp";
        public string Username { get; set; } = "";
        public string Password { get; set; } = "";
    }
}
