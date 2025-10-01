using AuthService.Models.DTOs;
using AuthService.Services;
using AuthService.Helpers;
using AuthService.Models;
using BCrypt.Net;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;

namespace AuthService.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly UserService _userService;
        private readonly JwtHelper _jwt;
        private readonly EmailService _emailService;

        public AuthController(UserService userService, JwtHelper jwt, EmailService emailService)
        {
            _userService = userService;
            _jwt = jwt;
            _emailService = emailService;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterDto dto)
        {
            if (string.IsNullOrWhiteSpace(dto.Username) || string.IsNullOrWhiteSpace(dto.Password))
                return BadRequest("Username and password are required.");

            var existing = await _userService.GetByUsernameAsync(dto.Username);
            if (existing != null) return Conflict("Username already exists.");

            var hashed = BCrypt.Net.BCrypt.HashPassword(dto.Password);

            var otp = new Random().Next(100000, 999999).ToString();

            var user = new User
            {
                Username = dto.Username,
                FirstName = dto.FirstName,
                LastName = dto.LastName,
                Email = dto.Email,
                PasswordHash = hashed,
                Role = Role.Customer,
                OtpCode = otp,
                OtpExpiry = DateTime.UtcNow.AddMinutes(5),
                IsVerified = false,
            };

            await _userService.CreateAsync(user);

            await _emailService.SendOtpEmail(user.Email, otp);

            return Ok(new { message = "OTP sent to email. Please verify." });

           
        }

        [HttpPost("verify-otp")]
        public async Task<IActionResult> VerifyOtp([FromBody] OtpVerificationDto dto)
        {
            var user = await _userService.GetByUsernameAsync(dto.Username);
            if (user == null) return NotFound("User not found.");

            if (user.IsVerified) return BadRequest("User already verified.");

            if (user.OtpCode != dto.OtpCode || user.OtpExpiry < DateTime.UtcNow)
                return BadRequest("Invalid or expired OTP.");

            user.IsVerified = true;
            user.OtpCode = null;
            user.OtpExpiry = null;

            await _userService.UpdateAsync(user.Id!, user);

            return Ok(new { message = "User verified successfully.Proceed to Classify Details" });
        }

        [HttpPost("classify")]
        public async Task<IActionResult> Classify([FromBody] ClassifyDto dto)
        {
            var user = await _userService.GetByUsernameAsync(dto.Username);
            if (user == null) return NotFound("User not found.");

            if (!user.IsVerified) return BadRequest("User not verified.");

            user.Address = dto.Address;
            user.CarModel = dto.CarModel;
            user.CarLicensePlate = dto.CarLicensePlate;
            user.PhoneNumber = dto.PhoneNumber;

            await _userService.UpdateAsync(user.Id!, user);

            return Ok(new { message = "User details updated successfully. You can now log in." });
        }


        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginDto dto)
        {
            var user = await _userService.GetByUsernameAsync(dto.Username);
            if (user == null) return Unauthorized("Invalid username or password.");

            if (user.Role == Role.Customer && !user.IsVerified)
            return Unauthorized("Please verify your email before logging in.");

            var valid = BCrypt.Net.BCrypt.Verify(dto.Password, user.PasswordHash);
            if (!valid) return Unauthorized("Invalid username or password.");

            var token = _jwt.GenerateToken(user);

            return Ok(new LoginResultDto
            {
                UserId = user.Id!,
                Token = token,
                Role = user.Role.ToString()
            });


            
        }

        [HttpGet("me")]
        [Authorize]
        public async Task<IActionResult> Me()
        {
            var id = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value
            ?? User.FindFirst(System.IdentityModel.Tokens.Jwt.JwtRegisteredClaimNames.Sub)?.Value;
            if (id == null) return Unauthorized();

            var user = await _userService.GetByIdAsync(id);
            if (user == null) return NotFound();

            return Ok(new
            {
                user.Id,
                user.Username,
                user.FirstName,
                user.LastName,
                user.Email,
                role = user.Role,
            });
        }
    }
}
