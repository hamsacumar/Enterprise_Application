namespace AdminService.Models
{
   public class CustomerDto
{
    public string Username { get; set; } = null!;
    public string FirstName { get; set; } = null!;
    public string LastName { get; set; } = null!;
    public string Address { get; set; } = null!;
    public string CarModel { get; set; } = null!;
    public string CarLicensePlate { get; set; } = null!;
    public string PhoneNumber { get; set; } = null!;
    public bool IsVerified { get; set; }
}


}
