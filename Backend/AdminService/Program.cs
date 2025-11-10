using Backend.Services;              // Existing + new services
using Backend.Settings;              // MongoDbSettings
using Microsoft.OpenApi.Models;
using MongoDB.Driver;

var builder = WebApplication.CreateBuilder(args);

// ----------------------
// MongoDB Configuration
// ----------------------
builder.Services.Configure<MongoDbSettings>(builder.Configuration.GetSection("MongoDbSettings"));

// Support MONGO_URI environment variable (for Docker)
var envMongo = Environment.GetEnvironmentVariable("MONGO_URI");
var cfg = builder.Configuration.GetSection("MongoDbSettings").Get<MongoDbSettings>();
var connectionString = envMongo ?? cfg?.ConnectionString ?? throw new Exception("Mongo connection string missing");
var databaseName = cfg?.DatabaseName ?? "Enterprise";
var authServiceUrl = builder.Configuration["AuthServiceUrl"];
builder.Services.AddSingleton(new AuthServiceClientConfig(authServiceUrl));
builder.Services.AddHttpClient();

// Register Mongo client (used globally)
builder.Services.AddSingleton<IMongoClient>(_ => new MongoClient(connectionString));
builder.Services.Configure<MongoDbSettings>(opt =>
{
    opt.ConnectionString = connectionString;
    opt.DatabaseName = databaseName;
});

// ----------------------
// Dependency Injection
// ----------------------
builder.Services.AddScoped<IServiceService, ServiceService>(); // ✅ for managing Services (CRUD)
builder.Services.AddSingleton<IWorkerService, WorkerService>();
builder.Services.AddHttpClient<ICustomerService, CustomerService>();

// ----------------------
// Controllers + Swagger
// ----------------------
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo { Title = "Admin Service API", Version = "v1" });
});

// ----------------------
// CORS Configuration
// ----------------------
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAngular", policy =>
    {
        policy.WithOrigins("http://localhost:4200", "http://127.0.0.1:4200")
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials();
    });
});

var app = builder.Build();

// ----------------------
// Middleware
// ----------------------
app.UseCors("AllowAngular");

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(c =>
    {
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "Admin Service API v1");
    });
}

app.UseHttpsRedirection();

app.MapControllers();

// ----------------------
// Root route (test)
// ----------------------
app.MapGet("/", () => Results.Ok(new { message = "🚀 Admin API running successfully!" }));

app.Run();

// 👇 ADD THIS LINE for integration tests
public partial class Program { }
