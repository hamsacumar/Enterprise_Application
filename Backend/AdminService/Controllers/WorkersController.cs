using Backend.Models;
using Backend.Services;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers
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

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateWorker(string id, [FromBody] Worker worker)
        {
            await _workerService.UpdateAsync(id, worker);
            return Ok(new { message = "Worker updated successfully" });
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteWorker(string id)
        {
            await _workerService.DeleteAsync(id);
            return Ok(new { message = "Worker deleted successfully" });
        }
    }
}
