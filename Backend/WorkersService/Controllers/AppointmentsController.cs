using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WorkersService.Data;
using WorkersService.Models;

namespace WorkersService.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AppointmentsController : ControllerBase
    {
        private readonly AppDbContext _context;
        public AppointmentsController(AppDbContext context) => _context = context;

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Appointment>>> GetAppointments()
        {
            return await _context.Appointments
                .Include(a => a.Vehicle)
                .ToListAsync();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Appointment>> GetAppointment(int id)
        {
            var appointment = await _context.Appointments
                .Include(a => a.Vehicle)
                .FirstOrDefaultAsync(a => a.Id == id);

            if (appointment == null) return NotFound();
            return Ok(appointment);
        }

        [HttpPost]
        public async Task<ActionResult<Appointment>> AddAppointment(Appointment appointment)
        {
            // Recalculate TotalPayment before saving
            appointment.TotalPayment = appointment.TotalPriceLkr + appointment.ExtraPayment;

            _context.Appointments.Add(appointment);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetAppointment), new { id = appointment.Id }, appointment);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateAppointment(int id, Appointment updated)
        {
            var existing = await _context.Appointments.FindAsync(id);
            if (existing == null) return NotFound();

            // Update fields
            existing.Status = updated.Status;
            existing.ExtraPayment = updated.ExtraPayment;
            existing.Note = updated.Note;
            existing.IsPaid = updated.IsPaid;
            existing.ReturnDate = updated.ReturnDate;
            existing.ReturnTime = updated.ReturnTime;
            existing.SelectedServicesJson = updated.SelectedServicesJson;
            existing.TotalPriceLkr = updated.TotalPriceLkr;

            // Recalculate TotalPayment
            existing.TotalPayment = existing.TotalPriceLkr + existing.ExtraPayment;

            await _context.SaveChangesAsync();
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteAppointment(int id)
        {
            var appointment = await _context.Appointments.FindAsync(id);
            if (appointment == null) return NotFound();

            _context.Appointments.Remove(appointment);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}
