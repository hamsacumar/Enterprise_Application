using System.Net.Http;
using System.Net.Http.Json;
using System.Threading.Tasks;

public class DashboardService
{
    private readonly HttpClient _httpClient;

    public DashboardService(HttpClient httpClient)
    {
        _httpClient = httpClient;
    }

    // 1. Fetch role from AuthService
    public async Task<string?> GetRoleFromTokenAsync(string token)
    {
        var url = "http://auth-service:5003/api/Auth/verify-token";
        var request = new { Token = token };

        var response = await _httpClient.PostAsJsonAsync(url, request);
        if (!response.IsSuccessStatusCode) return null;

        var data = await response.Content.ReadFromJsonAsync<VerifyTokenResponse>();
        return data?.Role;
    }

    // 2. Get customer count only if role is Admin (or any role you want)
    public async Task<int> GetCustomerCountAsync(string token)
    {
        var role = await GetRoleFromTokenAsync(token);

        // Only Admin can see total customer count
        if (role != "Admin")
            return 0;

        // Call AuthService endpoint to get customer count
        var countResponse = await _httpClient.GetFromJsonAsync<CustomerCountResponse>(
            "http://auth-service:5003/api/Auth/customer-count"
        );

        return countResponse?.CustomerCount ?? 0;
    }
}

// Response DTOs
public class VerifyTokenResponse
{
    public string? Message { get; set; }
    public string? UserId { get; set; }
    public string? Username { get; set; }
    public string? Role { get; set; }
}

public class CustomerCountResponse
{
    public int CustomerCount { get; set; }
}
