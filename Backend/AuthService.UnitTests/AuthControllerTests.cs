using System;
using System.Threading.Tasks;
using Xunit;
using Moq;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using AuthService.Controllers;
using AuthService.Models;
using AuthService.Models.DTOs;
using AuthService.Services;
using AuthService.Helpers;

namespace AuthService.UnitTests
{
    public class AuthControllerTests
    {
        private readonly Mock<IUserService> _mockUserService;
        private readonly Mock<IJwtHelper> _mockJwtHelper;
        private readonly Mock<IEmailService> _mockEmailService;
        private readonly AuthController _controller;

        public AuthControllerTests()
        {
            // Create mocks
            _mockUserService = new Mock<IUserService>();
            _mockJwtHelper = new Mock<IJwtHelper>();
            _mockEmailService = new Mock<IEmailService>();

            // Setup the controller with the mocks
            _controller = new AuthController(
                _mockUserService.Object, 
                _mockJwtHelper.Object, 
                _mockEmailService.Object
            );
        }

        // ---------- REGISTER ----------
        [Fact]
        public async Task Register_Should_Return_Ok_When_NewUser()
        {
            var dto = new RegisterDto
            {
                Username = "newuser",
                Password = "Pass@123",
                Email = "newuser@example.com",
                FirstName = "New",
                LastName = "User"
            };

            _mockUserService.Setup(x => x.GetByUsernameAsync(dto.Username)).ReturnsAsync((User?)null);
            _mockUserService.Setup(x => x.GetByEmailAsync(dto.Email)).ReturnsAsync((User?)null);
            _mockUserService.Setup(x => x.CreateAsync(It.IsAny<User>())).Returns(Task.CompletedTask);
            _mockEmailService.Setup(x => x.SendOtpEmail(dto.Email, It.IsAny<string>())).Returns(Task.CompletedTask);

            var result = await _controller.Register(dto);

            var ok = Assert.IsType<OkObjectResult>(result);
            Assert.Contains("OTP sent", ok.Value.ToString());
        }

        [Fact]
        public async Task Register_Should_Return_Conflict_When_UsernameExists()
        {
            var dto = new RegisterDto { Username = "exists", Password = "123", Email = "exists@mail.com" };

            _mockUserService.Setup(x => x.GetByUsernameAsync(dto.Username))
                            .ReturnsAsync(new User { Username = "exists" });

            var result = await _controller.Register(dto);
            Assert.IsType<ConflictObjectResult>(result);
        }

        // ---------- VERIFY OTP ----------
        [Fact]
        public async Task VerifyOtp_Should_Return_Ok_When_Valid()
        {
            var dto = new OtpVerificationDto { OtpCode = "123456" };
            var user = new User
            {
                Id = "1",
                OtpCode = "123456",
                OtpExpiry = DateTime.UtcNow.AddMinutes(2),
                IsVerified = false
            };

            _mockUserService.Setup(x => x.GetByOtpAsync(dto.OtpCode)).ReturnsAsync(user);
            _mockUserService.Setup(x => x.UpdateAsync(user.Id, It.IsAny<User>())).Returns(Task.CompletedTask);

            var result = await _controller.VerifyOtp(dto);

            var ok = Assert.IsType<OkObjectResult>(result);
            Assert.Contains("User verified", ok.Value.ToString());
        }

        [Fact]
        public async Task VerifyOtp_Should_Return_BadRequest_When_Expired()
        {
            var dto = new OtpVerificationDto { OtpCode = "999999" };
            var user = new User
            {
                Id = "1",
                OtpCode = "999999",
                OtpExpiry = DateTime.UtcNow.AddMinutes(-2),
                IsVerified = false
            };

            _mockUserService.Setup(x => x.GetByOtpAsync(dto.OtpCode)).ReturnsAsync(user);

            var result = await _controller.VerifyOtp(dto);
            Assert.IsType<BadRequestObjectResult>(result);
        }

        // ---------- LOGIN ----------
        [Fact]
        public async Task Login_Should_Return_Ok_When_Valid()
        {
            var dto = new LoginDto { Username = "john", Password = "Pass@123" };
            var user = new User
            {
                Id = "123",
                Username = "john",
                PasswordHash = BCrypt.Net.BCrypt.HashPassword("Pass@123"),
                Role = Role.Customer,
                IsVerified = true
            };

            _mockUserService.Setup(x => x.GetByUsernameAsync(dto.Username)).ReturnsAsync(user);
            _mockJwtHelper.Setup(x => x.GenerateToken(user)).Returns("fake-token");

            var result = await _controller.Login(dto);

            var ok = Assert.IsType<OkObjectResult>(result);
            var res = Assert.IsType<LoginResultDto>(ok.Value);
            Assert.Equal("fake-token", res.Token);
        }

        [Fact]
        public async Task Login_Should_Return_Unauthorized_When_InvalidPassword()
        {
            var dto = new LoginDto { Username = "john", Password = "wrong" };
            var user = new User
            {
                Id = "123",
                Username = "john",
                PasswordHash = BCrypt.Net.BCrypt.HashPassword("Pass@123"),
                Role = Role.Customer,
                IsVerified = true
            };

            _mockUserService.Setup(x => x.GetByUsernameAsync(dto.Username)).ReturnsAsync(user);

            var result = await _controller.Login(dto);
            Assert.IsType<UnauthorizedObjectResult>(result);
        }

        // ---------- FORGOT PASSWORD ----------
        [Fact]
        public async Task ForgotPassword_Should_SendOtp_When_EmailExists()
        {
            var dto = new ForgotPasswordRequestDto { Email = "user@mail.com" };
            var user = new User { Id = "1", Email = dto.Email };

            _mockUserService.Setup(x => x.GetByEmailAsync(dto.Email)).ReturnsAsync(user);
            _mockUserService.Setup(x => x.UpdateAsync(user.Id, It.IsAny<User>())).Returns(Task.CompletedTask);
            _mockEmailService.Setup(x => x.SendOtpEmail(dto.Email, It.IsAny<string>())).Returns(Task.CompletedTask);

            var result = await _controller.ForgotPassword(dto);

            var ok = Assert.IsType<OkObjectResult>(result);
            Assert.Contains("OTP sent", ok.Value.ToString());
        }

        [Fact]
        public async Task ForgotPassword_Should_Return_NotFound_When_EmailNotFound()
        {
            var dto = new ForgotPasswordRequestDto { Email = "missing@mail.com" };
            _mockUserService.Setup(x => x.GetByEmailAsync(dto.Email)).ReturnsAsync((User?)null);

            var result = await _controller.ForgotPassword(dto);
            Assert.IsType<NotFoundObjectResult>(result);
        }

        // ---------- RESET PASSWORD ----------
        [Fact]
        public async Task ResetPassword_Should_Return_Ok_When_ValidOtp()
        {
            var dto = new ResetPasswordDto
            {
                Email = "user@mail.com",
                OtpCode = "123456",
                NewPassword = "NewPass@123"
            };

            var user = new User
            {
                Id = "1",
                Email = dto.Email,
                OtpCode = "123456",
                OtpExpiry = DateTime.UtcNow.AddMinutes(5)
            };

            _mockUserService.Setup(x => x.GetByEmailAsync(dto.Email)).ReturnsAsync(user);
            _mockUserService.Setup(x => x.UpdateAsync(user.Id, It.IsAny<User>())).Returns(Task.CompletedTask);

            var result = await _controller.ResetPassword(dto);

            var ok = Assert.IsType<OkObjectResult>(result);
            Assert.Contains("Password reset", ok.Value.ToString());
        }

        // ---------- RESEND OTP ----------
        [Fact]
        public async Task ResendOtp_Should_Return_Ok_When_UserExists()
        {
            var dto = new ForgotPasswordRequestDto { Email = "resend@mail.com" };
            var user = new User { Id = "1", Email = dto.Email };

            _mockUserService.Setup(x => x.GetByEmailAsync(dto.Email)).ReturnsAsync(user);
            _mockUserService.Setup(x => x.UpdateAsync(user.Id, It.IsAny<User>())).Returns(Task.CompletedTask);
            _mockEmailService.Setup(x => x.SendOtpEmail(dto.Email, It.IsAny<string>())).Returns(Task.CompletedTask);

            var result = await _controller.ResendOtp(dto);

            var ok = Assert.IsType<OkObjectResult>(result);
            Assert.Contains("OTP resent", ok.Value.ToString());
        }

        // ---------- CLASSIFY ----------
        [Fact]
        public async Task Classify_Should_Return_Ok_When_UserVerified()
        {
            var dto = new ClassifyDto
            {
                Username = "verifiedUser",
                Address = "123 Street",
                PhoneNumber = "0771234567",
                CarModel = "BMW",
                CarLicensePlate = "ABC123"
            };

            var user = new User { Id = "1", Username = dto.Username, IsVerified = true };

            _mockUserService.Setup(x => x.GetByUsernameAsync(dto.Username)).ReturnsAsync(user);
            _mockUserService.Setup(x => x.UpdateAsync(user.Id, It.IsAny<User>())).Returns(Task.CompletedTask);

            var result = await _controller.Classify(dto);

            var ok = Assert.IsType<OkObjectResult>(result);
            Assert.Contains("updated successfully", ok.Value.ToString());
        }
    }
}

