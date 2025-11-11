using System.Net;
using System.Net.Http.Json;
using System.Text.Json;
using be.Data;
using be.Models;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Xunit;

namespace be.Tests;

[Trait("Category", "Integration")]
public class AppointmentsControllerIntegrationTests : IClassFixture<CustomWebApplicationFactory>
{
    private readonly HttpClient _client;
    private readonly CustomWebApplicationFactory _factory;

    public AppointmentsControllerIntegrationTests(CustomWebApplicationFactory factory)
    {
        _factory = factory;
        _client = factory.CreateClient();
    }

    [Fact]
    public async Task GetAppointments_ReturnsOk_WithEmptyList_WhenNoAppointments()
    {
        // Arrange
        using var scope = _factory.Services.CreateScope();
        var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
        db.Database.EnsureDeleted();
        db.Database.EnsureCreated();

        // Act
        var response = await _client.GetAsync("/api/Appointments");

        // Assert
        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        var appointments = await response.Content.ReadFromJsonAsync<List<Appointment>>();
        Assert.NotNull(appointments);
        Assert.Empty(appointments);
    }

    [Fact]
    public async Task GetAppointments_ReturnsOk_WithAppointments_OrderedByCreatedAtDescending()
    {
        // Arrange
        using var scope = _factory.Services.CreateScope();
        var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
        db.Database.EnsureDeleted();
        db.Database.EnsureCreated();

        var appointment1 = new Appointment
        {
            CustomerName = "John Doe",
            PhoneNumber = "1234567890",
            Status = "Requested",
            TotalPriceLkr = 1000,
            CreatedAtUtc = DateTime.UtcNow.AddHours(-2)
        };

        var appointment2 = new Appointment
        {
            CustomerName = "Jane Smith",
            PhoneNumber = "0987654321",
            Status = "Accepted",
            TotalPriceLkr = 2000,
            CreatedAtUtc = DateTime.UtcNow.AddHours(-1)
        };

        db.Appointments.AddRange(appointment1, appointment2);
        await db.SaveChangesAsync();

        // Act
        var response = await _client.GetAsync("/api/Appointments");

        // Assert
        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        var appointments = await response.Content.ReadFromJsonAsync<List<Appointment>>();
        Assert.NotNull(appointments);
        Assert.Equal(2, appointments.Count);
        Assert.Equal(2, appointments[0].Id); // Most recent first
        Assert.Equal(1, appointments[1].Id);
    }

    [Fact]
    public async Task GetAppointmentById_ReturnsOk_WhenAppointmentExists()
    {
        // Arrange
        using var scope = _factory.Services.CreateScope();
        var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
        db.Database.EnsureDeleted();
        db.Database.EnsureCreated();

        var appointment = new Appointment
        {
            CustomerName = "John Doe",
            PhoneNumber = "1234567890",
            Status = "Requested",
            TotalPriceLkr = 1000
        };

        db.Appointments.Add(appointment);
        await db.SaveChangesAsync();

        // Act
        var response = await _client.GetAsync($"/api/Appointments/{appointment.Id}");

        // Assert
        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        var returnedAppointment = await response.Content.ReadFromJsonAsync<Appointment>();
        Assert.NotNull(returnedAppointment);
        Assert.Equal(appointment.Id, returnedAppointment.Id);
        Assert.Equal("John Doe", returnedAppointment.CustomerName);
    }

    [Fact]
    public async Task GetAppointmentById_ReturnsNotFound_WhenAppointmentNotExists()
    {
        // Arrange
        using var scope = _factory.Services.CreateScope();
        var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
        db.Database.EnsureDeleted();
        db.Database.EnsureCreated();

        // Act
        var response = await _client.GetAsync("/api/Appointments/999");

        // Assert
        Assert.Equal(HttpStatusCode.NotFound, response.StatusCode);
    }

    [Fact]
    public async Task CreateAppointment_ReturnsCreated_WithAppointment()
    {
        // Arrange
        using var scope = _factory.Services.CreateScope();
        var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
        db.Database.EnsureDeleted();
        db.Database.EnsureCreated();

        var createDto = new
        {
            customerName = "John Doe",
            phoneNumber = "1234567890",
            vehicleId = (int?)null,
            vehicleName = "Toyota",
            vehicleModel = "Camry",
            vehicleYear = 2020,
            vehicleRegNumber = "ABC-1234",
            vehicleType = "Sedan",
            services = new[]
            {
                new { id = "1", name = "Oil Change", basePriceLkr = 500, finalPriceLkr = 500 },
                new { id = "2", name = "Tire Rotation", basePriceLkr = 300, finalPriceLkr = 300 }
            },
            totalPriceLkr = 800,
            appointmentDate = DateTime.UtcNow,
            timeSlot = "10:00 AM",
            note = "Handle with care",
            extraPayment = 0
        };

        // Act
        var response = await _client.PostAsJsonAsync("/api/Appointments", createDto);

        // Assert
        Assert.Equal(HttpStatusCode.Created, response.StatusCode);
        var appointment = await response.Content.ReadFromJsonAsync<Appointment>();
        Assert.NotNull(appointment);
        Assert.True(appointment.Id > 0);
        Assert.Equal("John Doe", appointment.CustomerName);
        Assert.Equal("1234567890", appointment.PhoneNumber);
        Assert.Equal("Requested", appointment.Status);
        Assert.Equal(800, appointment.TotalPriceLkr);
    }

    [Fact]
    public async Task UpdateAppointmentStatus_ReturnsNoContent_WhenAppointmentExists()
    {
        // Arrange
        using var scope = _factory.Services.CreateScope();
        var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
        db.Database.EnsureDeleted();
        db.Database.EnsureCreated();

        var appointment = new Appointment
        {
            CustomerName = "John Doe",
            PhoneNumber = "1234567890",
            Status = "Requested",
            TotalPriceLkr = 1000
        };

        db.Appointments.Add(appointment);
        await db.SaveChangesAsync();

        var updateDto = new { Status = "Accepted" };

        // Act
        var response = await _client.PutAsJsonAsync($"/api/Appointments/{appointment.Id}/status", updateDto);

        // Assert
        Assert.Equal(HttpStatusCode.NoContent, response.StatusCode);

        // Verify the status was updated - refresh the context to see changes
        db.ChangeTracker.Clear();
        var updatedAppointment = await db.Appointments.FindAsync(appointment.Id);
        Assert.NotNull(updatedAppointment);
        Assert.Equal("Accepted", updatedAppointment.Status);
    }

    [Fact]
    public async Task UpdateAppointmentStatus_ReturnsNotFound_WhenAppointmentNotExists()
    {
        // Arrange
        using var scope = _factory.Services.CreateScope();
        var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
        db.Database.EnsureDeleted();
        db.Database.EnsureCreated();

        var updateDto = new { Status = "Accepted" };

        // Act
        var response = await _client.PutAsJsonAsync("/api/Appointments/999/status", updateDto);

        // Assert
        Assert.Equal(HttpStatusCode.NotFound, response.StatusCode);
    }
}

