using Microsoft.EntityFrameworkCore;

namespace be.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {
        }

        public DbSet<Vehicle> Vehicles => Set<Vehicle>();
        public DbSet<Appointment> Appointments => Set<Appointment>();
    }

    public class Vehicle
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Model { get; set; } = string.Empty;
        public int Year { get; set; }
        public string RegNumber { get; set; } = string.Empty;
        public string Type { get; set; } = string.Empty;
        public string? Color { get; set; }
    }

    public class Appointment
    {
        public int Id { get; set; }
        public string CustomerName { get; set; } = string.Empty;
        public string PhoneNumber { get; set; } = string.Empty;
        // Preferred date/time removed per requirements
        public string Status { get; set; } = "Requested"; // Requested, Accepted, Completed
        public string? SpecialInstructions { get; set; }

        // Vehicle selection (either linked vehicle or inline details)
        public int? VehicleId { get; set; }
        public Vehicle? Vehicle { get; set; }

        public string? VehicleName { get; set; }
        public string? VehicleModel { get; set; }
        public int? VehicleYear { get; set; }
        public string? VehicleRegNumber { get; set; }
        public string? VehicleType { get; set; }

        // Services summary for now; teammate can normalize later
        public string SelectedServicesJson { get; set; } = "[]"; // JSON array of {id,name,basePriceLkr,finalPriceLkr}
        public int TotalPriceLkr { get; set; }

        public DateTime CreatedAtUtc { get; set; } = DateTime.UtcNow;
    }
}


