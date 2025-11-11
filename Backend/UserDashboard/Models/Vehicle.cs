using System.Text.Json.Serialization;

namespace be.Models
{
    public class Vehicle
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;      // e.g., Toyota Camry
        public string Model { get; set; } = string.Empty;     // e.g., 2020
        public int Year { get; set; }
        public string RegNumber { get; set; } = string.Empty;
        public string Type { get; set; } = string.Empty;      // Car / Bike / Van
        public string? Color { get; set; }

        [JsonIgnore] // prevent serialization cycles
        public ICollection<Appointment>? Appointments { get; set; }
    }
}
