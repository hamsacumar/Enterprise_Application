using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using be.Data;

namespace be.Tests;

// For .NET 6+ top-level programs, we reference the assembly directly
public class CustomWebApplicationFactory : WebApplicationFactory<Program>
{
    private readonly string _testDbName = "TestDb_" + Guid.NewGuid().ToString();

    protected override void ConfigureWebHost(IWebHostBuilder builder)
    {
        builder.UseEnvironment("Testing");
        builder.ConfigureAppConfiguration((context, config) =>
        {
            config.AddInMemoryCollection(new Dictionary<string, string?>
            {
                { "TestDbName", _testDbName }
            });
        });
    }
}

