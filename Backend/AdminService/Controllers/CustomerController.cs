using Microsoft.AspNetCore.Mvc;
using AdminService.Models;

[ApiController]
[Route("api/[controller]")]
public class CustomerController : ControllerBase
{
    private readonly ICustomerService _customerService;

    public CustomerController(ICustomerService customerService)
    {
        _customerService = customerService;
    }

    [HttpPost("classify")]
    public async Task<IActionResult> Classify([FromBody] Customer request)
    {
        var result = await _customerService.ClassifyCustomerAsync(request);
        return Ok(result);
    }

    [HttpGet]
    public IActionResult GetAll()
    {
        return Ok(_customerService.GetAllCustomers());
    }
}
