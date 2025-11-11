using System.Net.Http;
using System.Net.Http.Json;
using System.Threading.Tasks;
using AdminService.Services; // UserService

public class DashboardService
{
    private readonly HttpClient _httpClient;
    private readonly IUserService _userService; // MongoDB user service

    public DashboardService(HttpClient httpClient, IUserService userService)
    {
        _httpClient = httpClient;
        _userService = userService;
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

    // 2. Get customer count only if role is Customer
    public async Task<int> GetCustomerCountAsync(string token)
    {
        var role = await GetRoleFromTokenAsync(token);

        if (role != "Customer")
            return 0;

        // Count customers in MongoDB
        return await _userService.GetCustomerCountAsync();
    }
}

// Helper class for deserializing AuthService response
public class VerifyTokenResponse
{
    public string? Message { get; set; } = null!;
    public string? UserId { get; set; } = null!;
    public string? Username { get; set; } = null!;
    public string? Role { get; set; } = null!;
}
