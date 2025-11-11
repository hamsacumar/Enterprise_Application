using AdminService.Models;
using System.Net.Http.Json;
using System.Text.Json;

namespace AdminService.Services
{
    public class OrderService : IOrderService
    {
        private readonly HttpClient _httpClient;

        public OrderService(HttpClient httpClient)
        {
            _httpClient = httpClient;
        }

        public async Task<List<OrderDto>> GetOrdersAsync()
{
    // Fetch wrapped response from Worker service
    var wrapper = await _httpClient.GetFromJsonAsync<AppointmentListWrapper>(
        "http://worker-service:7193/api/Appointments"
    );

    // Extract the actual list or initialize empty
    var response = wrapper?.Values ?? new List<AppointmentDto>();

    var orders = new List<OrderDto>();

    foreach (var a in response)
    {
        var servicesList = new List<string>();
        if (!string.IsNullOrEmpty(a.SelectedServicesJson))
        {
            try
            {
                servicesList = JsonSerializer.Deserialize<List<string>>(a.SelectedServicesJson) ?? new List<string>();
            }
            catch
            {
                servicesList = new List<string>();
            }
        }

        orders.Add(new OrderDto
        {
            Customer = a.CustomerName ?? string.Empty,
            CarModel = a.Vehicle?.Model ?? string.Empty,
            ServiceType = string.Join(", ", servicesList),
            Worker = "Worker A",
            Date = a.AppointmentDate,
            Status = a.Status ?? string.Empty,
            Total = a.TotalPriceLkr
        });
    }

    return orders;
}

    }
}
