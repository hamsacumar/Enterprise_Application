using AdminService.Models;

public class CustomerService : ICustomerService
{
    private readonly HttpClient _httpClient;
    private readonly AuthServiceClientConfig _config;
    private static List<Customer> _customers = new();

    public CustomerService(HttpClient httpClient, AuthServiceClientConfig config)
    {
        _httpClient = httpClient;
        _config = config;
    }

    public async Task<Customer> ClassifyCustomerAsync(Customer request)
    {
        // CALLING THE AUTH SERVICE USING URL FROM SETTINGS
        var response = await _httpClient.PostAsJsonAsync(_config.ClassifyUrl, request);

        var customer = await response.Content.ReadFromJsonAsync<Customer>();

        _customers.Add(customer);

        return customer;
    }

    public List<Customer> GetAllCustomers()
    {
        return _customers;
    }
}
