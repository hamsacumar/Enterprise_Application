/*using Microsoft.AspNetCore.Mvc;
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
                .Include(a => a.AppointmentServices)
            .ThenInclude(asg => asg.Service)
        .ToListAsync();
        }





        [HttpGet("{id}")]
        public async Task<ActionResult<Appointment>> GetAppointment(int id)
        {
            var appointment = await _context.Appointments
                .Include(a => a.Vehicle)
               .Include(a => a.AppointmentServices)
            .ThenInclude(asg => asg.Service)
        .FirstOrDefaultAsync(a => a.Id == id);

            if (appointment == null) return NotFound();
            return Ok(appointment);
        }

        [HttpPost]
        public async Task<ActionResult<Appointment>> AddAppointment(Appointment appointment)
        {
            _context.Appointments.Add(appointment);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetAppointment), new { id = appointment.Id }, appointment);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateAppointment(int id, Appointment updated)
        {
            var existing = await _context.Appointments.FindAsync(id);
            if (existing == null) return NotFound();

            existing.Status = updated.Status;
            existing.ExtraPayment = updated.ExtraPayment;
            existing.Note = updated.Note;
            existing.IsPaid = updated.IsPaid;
            existing.ReturnDate = updated.ReturnDate;
            existing.ReturnTime = updated.ReturnTime;

            existing.TotalPriceLkr = updated.TotalPriceLkr;

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
*/



using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WorkersService.Data;
using WorkersService.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace WorkersService.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AppointmentsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public AppointmentsController(AppDbContext context)
        {
            _context = context;
        }

        // ✅ GET all appointments (with Vehicle + Services)
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Appointment>>> GetAppointments()
        {
            return await _context.Appointments
                .Include(a => a.Vehicle)
                .Include(a => a.AppointmentServices)
                    .ThenInclude(asg => asg.Service)
                .ToListAsync();
        }

        // ✅ GET appointment by ID
        [HttpGet("{id}")]
        public async Task<ActionResult<Appointment>> GetAppointment(int id)
        {
            var appointment = await _context.Appointments
                .Include(a => a.Vehicle)
                .Include(a => a.AppointmentServices)
                    .ThenInclude(asg => asg.Service)
                .FirstOrDefaultAsync(a => a.Id == id);

            if (appointment == null)
                return NotFound();

            return Ok(appointment);
        }

        // ✅ POST new appointment
        [HttpPost]
        public async Task<ActionResult<Appointment>> AddAppointment(Appointment appointment)
        {
            _context.Appointments.Add(appointment);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetAppointment), new { id = appointment.Id }, appointment);
        }

        // ✅ PUT update appointment
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateAppointment(int id, Appointment updated)
        {
            var existing = await _context.Appointments.FindAsync(id);
            if (existing == null) return NotFound();

            existing.Status = updated.Status;
            existing.ExtraPayment = updated.ExtraPayment;
            existing.Note = updated.Note;
            existing.IsPaid = updated.IsPaid;
            existing.ReturnDate = updated.ReturnDate;
            existing.ReturnTime = updated.ReturnTime;
            existing.TotalPriceLkr = updated.TotalPriceLkr;

            await _context.SaveChangesAsync();
            return NoContent();
        }

        // ✅ DELETE appointment
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
