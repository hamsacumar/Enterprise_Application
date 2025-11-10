using AdminService.Models;
using AdminService.Services;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace AdminService.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CustomerController : ControllerBase
    {
        private readonly CustomerService _customerService;

        public CustomerController(CustomerService customerService)
        {
            _customerService = customerService;
        }

        [HttpGet("{username}")]
        public async Task<IActionResult> GetCustomer(string username)
        {
            var customer = await _customerService.GetCustomerDetailsAsync(username);
            if (customer == null) return NotFound("Customer not found.");

            return Ok(customer);
        }
    }
}
