// Models/Appointment.cs
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace WorkersService.Models
{
    public class Appointment
    {
        public int Id { get; set; }

        [Required]
        public string CustomerName { get; set; }

        [Required]
        public string PhoneNumber { get; set; }

        public string VehicleName { get; set; }
        public string VehicleType { get; set; }
        public string VehicleModel { get; set; }
        public int VehicleYear { get; set; }
        public string VehicleRegNumber { get; set; }

        public string AppointmentDate { get; set; }
        public string TimeSlot { get; set; }
        public string? ReturnDate { get; set; }
        public string? ReturnTime { get; set; }
        public string? Note { get; set; }
        public decimal? ExtraPayment { get; set; }
        public decimal? TotalPayment { get; set; }
        public bool? IsPaid { get; set; }
        public string Status { get; set; } = "New";

        public decimal TotalPriceLkr { get; set; }
        public int? VehicleId { get; set; }
        public Vehicle? Vehicle { get; set; }

        // Relationship
        public ICollection<AppointmentService> AppointmentServices { get; set; }
    }
}
