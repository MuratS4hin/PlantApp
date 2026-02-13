namespace PlantAppBE.Models
{
    public class Plant
    {
        public int Id { get; set; }
        public string PlantName { get; set; } = string.Empty;
        public string? PlantType { get; set; }
        public byte[]? PlantImage { get; set; }
        public string? PlantImageMimeType { get; set; }
        public string? CareNotes { get; set; }
        public string? Sunlight { get; set; }

        public bool IsSummer { get; set; }

        public int SummerWateringNumber { get; set; }
        public string? SummerWateringUnit { get; set; }
        public int SummerWateringDayUnit { get; set; }

        public int WinterWateringNumber { get; set; }
        public string? WinterWateringUnit { get; set; }
        public int WinterWateringDayUnit { get; set; }

        public int FertilizingNumber { get; set; }
        public string? FertilizingUnit { get; set; }
        public int FertilizingDayUnit { get; set; }

        public long LastWatered { get; set; }
        public long LastFertilized { get; set; }
    }
}
