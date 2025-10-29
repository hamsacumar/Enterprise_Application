using Microsoft.AspNetCore.Mvc;
using Backend.Models;
using Backend.Services;

namespace Backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TestController : ControllerBase
    {
        private readonly ITestService _testService;

        public TestController(ITestService testService)
        {
            _testService = testService;
        }

        [HttpGet]
        public async Task<ActionResult<List<TestItem>>> Get()
        {
            var items = await _testService.GetAllAsync();
            return Ok(items);
        }

        
    

    [HttpPost("init")]
    public async Task<IActionResult> Initialize()
    {
        await _testService.CreateAsync(new TestItem { Value = 4 });
        return Ok(new { success = true, message = "Database initialized with 4" });
    }

    // Create new test data
    [HttpPost]
    public async Task<IActionResult> Create([FromBody] TestItem item)
    {
        await _testService.CreateAsync(item);
        return Ok(new { success = true, message = "New test data created" });
    }
}
    }
