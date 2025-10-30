using Backend.Models;
using Backend.Services;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ServicesController : ControllerBase
    {
        private readonly IServiceService _service;

        public ServicesController(IServiceService service)
        {
            _service = service;
        }

        // GET: /api/services
        [HttpGet]
        public async Task<ActionResult<List<ServiceItem>>> Get()
        {
            var items = await _service.GetAllAsync();
            return Ok(items);
        }

        // GET: /api/services/{id}
        [HttpGet("{id:length(24)}")]
        public async Task<ActionResult<ServiceItem>> GetById(string id)
        {
            var item = await _service.GetByIdAsync(id);
            if (item == null) return NotFound();
            return Ok(item);
        }

        // POST: /api/services
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] ServiceItem item)
        {
            // id left empty -> Mongo will create
            await _service.CreateAsync(item);
            return CreatedAtAction(nameof(GetById), new { id = item.Id }, item);
        }

        // PUT: /api/services/{id}
        [HttpPut("{id:length(24)}")]
        public async Task<IActionResult> Update(string id, [FromBody] ServiceItem updated)
        {
            var exists = await _service.GetByIdAsync(id);
            if (exists == null) return NotFound();

            // preserve CreatedAt if you want
            updated.Id = id;
            updated.CreatedAt = exists.CreatedAt;

            var ok = await _service.UpdateAsync(id, updated);
            if (!ok) return StatusCode(500, "Update failed");
            return NoContent();
        }

        // DELETE: /api/services/{id}
        [HttpDelete("{id:length(24)}")]
        public async Task<IActionResult> Delete(string id)
        {
            var ok = await _service.DeleteAsync(id);
            if (!ok) return NotFound();
            return NoContent();
        }
    }
}
