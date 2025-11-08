using Xunit;
using Moq;
using Backend.Controllers;
using Backend.Models;
using Backend.Services;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Backend.Tests
{
    public class ServicesControllerTests
    {
        [Fact]
        public async Task Get_ReturnsAllServices()
        {
            // Arrange
            var mockService = new Mock<IServiceService>();
            mockService.Setup(s => s.GetAllAsync()).ReturnsAsync(new List<ServiceItem>
            {
                new ServiceItem { Id = "1", Name = "Oil Change" },
                new ServiceItem { Id = "2", Name = "Brake Check" }
            });

            var controller = new ServicesController(mockService.Object);

            // Act
            var result = await controller.Get();

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result.Result);
            var services = Assert.IsType<List<ServiceItem>>(okResult.Value);
            Assert.Equal(2, services.Count);
        }
    }
}
