using Microsoft.EntityFrameworkCore;
using be.Data;

var builder = WebApplication.CreateBuilder(args);

// =========================
// Configure Services
// =========================

// Database
builder.Services.AddDbContext<AppDbContext>(options =>
{
    if (builder.Environment.EnvironmentName == "Testing")
    {
        // Use InMemory database for tests with a unique name
        var dbName = builder.Configuration["TestDbName"] ?? "TestDb_" + Guid.NewGuid();
        options.UseInMemoryDatabase(dbName);
    }
    else
    {
        // Get connection string from environment variable or appsettings.json
        var envConnectionString = Environment.GetEnvironmentVariable("SQL_CONNECTION_STRING");
        var connectionString = envConnectionString ?? builder.Configuration.GetConnectionString("DefaultConnection");

        if (string.IsNullOrWhiteSpace(connectionString))
        {
            throw new Exception("SQL Server connection string is missing. Set SQL_CONNECTION_STRING or DefaultConnection in appsettings.json");
        }

        // Use SQL Server with retry on transient failures
        options.UseSqlServer(connectionString, sqlOptions =>
        {
            sqlOptions.EnableRetryOnFailure(
                maxRetryCount: 5,
                maxRetryDelay: TimeSpan.FromSeconds(10),
                errorNumbersToAdd: null);
        });
    }
});

// CORS - allow Angular frontend
builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
        policy.WithOrigins("http://localhost:4200")
              .AllowAnyHeader()
              .AllowAnyMethod());
});

// Controllers & JSON options
builder.Services.AddControllers()
    .AddJsonOptions(opts =>
    {
        opts.JsonSerializerOptions.ReferenceHandler = System.Text.Json.Serialization.ReferenceHandler.Preserve;
        opts.JsonSerializerOptions.WriteIndented = true;
    });

// Swagger/OpenAPI
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// =========================
// Configure Middleware
// =========================
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseCors();

app.UseAuthorization();

app.MapControllers();

app.Run();


