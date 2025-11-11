namespace AdminService.Models
{
    public class OrderDto
    {
        public string Customer { get; set; } = string.Empty;
        public string CarModel { get; set; } = string.Empty;
        public string ServiceType { get; set; } = string.Empty;
        public string Worker { get; set; } = string.Empty;
        public DateTime Date { get; set; }
        public string Status { get; set; } = string.Empty;
        public decimal Total { get; set; }
    }
}
