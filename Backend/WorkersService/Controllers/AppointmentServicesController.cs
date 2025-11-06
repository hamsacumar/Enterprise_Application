using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WorkersService.Data;
using WorkersService.Models;


namespace WorkersService.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AppointmentServicesController : ControllerBase
    {
        private readonly AppDbContext _context;
        public AppointmentServicesController(AppDbContext context) => _context = context;

        [HttpPost]
        public async Task<IActionResult> AddServiceToAppointment(int appointmentId, int serviceId)
        {
            var link = new AppointmentService
            {
                AppointmentId = appointmentId,
                ServiceId = serviceId
            };

            _context.AppointmentServices.Add(link);
            await _context.SaveChangesAsync();
            return Ok(link);
        }

        [HttpDelete("{appointmentId}/{serviceId}")]
        public async Task<IActionResult> RemoveServiceFromAppointment(int appointmentId, int serviceId)
        {
            var link = await _context.AppointmentServices
                .FirstOrDefaultAsync(a => a.AppointmentId == appointmentId && a.ServiceId == serviceId);
            if (link == null) return NotFound();

            _context.AppointmentServices.Remove(link);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}
