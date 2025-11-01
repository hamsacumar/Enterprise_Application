using Microsoft.AspNetCore.Mvc;
using AdminService.Models;
using AdminService.Services;

namespace AdminService.Controllers
{
    [ApiController]
    [Route("api/admin/[controller]")]
    public class WorkersController : ControllerBase
    {
        private readonly IWorkerService _workerService;

        public WorkersController(IWorkerService workerService)
        {
            _workerService = workerService;
        }

        [HttpGet]
        public async Task<IActionResult> GetAllWorkers()
        {
            var workers = await _workerService.GetAllAsync();
            return Ok(workers);
        }

        [HttpPost]
        public async Task<IActionResult> AddWorker([FromBody] Worker worker)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            await _workerService.CreateAsync(worker);
            return Ok(new { message = "Worker added successfully" });
        }
    }
}
