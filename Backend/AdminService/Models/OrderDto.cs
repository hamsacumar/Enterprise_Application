namespace AdminService.Models
{
    public class OrderDto
    {
        public string? Customer { get; set; } = string.Empty;
        public string? CarModel { get; set; } = string.Empty;
        public string? ServiceType { get; set; } = string.Empty;
        public string Worker { get; set; } = string.Empty;
        public DateTime Date { get; set; }
        public string? Status { get; set; } = string.Empty;
        public decimal Total { get; set; }
    }

    public class VehicleDto
    {
        public string? Name { get; set; } = string.Empty;
        public string? Model { get; set; } = string.Empty;
        public string? Type { get; set; } = string.Empty;
        public string? RegNumber { get; set; } = string.Empty;
    }

    public class AppointmentDto
    {
        public string? CustomerName { get; set; } = string.Empty;
        public string? Status { get; set; } = string.Empty;
        public string? SelectedServicesJson { get; set; } = "[]";
        public decimal TotalPriceLkr { get; set; }
        public DateTime AppointmentDate { get; set; }
        public VehicleDto Vehicle { get; set; } = new VehicleDto();
    }

    // Wrapper for $values returned by Worker API
    public class AppointmentListWrapper
    {
        public List<AppointmentDto>? Values { get; set; } = new List<AppointmentDto>();
    }
}
