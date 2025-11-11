using AuthService.Models.DTOs;
using AuthService.Services;
using AuthService.Helpers;
using AuthService.Models;
using BCrypt.Net;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using System.Security.Claims;
using System.IdentityModel.Tokens.Jwt;

namespace AuthService.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly IUserService _userService;
        private readonly IJwtHelper _jwt;
        private readonly IEmailService _emailService;

        public AuthController(IUserService userService, IJwtHelper jwt, IEmailService emailService)
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

            // Check if username already exists
            var existingUsername = await _userService.GetByUsernameAsync(dto.Username);
            if (existingUsername != null)
                return Conflict("Username already exists. Please try a different one.");

            var existingEmail = await _userService.GetByEmailAsync(dto.Email);
            if (existingEmail != null)
                return Conflict("Email already registered. Please try a different email or login instead.");


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
            var user = await _userService.GetByOtpAsync(dto.OtpCode);
            if (user == null) return NotFound("OTP or User not found.");

            if (user.IsVerified) return BadRequest("User already verified.");

            if (user.OtpExpiry == null || user.OtpExpiry < DateTime.UtcNow)
                return BadRequest("Otp has expired.");

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

        [HttpPost("forgot-password")]
        public async Task<IActionResult> ForgotPassword([FromBody] ForgotPasswordRequestDto dto)
        {
            var user = await _userService.GetByEmailAsync(dto.Email);
            if (user == null) return NotFound("Email not found.");

            var otp = new Random().Next(100000, 999999).ToString();

            user.OtpCode = otp;
            user.OtpExpiry = DateTime.UtcNow.AddMinutes(10);


            await _userService.UpdateAsync(user.Id!, user);

            await _emailService.SendOtpEmail(user.Email, otp);

            return Ok(new { message = "OTP sent to email for password reset." });
        }

        [HttpPost("reset-password")]
        public async Task<IActionResult> ResetPassword([FromBody] ResetPasswordDto dto)
        {
            var user = await _userService.GetByEmailAsync(dto.Email);
            if (user == null) return NotFound("User not found.");

            if (user.OtpCode != dto.OtpCode)
                return BadRequest("Invalid OTP code.");

            if (user.OtpExpiry == null || user.OtpExpiry < DateTime.UtcNow)
                return BadRequest("OTP has expired.");

            user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.NewPassword);
            user.OtpCode = null;
            user.OtpExpiry = null;

            await _userService.UpdateAsync(user.Id!, user);

            return Ok(new { message = "Password reset successfully." });
        }

        [HttpPost("resend-otp")]
        public async Task<IActionResult> ResendOtp([FromBody] ForgotPasswordRequestDto dto)
        {
            var user = await _userService.GetByEmailAsync(dto.Email);
            if (user == null) return NotFound("User not found.");

            var otp = new Random().Next(100000, 999999).ToString();
            user.OtpCode = otp;
            user.OtpExpiry = DateTime.UtcNow.AddMinutes(0.5);

            await _userService.UpdateAsync(user.Id!, user);
            await _emailService.SendOtpEmail(user.Email, otp);

            return Ok(new { message = "OTP resent successfully to your email." });
        }

        [HttpPost("verify-token")]
        public IActionResult VerifyToken([FromBody] TokenDto dto)
        {
            var principal = _jwt.ValidateToken(dto.Token);

            if (principal == null)
                return Unauthorized(new { message = "Invalid or expired token." });

            var userId = principal.FindFirst("userId")?.Value;
            var username = principal.FindFirst("username")?.Value;
            var role = principal.FindFirst(ClaimTypes.Role)?.Value;

            return Ok(new
            {
                message = "Token is valid.",
                userId,
                username,
                role
            });
        }
    }
}
