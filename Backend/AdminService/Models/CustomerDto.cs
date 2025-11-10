namespace AdminService.Models
{
    public class CustomerDto
    {
        public string? FirstName { get; set; }
        public string? LastName { get; set; }
        public string? Address { get; set; }
        public string? CarModel { get; set; }
        public string? CarLicensePlate { get; set; }
        public string? PhoneNumber { get; set; }
        public bool IsVerified { get; set; }
    }
}
