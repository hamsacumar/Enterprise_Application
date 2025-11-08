using Microsoft.EntityFrameworkCore;
using WorkersService.Models;

namespace WorkersService.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<Vehicle> Vehicles => Set<Vehicle>();
        public DbSet<Appointment> Appointments => Set<Appointment>();
    }
}
