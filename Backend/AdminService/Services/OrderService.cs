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
            var response = await _httpClient.GetFromJsonAsync<List<dynamic>>("http://localhost:7193/api/Appointments");

            var orders = new List<OrderDto>();

            if (response != null)
            {
                foreach (var a in response)
                {
                    var servicesJson = a.selectedServicesJson != null ? (string)a.selectedServicesJson : "[]";
                    var servicesList = JsonSerializer.Deserialize<List<string>>(servicesJson) ?? new List<string>();

                    orders.Add(new OrderDto
                    {
                        Customer = a.customerName,
                        CarModel = a.vehicleModel,
                        ServiceType = string.Join(", ", servicesList),
                        Worker = "Worker A", // replace with actual if available
                        Date = a.appointmentDate,
                        Status = a.status,
                        Total = a.totalPriceLkr
                    });
                }
            }

            return orders;
        }
    }
}
