using System.Net;
using System.Net.Http.Json;  // 👈 Add this line
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc.Testing;
using Xunit;

namespace Backend.Tests.Integration
{
    [Trait("Category", "Integration")] // 👈 Add this line
    public class AdminApiTests : IClassFixture<WebApplicationFactory<Program>>
    {
        private readonly HttpClient _client;

        public AdminApiTests(WebApplicationFactory<Program> factory)
        {
            _client = factory.CreateClient();
        }

        [Fact]
        public async Task GetServices_Endpoint_ReturnsSuccess()
        {
            var response = await _client.GetAsync("/api/admin/services");
            Assert.True(response.IsSuccessStatusCode);
        }

        [Fact]
        public async Task PostService_Endpoint_CreatesNewService()
        {
            var newService = new
            {
                Name = "Brake Inspection",
                Description = "Inspect brake pads and discs",
                Price = 1500
            };

            var response = await _client.PostAsJsonAsync("/api/admin/services", newService);
            Assert.Equal(HttpStatusCode.Created, response.StatusCode);
        }
    }
}
