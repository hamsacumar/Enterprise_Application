using System.Net;
using System.Net.Http.Json;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc.Testing;
using Xunit;
using AuthService;
using System;
using System.Collections.Generic;
using AuthService.Models;
using AuthService.Services;
using Microsoft.Extensions.DependencyInjection;

public class AuthEndpointsTests : IClassFixture<WebApplicationFactory<Program>>, IAsyncLifetime
{
    private readonly HttpClient _client;
    private readonly WebApplicationFactory<Program> _factory;
    private readonly TestData _testData;
    private string _testEmail;
    private string _testUsername;
    private string _testPassword;
    private string? _otpCode;

    private class TestData
    {
        public string Email { get; set; } = $"test_{Guid.NewGuid().ToString("N")}@example.com";
        public string Username { get; set; } = $"testuser_{Guid.NewGuid().ToString("N").Substring(0, 8)}";
        public string Password { get; set; } = "Test@1234";
    }

    public AuthEndpointsTests(WebApplicationFactory<Program> factory)
    {
        _factory = factory;
        _client = factory.CreateClient();
        _testData = new TestData();
        _testEmail = _testData.Email;
        _testUsername = _testData.Username;
        _testPassword = _testData.Password;
    }

    public async Task InitializeAsync()
    {
        // Register a test user
        var registerDto = new
        {
            Username = _testUsername,
            FirstName = "Test",
            LastName = "User",
            Email = _testEmail,
            Password = _testPassword,
            Role = "Customer"
        };

        var registerResponse = await _client.PostAsJsonAsync("/api/Auth/register", registerDto);
        registerResponse.EnsureSuccessStatusCode();

        // Get the OTP code from the database
        using var scope = _factory.Services.CreateScope();
        var userService = scope.ServiceProvider.GetRequiredService<IUserService>();
        var user = await userService.GetByEmailAsync(_testEmail);
        _otpCode = user?.OtpCode ?? throw new InvalidOperationException("OTP code not found after registration");
    }

    public Task DisposeAsync()
    {
        // Cleanup test data if needed
        _client.Dispose();
        return Task.CompletedTask;
    }

    [Fact]
    public async Task Register_Should_Return_Success()
    {
        var uniqueId = Guid.NewGuid().ToString("N").Substring(0, 8);
        var registerDto = new
        {
            Username = $"testuser_{uniqueId}",
            FirstName = "Test",
            LastName = "User",
            Email = $"test_{uniqueId}@example.com",
            Password = "Test@1234",
            Role = "Customer"
        };

        var response = await _client.PostAsJsonAsync("/api/Auth/register", registerDto);
        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        
        var content = await response.Content.ReadAsStringAsync();
        Assert.Contains("OTP sent to email", content);
    }

    [Fact]
    public async Task Login_Should_Return_Token_When_Valid()
    {
        // First, verify the user with the OTP from the database
        var verifyResponse = await _client.PostAsJsonAsync("/api/Auth/verify-otp", new
        {
            Email = _testEmail,
            OtpCode = _otpCode
        });
        
        // Then try to login
        var loginDto = new
        {
            Username = _testUsername,
            Password = _testPassword
        };

        var response = await _client.PostAsJsonAsync("/api/Auth/login", loginDto);
        
        // Assert
        var responseContent = await response.Content.ReadAsStringAsync();
        Assert.True(response.IsSuccessStatusCode, $"Login failed: {response.StatusCode} - {responseContent}");
        Assert.Contains("token", responseContent.ToLower());
    }

    [Fact]
    public async Task VerifyOtp_Should_Return_Success_When_Correct()
    {
        var otpDto = new
        {
            Email = _testEmail,
            OtpCode = _otpCode
        };

        var response = await _client.PostAsJsonAsync("/api/Auth/verify-otp", otpDto);
        
        // Assert
        var responseContent = await response.Content.ReadAsStringAsync();
        Assert.True(response.IsSuccessStatusCode, $"OTP verification failed: {response.StatusCode} - {responseContent}");
        Assert.Contains("User verified successfully", responseContent);
    }

    [Fact]
    public async Task ForgotPassword_Should_Return_Ok()
    {
        var forgotDto = new
        {
            Email = _testEmail
        };

        var response = await _client.PostAsJsonAsync("/api/Auth/forgot-password", forgotDto);
        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
    }
}
