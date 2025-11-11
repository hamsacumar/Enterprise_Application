using be.Data;
using be.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace be.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ServicesController : ControllerBase
    {
        private readonly AppDbContext _db;
        public ServicesController(AppDbContext db) => _db = db;

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Service>>> Get()
        {
            return await _db.Services.AsNoTracking().ToListAsync();
        }

        [HttpGet("{id:int}")]
        public async Task<ActionResult<Service>> Get(int id)
        {
            var s = await _db.Services.FindAsync(id);
            if (s == null) return NotFound();
            return s;
        }

        [HttpPost]
        public async Task<ActionResult<Service>> Post(Service service)
        {
            _db.Services.Add(service);
            await _db.SaveChangesAsync();
            return CreatedAtAction(nameof(Get), new { id = service.Id }, service);
        }

        [HttpPut("{id:int}")]
        public async Task<IActionResult> Put(int id, Service service)
        {
            if (id != service.Id) return BadRequest();
            _db.Entry(service).State = EntityState.Modified;
            await _db.SaveChangesAsync();
            return NoContent();
        }

        [HttpDelete("{id:int}")]
        public async Task<IActionResult> Delete(int id)
        {
            var s = await _db.Services.FindAsync(id);
            if (s == null) return NotFound();
            _db.Services.Remove(s);
            await _db.SaveChangesAsync();
            return NoContent();
        }
    }
}

