using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using WorkersService.Models;

namespace WorkersService.Models
{
    public class AppointmentService
    {
        public int Id { get; set; }

        public int AppointmentId { get; set; }
        public Appointment Appointment { get; set; }

        public int ServiceId { get; set; }
        public Service Service { get; set; }
    }
}
