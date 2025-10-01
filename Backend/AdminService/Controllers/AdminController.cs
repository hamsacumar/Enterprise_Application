using Microsoft.AspNetCore.Mvc;
using AdminService.Models;
using AdminService.Services;

namespace AdminService.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AdminController : ControllerBase
    {
        private readonly IAdminService _adminService;

        public AdminController(IAdminService adminService)
        {
            _adminService = adminService;
        }

        [HttpGet("hello")]
        public IActionResult GetHello()
        {
            return Ok(_adminService.GetMessage());
        }
    }
}
