using System.Net.Http.Headers;
using System.Net.Http.Json;
using System.Text;
using System.Text.Json;
using Backend.Models;

namespace Backend.Services;

public class AuthService
{
    private readonly HttpClient _http;
    private readonly string _baseUrl;

    public AuthService(HttpClient http, IConfiguration config)
    {
        _http = http;
        // Prefer config value, fallback to provided URL
        _baseUrl = config["AuthService:BaseUrl"]?.TrimEnd('/') ?? "http://localhost:5003/api/Auth";
    }

    public async Task<AuthVerifyResult> VerifyTokenAsync(string token, CancellationToken ct = default)
    {
        if (string.IsNullOrWhiteSpace(token))
            return AuthVerifyResult.Failed("Missing token");

        // Auth service expects POST; GET returned 405. Use POST with bearer header.
        using var req = new HttpRequestMessage(HttpMethod.Post, _baseUrl + "/verify-token");
        req.Headers.Authorization = new AuthenticationHeaderValue("Bearer", token);
        // Also send token in the body with property name expected by TokenDto ("Token")
        req.Content = JsonContent.Create(new { Token = token });

        using var res = await _http.SendAsync(req, ct);
        if (!res.IsSuccessStatusCode)
        {
            return AuthVerifyResult.Failed($"Auth service returned {((int)res.StatusCode)}");
        }

        using var stream = await res.Content.ReadAsStreamAsync(ct);
        using var doc = await JsonDocument.ParseAsync(stream, cancellationToken: ct);
        var root = doc.RootElement;

        string? MapRole(JsonElement el)
        {
            if (el.ValueKind == JsonValueKind.String)
            {
                var s = el.GetString();
                if (string.IsNullOrWhiteSpace(s)) return null;
                s = s!.Trim();
                if (string.Equals(s, "2", StringComparison.OrdinalIgnoreCase) || s.Equals("Admin", StringComparison.OrdinalIgnoreCase)) return "Admin";
                if (string.Equals(s, "1", StringComparison.OrdinalIgnoreCase) || s.Equals("Worker", StringComparison.OrdinalIgnoreCase)) return "Worker";
                // Treat anything else as Customer (incl. "0" or "User")
                return "Customer";
            }
            if (el.ValueKind == JsonValueKind.Number && el.TryGetInt32(out var num))
            {
                return num switch { 2 => "Admin", 1 => "Worker", _ => "Customer" };
            }
            return null;
        }

        // Try multiple shapes: { role, userId, email } or { user: { role, id/email } }
        string? role = null;
        string? userId = null;
        string? email = null;

        if (root.TryGetProperty("role", out var roleEl))
            role = MapRole(roleEl);
        if (root.TryGetProperty("userId", out var uidEl) && uidEl.ValueKind == JsonValueKind.String)
            userId = uidEl.GetString();
        if (root.TryGetProperty("email", out var emailEl) && emailEl.ValueKind == JsonValueKind.String)
            email = emailEl.GetString();

        if (root.TryGetProperty("user", out var userEl) && userEl.ValueKind == JsonValueKind.Object)
        {
            if (string.IsNullOrWhiteSpace(role) && userEl.TryGetProperty("role", out var uRoleEl))
                role = MapRole(uRoleEl);
            if (string.IsNullOrWhiteSpace(userId) && userEl.TryGetProperty("id", out var uIdEl) && uIdEl.ValueKind == JsonValueKind.String)
                userId = uIdEl.GetString();
            if (string.IsNullOrWhiteSpace(email) && userEl.TryGetProperty("email", out var uEmailEl) && uEmailEl.ValueKind == JsonValueKind.String)
                email = uEmailEl.GetString();
        }

        // Consider success if at least role is present
        if (string.IsNullOrWhiteSpace(role))
            return AuthVerifyResult.Failed("Role missing in verify-token response");

        return AuthVerifyResult.Success(userId, email, role);
    }
}

