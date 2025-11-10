using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers;

[ApiController]
[Route("api/auth")]
public class AuthController : ControllerBase
{
    [HttpGet("me")]
    [Authorize]
    public IActionResult Me()
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier) ?? string.Empty;
        var email = User.FindFirstValue(ClaimTypes.Email) ?? string.Empty;
        var role = User.FindFirstValue(ClaimTypes.Role) ?? string.Empty;
        if (string.IsNullOrWhiteSpace(role))
        {
            return Unauthorized(new { success = false, message = "Role not found" });
        }

        return Ok(new
        {
            success = true,
            user = new
            {
                id = userId,
                name = string.IsNullOrWhiteSpace(email) ? "User" : email,
                email,
                role
            }
        });
    }
}
