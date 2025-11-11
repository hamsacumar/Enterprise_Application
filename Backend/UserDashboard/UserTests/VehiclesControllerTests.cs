using be.Controllers;
using be.Data;
using be.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace be.Tests;

[Trait("Category", "Unit")]
public class VehiclesControllerTests
{
    private AppDbContext GetInMemoryDbContext()
    {
        var options = new DbContextOptionsBuilder<AppDbContext>()
            .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
            .Options;
        return new AppDbContext(options);
    }

    [Fact]
    public async Task Get_ReturnsAllVehicles()
    {
        // Arrange
        var db = GetInMemoryDbContext();
        var controller = new VehiclesController(db);

        var vehicle1 = new Vehicle
        {
            Id = 1,
            Name = "Toyota",
            Model = "Camry",
            Year = 2020,
            RegNumber = "ABC-1234",
            Type = "Sedan"
        };

        var vehicle2 = new Vehicle
        {
            Id = 2,
            Name = "Honda",
            Model = "Civic",
            Year = 2021,
            RegNumber = "XYZ-5678",
            Type = "Sedan"
        };

        db.Vehicles.AddRange(vehicle1, vehicle2);
        await db.SaveChangesAsync();

        // Act
        var result = await controller.Get();

        // Assert
        var actionResult = Assert.IsType<ActionResult<IEnumerable<Vehicle>>>(result);
        // When returning a value directly, it's stored in Value, not Result
        var vehicles = Assert.IsAssignableFrom<List<Vehicle>>(actionResult.Value);
        
        Assert.Equal(2, vehicles.Count);
    }

    [Fact]
    public async Task Get_WithId_ReturnsVehicle_WhenExists()
    {
        // Arrange
        var db = GetInMemoryDbContext();
        var controller = new VehiclesController(db);

        var vehicle = new Vehicle
        {
            Id = 1,
            Name = "Toyota",
            Model = "Camry",
            Year = 2020,
            RegNumber = "ABC-1234",
            Type = "Sedan"
        };

        db.Vehicles.Add(vehicle);
        await db.SaveChangesAsync();

        // Act
        var result = await controller.Get(1);

        // Assert
        var actionResult = Assert.IsType<ActionResult<Vehicle>>(result);
        // When returning a value directly, it's stored in Value, not Result
        var returnedVehicle = Assert.IsType<Vehicle>(actionResult.Value);
        
        Assert.Equal(1, returnedVehicle.Id);
        Assert.Equal("Toyota", returnedVehicle.Name);
        Assert.Equal("Camry", returnedVehicle.Model);
    }

    [Fact]
    public async Task Get_WithId_ReturnsNotFound_WhenNotExists()
    {
        // Arrange
        var db = GetInMemoryDbContext();
        var controller = new VehiclesController(db);

        // Act
        var result = await controller.Get(999);

        // Assert
        var actionResult = Assert.IsType<ActionResult<Vehicle>>(result);
        Assert.IsType<NotFoundResult>(actionResult.Result);
    }

    [Fact]
    public async Task Post_CreatesVehicle_AndReturnsCreatedResult()
    {
        // Arrange
        var db = GetInMemoryDbContext();
        var controller = new VehiclesController(db);

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
        var result = await controller.Post(vehicle);

        // Assert
        var actionResult = Assert.IsType<ActionResult<Vehicle>>(result);
        var createdResult = Assert.IsType<CreatedAtActionResult>(actionResult.Result);
        var createdVehicle = Assert.IsType<Vehicle>(createdResult.Value);
        
        Assert.Equal("Toyota", createdVehicle.Name);
        Assert.Equal("Camry", createdVehicle.Model);
        Assert.True(createdVehicle.Id > 0);
    }

    [Fact]
    public async Task Put_UpdatesVehicle_WhenIdMatches()
    {
        // Arrange
        var db = GetInMemoryDbContext();
        var controller = new VehiclesController(db);

        var vehicle = new Vehicle
        {
            Id = 1,
            Name = "Toyota",
            Model = "Camry",
            Year = 2020,
            RegNumber = "ABC-1234",
            Type = "Sedan"
        };

        db.Vehicles.Add(vehicle);
        await db.SaveChangesAsync();

        // Detach the entity to avoid tracking conflicts
        db.Entry(vehicle).State = EntityState.Detached;

        var updatedVehicle = new Vehicle
        {
            Id = 1,
            Name = "Toyota",
            Model = "Corolla",
            Year = 2021,
            RegNumber = "ABC-1234",
            Type = "Sedan"
        };

        // Act
        var result = await controller.Put(1, updatedVehicle);

        // Assert
        Assert.IsType<NoContentResult>(result);
        
        var vehicleInDb = await db.Vehicles.FindAsync(1);
        Assert.NotNull(vehicleInDb);
        Assert.Equal("Corolla", vehicleInDb.Model);
        Assert.Equal(2021, vehicleInDb.Year);
    }

    [Fact]
    public async Task Put_ReturnsBadRequest_WhenIdMismatch()
    {
        // Arrange
        var db = GetInMemoryDbContext();
        var controller = new VehiclesController(db);

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
        var result = await controller.Put(1, updatedVehicle);

        // Assert
        Assert.IsType<BadRequestResult>(result);
    }

    [Fact]
    public async Task Delete_RemovesVehicle_WhenExists()
    {
        // Arrange
        var db = GetInMemoryDbContext();
        var controller = new VehiclesController(db);

        var vehicle = new Vehicle
        {
            Id = 1,
            Name = "Toyota",
            Model = "Camry",
            Year = 2020,
            RegNumber = "ABC-1234",
            Type = "Sedan"
        };

        db.Vehicles.Add(vehicle);
        await db.SaveChangesAsync();

        // Act
        var result = await controller.Delete(1);

        // Assert
        Assert.IsType<NoContentResult>(result);
        
        var vehicleInDb = await db.Vehicles.FindAsync(1);
        Assert.Null(vehicleInDb);
    }

    [Fact]
    public async Task Delete_ReturnsNotFound_WhenNotExists()
    {
        // Arrange
        var db = GetInMemoryDbContext();
        var controller = new VehiclesController(db);

        // Act
        var result = await controller.Delete(999);

        // Assert
        Assert.IsType<NotFoundResult>(result);
    }
}

