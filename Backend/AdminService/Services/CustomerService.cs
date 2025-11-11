using AdminService.Models;
using System.Net.Http;
using System.Net.Http.Json;
using System.Threading.Tasks;
using System.Collections.Generic;

namespace AdminService.Services
{
    public class CustomerService
    {
        private readonly HttpClient _httpClient;

        public CustomerService(HttpClient httpClient)
        {
            _httpClient = httpClient;
        }

        // Fetch all classified users from AuthService
  public async Task<List<CustomerDto>> GetAllClassifiedCustomersAsync()
{
    // Use auth-service container hostname for Docker networking
    string url = "http://auth-service:5003/api/Auth/classify/all";

    try
    {
        var customers = await _httpClient.GetFromJsonAsync<List<CustomerDto>>(url);
        return customers ?? new List<CustomerDto>();
    }
    catch (HttpRequestException ex)
    {
        Console.WriteLine($"Error fetching classified customers: {ex.Message}");
        return new List<CustomerDto>();
    }
}

}
}
