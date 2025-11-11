using AdminService.Models;

namespace AdminService.Services
{
    public interface IOrderService
    {
        Task<List<OrderDto>> GetOrdersAsync();
    }
}
