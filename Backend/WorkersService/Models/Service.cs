
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace WorkersService.Models
{
    public class Service
    {
        public int Id { get; set; }

        [Required]
        public string Name { get; set; }

        [Required]
        public decimal BasePrice { get; set; }

        // Relationship
        public ICollection<AppointmentService>? AppointmentServices { get; set; }
    }
}
