using Microsoft.EntityFrameworkCore;
using be.Data;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

// Database
builder.Services.AddDbContext<AppDbContext>(options =>
{
    // Use InMemory database for testing
    if (builder.Environment.EnvironmentName == "Testing")
    {
        // Use a unique database name per test to avoid conflicts
        var dbName = builder.Configuration["TestDbName"] ?? "TestDb_" + Guid.NewGuid().ToString();
        options.UseInMemoryDatabase(dbName);
    }
    else
    {
        // Support SQL_CONNECTION_STRING environment variable (for Docker)
        var envConnectionString = Environment.GetEnvironmentVariable("SQL_CONNECTION_STRING");
        var connectionString = envConnectionString ?? builder.Configuration.GetConnectionString("DefaultConnection");
        
        if (string.IsNullOrEmpty(connectionString))
        {
            throw new Exception("SQL Server connection string is missing. Set SQL_CONNECTION_STRING environment variable or configure DefaultConnection in appsettings.json");
        }
        
        options.UseSqlServer(connectionString);
    }
});

// CORS for Angular dev server
builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
        policy.WithOrigins("http://localhost:4200")
              .AllowAnyHeader()
              .AllowAnyMethod());
});

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}


app.UseSwagger();
app.UseSwaggerUI();


app.UseHttpsRedirection();

app.UseCors();

app.UseAuthorization();

app.MapControllers();

app.Run();

// Make Program class accessible for integration tests
public partial class Program { }