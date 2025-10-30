using Backend.Services; // or your actual namespace
using Backend.Settings; // for MongoDbSettings
using Microsoft.OpenApi.Models;
using MongoDB.Driver;

var builder = WebApplication.CreateBuilder(args);

// Register MongoDB settings
builder.Services.Configure<MongoDbSettings>(
    builder.Configuration.GetSection("MongoDbSettings"));

// Register MongoDB client
builder.Services.AddSingleton<IMongoClient>(sp =>
{
    var settings = builder.Configuration.GetSection("MongoDbSettings").Get<MongoDbSettings>();
    if (settings == null || string.IsNullOrEmpty(settings.ConnectionString))
    {
        throw new Exception("MongoDB settings are missing or invalid in appsettings.json");
    }
    return new MongoClient(settings.ConnectionString);
});

// Register services
builder.Services.AddScoped<ITestService, TestService>();
builder.Services.AddScoped<AdminService.Services.IAdminService, AdminService.Services.AdminService>();

// Add controllers
builder.Services.AddControllers();

// Add Swagger/OpenAPI
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo { Title = "Admin Service API", Version = "v1" });
});

// ✅ Add CORS
// Enable CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAngular", policy =>
    {
        policy.WithOrigins("http://localhost:4200")
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});


var app = builder.Build();
app.UseCors("AllowAngular");

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(c =>
    {
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "Admin Service API v1");
    });
}

// Redirect HTTP to HTTPS
app.UseHttpsRedirection();

// ✅ Add this to show a message at root
app.MapGet("/", () => "🚀 Backend is running!");

// Map API controllers
app.MapControllers();

app.Run();