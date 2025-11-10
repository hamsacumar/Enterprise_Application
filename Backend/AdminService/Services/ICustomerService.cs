using AdminService.Models;

public interface ICustomerService
{
    Task<Customer> ClassifyCustomerAsync(Customer request);
    List<Customer> GetAllCustomers();
}
