using be.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace be.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class VehiclesController : ControllerBase
    {
        private readonly AppDbContext _db;
        public VehiclesController(AppDbContext db) => _db = db;

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Vehicle>>> Get()
        {
            return await _db.Vehicles.AsNoTracking().ToListAsync();
        }

        [HttpGet("{id:int}")]
        public async Task<ActionResult<Vehicle>> Get(int id)
        {
            var v = await _db.Vehicles.FindAsync(id);
            if (v == null) return NotFound();
            return v;
        }

        [HttpPost]
        public async Task<ActionResult<Vehicle>> Post(Vehicle vehicle)
        {
            _db.Vehicles.Add(vehicle);
            await _db.SaveChangesAsync();
            return CreatedAtAction(nameof(Get), new { id = vehicle.Id }, vehicle);
        }

        [HttpPut("{id:int}")]
        public async Task<IActionResult> Put(int id, Vehicle vehicle)
        {
            if (id != vehicle.Id) return BadRequest();
            _db.Entry(vehicle).State = EntityState.Modified;
            await _db.SaveChangesAsync();
            return NoContent();
        }

        [HttpDelete("{id:int}")]
        public async Task<IActionResult> Delete(int id)
        {
            var v = await _db.Vehicles.FindAsync(id);
            if (v == null) return NotFound();
            _db.Vehicles.Remove(v);
            await _db.SaveChangesAsync();
            return NoContent();
        }
    }
}


