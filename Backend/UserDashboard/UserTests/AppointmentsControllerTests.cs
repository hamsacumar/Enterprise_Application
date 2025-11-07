using be.Controllers;
using be.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Text.Json;

namespace be.Tests;

[Trait("Category", "Unit")]
public class AppointmentsControllerTests
{
    private AppDbContext GetInMemoryDbContext()
    {
        var options = new DbContextOptionsBuilder<AppDbContext>()
            .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
            .Options;
        return new AppDbContext(options);
    }

    [Fact]
    public async Task Get_ReturnsAllAppointments_OrderedByCreatedAtDescending()
    {
        // Arrange
        var db = GetInMemoryDbContext();
        var controller = new AppointmentsController(db);

        var appointment1 = new Appointment
        {
            Id = 1,
            CustomerName = "John Doe",
            PhoneNumber = "1234567890",
            Status = "Requested",
            TotalPriceLkr = 1000,
            CreatedAtUtc = DateTime.UtcNow.AddHours(-2)
        };

        var appointment2 = new Appointment
        {
            Id = 2,
            CustomerName = "Jane Smith",
            PhoneNumber = "0987654321",
            Status = "Accepted",
            TotalPriceLkr = 2000,
            CreatedAtUtc = DateTime.UtcNow.AddHours(-1)
        };

        db.Appointments.AddRange(appointment1, appointment2);
        await db.SaveChangesAsync();

        // Act
        var result = await controller.Get();

        // Assert
        var actionResult = Assert.IsType<ActionResult<IEnumerable<Appointment>>>(result);
        // When returning a value directly, it's stored in Value, not Result
        var appointments = Assert.IsAssignableFrom<List<Appointment>>(actionResult.Value);
        
        Assert.Equal(2, appointments.Count);
        Assert.Equal(2, appointments[0].Id); // Most recent first
        Assert.Equal(1, appointments[1].Id);
    }

    [Fact]
    public async Task Get_WithId_ReturnsAppointment_WhenExists()
    {
        // Arrange
        var db = GetInMemoryDbContext();
        var controller = new AppointmentsController(db);

        var appointment = new Appointment
        {
            Id = 1,
            CustomerName = "John Doe",
            PhoneNumber = "1234567890",
            Status = "Requested",
            TotalPriceLkr = 1000
        };

        db.Appointments.Add(appointment);
        await db.SaveChangesAsync();

        // Act
        var result = await controller.Get(1);

        // Assert
        var actionResult = Assert.IsType<ActionResult<Appointment>>(result);
        // When returning a value directly, it's stored in Value, not Result
        var returnedAppointment = Assert.IsType<Appointment>(actionResult.Value);
        
        Assert.Equal(1, returnedAppointment.Id);
        Assert.Equal("John Doe", returnedAppointment.CustomerName);
    }

    [Fact]
    public async Task Get_WithId_ReturnsNotFound_WhenNotExists()
    {
        // Arrange
        var db = GetInMemoryDbContext();
        var controller = new AppointmentsController(db);

        // Act
        var result = await controller.Get(999);

        // Assert
        var actionResult = Assert.IsType<ActionResult<Appointment>>(result);
        Assert.IsType<NotFoundResult>(actionResult.Result);
    }

    [Fact]
    public async Task Post_CreatesAppointment_AndReturnsCreatedResult()
    {
        // Arrange
        var db = GetInMemoryDbContext();
        var controller = new AppointmentsController(db);

        var dto = new AppointmentsController.CreateAppointmentDto(
            customerName: "John Doe",
            phoneNumber: "1234567890",
            specialInstructions: "Handle with care",
            vehicleId: null,
            vehicleName: "Toyota",
            vehicleModel: "Camry",
            vehicleYear: 2020,
            vehicleRegNumber: "ABC-1234",
            vehicleType: "Sedan",
            services: new[]
            {
                new AppointmentsController.ServiceItemDto("1", "Oil Change", 500, 500),
                new AppointmentsController.ServiceItemDto("2", "Tire Rotation", 300, 300)
            },
            totalPriceLkr: 800
        );

        // Act
        var result = await controller.Post(dto);

        // Assert
        var actionResult = Assert.IsType<ActionResult<Appointment>>(result);
        var createdResult = Assert.IsType<CreatedAtActionResult>(actionResult.Result);
        var appointment = Assert.IsType<Appointment>(createdResult.Value);
        
        Assert.Equal("John Doe", appointment.CustomerName);
        Assert.Equal("1234567890", appointment.PhoneNumber);
        Assert.Equal("Requested", appointment.Status);
        Assert.Equal(800, appointment.TotalPriceLkr);
        Assert.True(appointment.Id > 0);
    }

    [Fact]
    public async Task UpdateStatus_UpdatesStatus_WhenAppointmentExists()
    {
        // Arrange
        var db = GetInMemoryDbContext();
        var controller = new AppointmentsController(db);

        var appointment = new Appointment
        {
            Id = 1,
            CustomerName = "John Doe",
            PhoneNumber = "1234567890",
            Status = "Requested",
            TotalPriceLkr = 1000
        };

        db.Appointments.Add(appointment);
        await db.SaveChangesAsync();

        var updateDto = new AppointmentsController.UpdateStatusDto("Accepted");

        // Act
        var result = await controller.UpdateStatus(1, updateDto);

        // Assert
        Assert.IsType<NoContentResult>(result);
        
        var updatedAppointment = await db.Appointments.FindAsync(1);
        Assert.NotNull(updatedAppointment);
        Assert.Equal("Accepted", updatedAppointment.Status);
    }

    [Fact]
    public async Task UpdateStatus_ReturnsNotFound_WhenAppointmentNotExists()
    {
        // Arrange
        var db = GetInMemoryDbContext();
        var controller = new AppointmentsController(db);

        var updateDto = new AppointmentsController.UpdateStatusDto("Accepted");

        // Act
        var result = await controller.UpdateStatus(999, updateDto);

        // Assert
        Assert.IsType<NotFoundResult>(result);
    }
}

