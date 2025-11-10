using AdminService.Models;
using System.Net.Http;
using System.Net.Http.Json;
using System.Threading.Tasks;

namespace AdminService.Services
{
    public class CustomerService
    {
        private readonly HttpClient _httpClient;

        public CustomerService(HttpClient httpClient)
        {
            _httpClient = httpClient;
        }

        public async Task<CustomerDto?> GetCustomerDetailsAsync(string username)
        {
            string url = $"http://localhost:5143/api/Auth/classify/{username}"; // AuthService endpoint

            try
            {
                var customer = await _httpClient.GetFromJsonAsync<CustomerDto>(url);
                return customer;
            }
            catch (HttpRequestException ex)
            {
                Console.WriteLine($"Error fetching customer: {ex.Message}");
                return null;
            }
        }
    }
}
