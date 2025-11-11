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
    try
    {
        // Parse services JSON string
        var services = System.Text.Json.JsonSerializer.Deserialize<List<Dictionary<string, object>>>(
            appointment.SelectedServicesJson ?? "[]"
        );

        // Sum all base prices
        int total = 0;
        foreach (var s in services)
        {
            if (s.TryGetValue("basePrice", out var priceObj) && int.TryParse(priceObj.ToString(), out var price))
                total += price;
        }

        appointment.TotalPriceLkr = total;
        appointment.TotalPayment = total + appointment.ExtraPayment;

        _context.Appointments.Add(appointment);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetAppointment), new { id = appointment.Id }, appointment);
    }
    catch (Exception ex)
    {
        return BadRequest($"Failed to save appointment: {ex.Message}");
    }
}

[HttpPut("{id}")]
public async Task<IActionResult> UpdateAppointment(int id, [FromBody] Appointment updated)
{
    if (updated == null)
        return BadRequest("Invalid appointment data");

    var existing = await _context.Appointments.FindAsync(id);
    if (existing == null)
        return NotFound($"Appointment with ID {id} not found");

    // ✅ Safely update fields
    existing.Status = updated.Status ?? existing.Status;
    existing.ExtraPayment = updated.ExtraPayment >= 0 ? updated.ExtraPayment : existing.ExtraPayment;
    existing.Note = updated.Note ?? existing.Note;
    existing.IsPaid = updated.IsPaid;
    existing.ReturnDate = updated.ReturnDate ?? existing.ReturnDate;
    existing.ReturnTime = updated.ReturnTime ?? existing.ReturnTime;

    // ✅ Validate & sanitize JSON
    if (!string.IsNullOrWhiteSpace(updated.SelectedServicesJson))
    {
        try
        {
            // Just test if it's valid JSON
            System.Text.Json.JsonDocument.Parse(updated.SelectedServicesJson);
            existing.SelectedServicesJson = updated.SelectedServicesJson;
        }
        catch
        {
            return BadRequest("Invalid SelectedServicesJson format");
        }
    }

    // ✅ Price calculations
    existing.TotalPriceLkr = updated.TotalPriceLkr >= 0
        ? updated.TotalPriceLkr
        : existing.TotalPriceLkr;

    // ✅ Recalculate total payment
    existing.TotalPayment = (existing.TotalPriceLkr) + (existing.ExtraPayment);

    await _context.SaveChangesAsync();

    return Ok(new
    {
        Message = "Appointment updated successfully",
        Updated = existing
    });
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
