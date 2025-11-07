using System.Net;
using System.Net.Http.Json;
using be.Data;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Xunit;

namespace be.Tests;

[Trait("Category", "Integration")]
public class VehiclesControllerIntegrationTests : IClassFixture<CustomWebApplicationFactory>
{
    private readonly HttpClient _client;
    private readonly CustomWebApplicationFactory _factory;

    public VehiclesControllerIntegrationTests(CustomWebApplicationFactory factory)
    {
        _factory = factory;
        _client = factory.CreateClient();
    }

    [Fact]
    public async Task GetVehicles_ReturnsOk_WithEmptyList_WhenNoVehicles()
    {
        // Arrange
        using var scope = _factory.Services.CreateScope();
        var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
        db.Database.EnsureDeleted();
        db.Database.EnsureCreated();

        // Act
        var response = await _client.GetAsync("/api/Vehicles");

        // Assert
        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        var vehicles = await response.Content.ReadFromJsonAsync<List<Vehicle>>();
        Assert.NotNull(vehicles);
        Assert.Empty(vehicles);
    }

    [Fact]
    public async Task GetVehicles_ReturnsOk_WithVehicles()
    {
        // Arrange
        using var scope = _factory.Services.CreateScope();
        var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
        db.Database.EnsureDeleted();
        db.Database.EnsureCreated();

        var vehicle1 = new Vehicle
        {
            Name = "Toyota",
            Model = "Camry",
            Year = 2020,
            RegNumber = "ABC-1234",
            Type = "Sedan"
        };

        var vehicle2 = new Vehicle
        {
            Name = "Honda",
            Model = "Civic",
            Year = 2021,
            RegNumber = "XYZ-5678",
            Type = "Sedan"
        };

        db.Vehicles.AddRange(vehicle1, vehicle2);
        await db.SaveChangesAsync();

        // Act
        var response = await _client.GetAsync("/api/Vehicles");

        // Assert
        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        var vehicles = await response.Content.ReadFromJsonAsync<List<Vehicle>>();
        Assert.NotNull(vehicles);
        Assert.Equal(2, vehicles.Count);
    }

    [Fact]
    public async Task GetVehicleById_ReturnsOk_WhenVehicleExists()
    {
        // Arrange
        using var scope = _factory.Services.CreateScope();
        var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
        db.Database.EnsureDeleted();
        db.Database.EnsureCreated();

        var vehicle = new Vehicle
        {
            Name = "Toyota",
            Model = "Camry",
            Year = 2020,
            RegNumber = "ABC-1234",
            Type = "Sedan"
        };

        db.Vehicles.Add(vehicle);
        await db.SaveChangesAsync();

        // Act
        var response = await _client.GetAsync($"/api/Vehicles/{vehicle.Id}");

        // Assert
        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        var returnedVehicle = await response.Content.ReadFromJsonAsync<Vehicle>();
        Assert.NotNull(returnedVehicle);
        Assert.Equal(vehicle.Id, returnedVehicle.Id);
        Assert.Equal("Toyota", returnedVehicle.Name);
        Assert.Equal("Camry", returnedVehicle.Model);
    }

    [Fact]
    public async Task GetVehicleById_ReturnsNotFound_WhenVehicleNotExists()
    {
        // Arrange
        using var scope = _factory.Services.CreateScope();
        var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
        db.Database.EnsureDeleted();
        db.Database.EnsureCreated();

        // Act
        var response = await _client.GetAsync("/api/Vehicles/999");

        // Assert
        Assert.Equal(HttpStatusCode.NotFound, response.StatusCode);
    }

    [Fact]
    public async Task CreateVehicle_ReturnsCreated_WithVehicle()
    {
        // Arrange
        using var scope = _factory.Services.CreateScope();
        var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
        db.Database.EnsureDeleted();
        db.Database.EnsureCreated();

        var vehicle = new Vehicle
        {
            Name = "Toyota",
            Model = "Camry",
            Year = 2020,
            RegNumber = "ABC-1234",
            Type = "Sedan",
            Color = "Blue"
        };

        // Act
        var response = await _client.PostAsJsonAsync("/api/Vehicles", vehicle);

        // Assert
        Assert.Equal(HttpStatusCode.Created, response.StatusCode);
        var createdVehicle = await response.Content.ReadFromJsonAsync<Vehicle>();
        Assert.NotNull(createdVehicle);
        Assert.True(createdVehicle.Id > 0);
        Assert.Equal("Toyota", createdVehicle.Name);
        Assert.Equal("Camry", createdVehicle.Model);
    }

    [Fact]
    public async Task UpdateVehicle_ReturnsNoContent_WhenVehicleExists()
    {
        // Arrange
        using var scope = _factory.Services.CreateScope();
        var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
        db.Database.EnsureDeleted();
        db.Database.EnsureCreated();

        var vehicle = new Vehicle
        {
            Name = "Toyota",
            Model = "Camry",
            Year = 2020,
            RegNumber = "ABC-1234",
            Type = "Sedan"
        };

        db.Vehicles.Add(vehicle);
        await db.SaveChangesAsync();

        var updatedVehicle = new Vehicle
        {
            Id = vehicle.Id,
            Name = "Toyota",
            Model = "Corolla",
            Year = 2021,
            RegNumber = "ABC-1234",
            Type = "Sedan"
        };

        // Act
        var response = await _client.PutAsJsonAsync($"/api/Vehicles/{vehicle.Id}", updatedVehicle);

        // Assert
        Assert.Equal(HttpStatusCode.NoContent, response.StatusCode);

        // Verify the vehicle was updated - refresh the context to see changes
        db.ChangeTracker.Clear();
        var vehicleInDb = await db.Vehicles.FindAsync(vehicle.Id);
        Assert.NotNull(vehicleInDb);
        Assert.Equal("Corolla", vehicleInDb.Model);
        Assert.Equal(2021, vehicleInDb.Year);
    }

    [Fact]
    public async Task UpdateVehicle_ReturnsBadRequest_WhenIdMismatch()
    {
        // Arrange
        using var scope = _factory.Services.CreateScope();
        var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
        db.Database.EnsureDeleted();
        db.Database.EnsureCreated();

        var vehicle = new Vehicle
        {
            Id = 1,
            Name = "Toyota",
            Model = "Camry",
            Year = 2020,
            RegNumber = "ABC-1234",
            Type = "Sedan"
        };

        var updatedVehicle = new Vehicle
        {
            Id = 2, // Different ID
            Name = "Toyota",
            Model = "Corolla",
            Year = 2021,
            RegNumber = "ABC-1234",
            Type = "Sedan"
        };

        // Act
        var response = await _client.PutAsJsonAsync("/api/Vehicles/1", updatedVehicle);

        // Assert
        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
    }

    [Fact]
    public async Task DeleteVehicle_ReturnsNoContent_WhenVehicleExists()
    {
        // Arrange
        using var scope = _factory.Services.CreateScope();
        var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
        db.Database.EnsureDeleted();
        db.Database.EnsureCreated();

        var vehicle = new Vehicle
        {
            Name = "Toyota",
            Model = "Camry",
            Year = 2020,
            RegNumber = "ABC-1234",
            Type = "Sedan"
        };

        db.Vehicles.Add(vehicle);
        await db.SaveChangesAsync();

        // Act
        var response = await _client.DeleteAsync($"/api/Vehicles/{vehicle.Id}");

        // Assert
        Assert.Equal(HttpStatusCode.NoContent, response.StatusCode);

        // Verify the vehicle was deleted - refresh the context to see changes
        db.ChangeTracker.Clear();
        var vehicleInDb = await db.Vehicles.FindAsync(vehicle.Id);
        Assert.Null(vehicleInDb);
    }

    [Fact]
    public async Task DeleteVehicle_ReturnsNotFound_WhenVehicleNotExists()
    {
        // Arrange
        using var scope = _factory.Services.CreateScope();
        var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
        db.Database.EnsureDeleted();
        db.Database.EnsureCreated();

        // Act
        var response = await _client.DeleteAsync("/api/Vehicles/999");

        // Assert
        Assert.Equal(HttpStatusCode.NotFound, response.StatusCode);
    }
}

