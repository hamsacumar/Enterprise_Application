using System.Text.Json;
using be.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace be.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AppointmentsController : ControllerBase
    {
        private readonly AppDbContext _db;
        public AppointmentsController(AppDbContext db) => _db = db;

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Appointment>>> Get()
        {
            return await _db.Appointments.AsNoTracking().OrderByDescending(a => a.CreatedAtUtc).ToListAsync();
        }

        [HttpGet("{id:int}")]
        public async Task<ActionResult<Appointment>> Get(int id)
        {
            var a = await _db.Appointments.FindAsync(id);
            if (a == null) return NotFound();
            return a;
        }

        public record ServiceItemDto(string id, string name, int basePriceLkr, int finalPriceLkr);
        public record CreateAppointmentDto(
            string customerName,
            string phoneNumber,
            string? specialInstructions,
            int? vehicleId,
            string? vehicleName,
            string? vehicleModel,
            int? vehicleYear,
            string? vehicleRegNumber,
            string? vehicleType,
            IEnumerable<ServiceItemDto> services,
            int totalPriceLkr
        );

        [HttpPost]
        public async Task<ActionResult<Appointment>> Post([FromBody] CreateAppointmentDto dto)
        {
            var entity = new Appointment
            {
                CustomerName = dto.customerName,
                PhoneNumber = dto.phoneNumber,
                // Preferred date/time removed
                SpecialInstructions = dto.specialInstructions,
                VehicleId = dto.vehicleId,
                VehicleName = dto.vehicleName,
                VehicleModel = dto.vehicleModel,
                VehicleYear = dto.vehicleYear,
                VehicleRegNumber = dto.vehicleRegNumber,
                VehicleType = dto.vehicleType,
                SelectedServicesJson = JsonSerializer.Serialize(dto.services),
                TotalPriceLkr = dto.totalPriceLkr,
                Status = "Requested"
            };

            _db.Appointments.Add(entity);
            await _db.SaveChangesAsync();
            return CreatedAtAction(nameof(Get), new { id = entity.Id }, entity);
        }

        public record UpdateStatusDto(string Status);

        [HttpPut("{id:int}/status")]
        public async Task<IActionResult> UpdateStatus(int id, [FromBody] UpdateStatusDto dto)
        {
            var a = await _db.Appointments.FindAsync(id);
            if (a == null) return NotFound();
            a.Status = dto.Status;
            await _db.SaveChangesAsync();
            return NoContent();
        }
    }
}


