using System.Text.Json;
using be.Data;
using be.Models;
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
        public async Task<ActionResult<IEnumerable<Appointment>>> Get([FromQuery] string? status = null)
        {
            var query = _db.Appointments.AsNoTracking();
            
            if (!string.IsNullOrEmpty(status))
            {
                var statuses = status.Split(',', StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries);
                query = query.Where(a => statuses.Contains(a.Status));
            }
            
            return await query.OrderByDescending(a => a.CreatedAtUtc).ToListAsync();
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
            string? customerName,
            string? phoneNumber,
            int? vehicleId,
            string vehicleName,
            string vehicleModel,
            int vehicleYear,
            string vehicleRegNumber,
            string vehicleType,
            IEnumerable<ServiceItemDto> services,
            int totalPriceLkr,
            DateTime? appointmentDate,
            string? timeSlot,
            string? note,
            int? extraPayment
        );

        [HttpPost]
        public async Task<ActionResult<Appointment>> Post([FromBody] CreateAppointmentDto dto)
        {
            var entity = new Appointment
            {
                CustomerName = dto.customerName ?? string.Empty,
                PhoneNumber = dto.phoneNumber ?? string.Empty,
                VehicleId = dto.vehicleId,
                VehicleName = dto.vehicleName,
                VehicleModel = dto.vehicleModel,
                VehicleYear = dto.vehicleYear,
                VehicleRegNumber = dto.vehicleRegNumber,
                VehicleType = dto.vehicleType,
                SelectedServicesJson = JsonSerializer.Serialize(dto.services),
                TotalPriceLkr = dto.totalPriceLkr,
                AppointmentDate = dto.appointmentDate ?? DateTime.UtcNow,
                TimeSlot = dto.timeSlot ?? string.Empty,
                Note = dto.note,
                ExtraPayment = dto.extraPayment ?? 0,
                Status = "New"
            };

            entity.RecalculateTotalPayment();

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


