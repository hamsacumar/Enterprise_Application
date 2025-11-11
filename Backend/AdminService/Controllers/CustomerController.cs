using AdminService.Models;
using AdminService.Services;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using System.Collections.Generic;

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

        // GET: /api/Customer/classified
        [HttpGet("classified")]
        public async Task<IActionResult> GetAllClassifiedCustomers()
        {
            var customers = await _customerService.GetAllClassifiedCustomersAsync();

            // Always return 200, even if empty
            return Ok(customers);
        }
    }
}
