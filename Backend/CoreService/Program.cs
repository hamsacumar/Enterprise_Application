using Backend.Services;
using Backend.Settings;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using MongoDB.Driver;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container
builder.Services.AddControllers();
builder.Services.AddOpenApi();

// ===== MongoDB Configuration =====
builder.Services.Configure<MongoDbSettings>(builder.Configuration.GetSection("MongoDbSettings"));

// Support MONGO_URI environment variable (for Docker)
var envMongo = Environment.GetEnvironmentVariable("MONGO_URI");
var mongoSettings = builder.Configuration.GetSection("MongoDbSettings").Get<MongoDbSettings>();
var connectionString = envMongo ?? mongoSettings?.ConnectionString ?? throw new Exception("MongoDB connection string missing");
var databaseName = mongoSettings?.DatabaseName ?? "Enterprise";

// Register Mongo client (used globally)
builder.Services.AddSingleton<IMongoClient>(_ => new MongoClient(connectionString));
builder.Services.Configure<MongoDbSettings>(opt =>
{
    opt.ConnectionString = connectionString;
    opt.DatabaseName = databaseName;
});

// Add JWT Service
builder.Services.AddSingleton<JwtService>();

// Add Contact Service
builder.Services.AddScoped<ContactService>();

// Configure JWT Authentication
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = builder.Configuration["Jwt:Issuer"] ?? "AutoWashProBackend",
            ValidAudience = builder.Configuration["Jwt:Audience"] ?? "AutoWashProFrontend",
            IssuerSigningKey = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"] ?? "YourSecretKeyHere123456789012345678901234567890"))
        };
    });

// Configure CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAngular", policy =>
    {
        policy.SetIsOriginAllowed(origin => 
            origin.StartsWith("http://localhost") || 
            origin.StartsWith("https://localhost"))
              .AllowAnyMethod()
              .AllowAnyHeader()
              .AllowCredentials();
    });
});

var app = builder.Build();

// Configure the HTTP request pipeline
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseHttpsRedirection();

// Enable CORS
app.UseCors("AllowAngular");

// Enable Authentication & Authorization
app.UseAuthentication();
app.UseAuthorization();

// Map Controllers
app.MapControllers();

app.Run();
