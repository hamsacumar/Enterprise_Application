using Microsoft.AspNetCore.Mvc;

namespace WorkersService.Controllers
{
    [ApiController]
    [Route("/")]
    public class HomeController : ControllerBase
    {
        [HttpGet]
        public IActionResult Get() => Redirect("/swagger/index.html");
    }
}
