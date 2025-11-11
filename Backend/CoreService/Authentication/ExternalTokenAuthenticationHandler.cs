using System.Security.Claims;
using System.Text.Encodings.Web;
using Microsoft.AspNetCore.Authentication;
using Microsoft.Extensions.Options;
using Backend.Services;

namespace Backend.Authentication;

public class ExternalTokenAuthenticationHandler : AuthenticationHandler<AuthenticationSchemeOptions>
{
    private readonly AuthService _authService;

    public ExternalTokenAuthenticationHandler(
        IOptionsMonitor<AuthenticationSchemeOptions> options,
        ILoggerFactory logger,
        UrlEncoder encoder,
        AuthService authService) : base(options, logger, encoder)
    {
        _authService = authService;
    }

    protected override async Task<AuthenticateResult> HandleAuthenticateAsync()
    {
        // Try Authorization: Bearer <token>
        string? authHeader = Request.Headers["Authorization"].FirstOrDefault();
        string? token = null;
        if (!string.IsNullOrWhiteSpace(authHeader) && authHeader.StartsWith("Bearer ", StringComparison.OrdinalIgnoreCase))
        {
            token = authHeader.Substring("Bearer ".Length).Trim();
        }

        // Fallbacks: custom header 'token', then query string ?token=
        if (string.IsNullOrWhiteSpace(token))
        {
            token = Request.Headers["token"].FirstOrDefault();
        }
        if (string.IsNullOrWhiteSpace(token))
        {
            token = Request.Query["token"].FirstOrDefault();
        }

        if (string.IsNullOrWhiteSpace(token))
        {
            Logger.LogInformation("ExternalToken auth: missing token in Authorization header, 'token' header, and query");
            return AuthenticateResult.Fail("Missing token");
        }

        var result = await _authService.VerifyTokenAsync(token, Context.RequestAborted);
        if (!result.IsAuthenticated)
        {
            Logger.LogInformation("ExternalToken auth: verify failed - {Error}", result.Error ?? "Unknown");
            return AuthenticateResult.Fail(result.Error ?? "Unauthorized");
        }

        var claims = new List<Claim>();
        if (!string.IsNullOrWhiteSpace(result.UserId))
            claims.Add(new Claim(ClaimTypes.NameIdentifier, result.UserId!));
        if (!string.IsNullOrWhiteSpace(result.Email))
            claims.Add(new Claim(ClaimTypes.Email, result.Email!));
        if (!string.IsNullOrWhiteSpace(result.Role))
            claims.Add(new Claim(ClaimTypes.Role, result.Role!));

        var identity = new ClaimsIdentity(claims, Scheme.Name);
        var principal = new ClaimsPrincipal(identity);
        var ticket = new AuthenticationTicket(principal, Scheme.Name);

        return AuthenticateResult.Success(ticket);
    }
}
