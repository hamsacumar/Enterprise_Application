using Microsoft.EntityFrameworkCore;
using WorkersService.Models;

namespace WorkersService.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<Vehicle> Vehicles => Set<Vehicle>();
        public DbSet<Appointment> Appointments => Set<Appointment>();
        public DbSet<AppointmentService> AppointmentServices { get; set; }
        public DbSet<Service> Services { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<AppointmentService>()
                .HasOne(a => a.Appointment)
                .WithMany(b => b.AppointmentServices)
                .HasForeignKey(a => a.AppointmentId);

            modelBuilder.Entity<AppointmentService>()
                .HasOne(s => s.Service)
                .WithMany(b => b.AppointmentServices)
                .HasForeignKey(s => s.ServiceId);
        }

    }
}
