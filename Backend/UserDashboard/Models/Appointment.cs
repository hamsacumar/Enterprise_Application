using System;
using System.Text.Json.Serialization;

namespace be.Models
{
    public class Appointment
    {
        public int Id { get; set; }
        public string CustomerName { get; set; } = string.Empty;
        public string PhoneNumber { get; set; } = string.Empty;
        public string Status { get; set; } = "New"; // New, Pending, OnWork, Completed

        // Vehicle relationship
        public int? VehicleId { get; set; }
        public Vehicle? Vehicle { get; set; }

        // Vehicle snapshot
        public string VehicleName { get; set; } = string.Empty;
        public string VehicleModel { get; set; } = string.Empty;
        public int VehicleYear { get; set; }
        public string VehicleType { get; set; } = string.Empty;
        public string VehicleRegNumber { get; set; } = string.Empty;

        // Service info
        public string SelectedServicesJson { get; set; } = "[]";
        public int TotalPriceLkr { get; set; }

        // Extra details
        public DateTime AppointmentDate { get; set; }
        public string TimeSlot { get; set; } = string.Empty;
        public DateTime? ReturnDate { get; set; }
        public string? ReturnTime { get; set; }
        public string? Note { get; set; }
        public int ExtraPayment { get; set; }
        public bool IsPaid { get; set; } = false;

        // New: TotalPayment
        public int TotalPayment { get; set; }  // = TotalPriceLkr + ExtraPayment

        public DateTime CreatedAtUtc { get; set; } = DateTime.UtcNow;

        // Utility method: recalc total payment
        public void RecalculateTotalPayment()
        {
            TotalPayment = TotalPriceLkr + ExtraPayment;
        }
    }
}
