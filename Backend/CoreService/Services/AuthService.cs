using System.Net.Http.Headers;
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
        _baseUrl = config["AuthService:BaseUrl"]?.TrimEnd('/') ?? "http://localhost:5143/api/Auth";
    }

    public async Task<AuthVerifyResult> VerifyTokenAsync(string token, CancellationToken ct = default)
    {
        if (string.IsNullOrWhiteSpace(token))
            return AuthVerifyResult.Failed("Missing token");

        using var req = new HttpRequestMessage(HttpMethod.Get, _baseUrl + "/verify-token");
        req.Headers.Authorization = new AuthenticationHeaderValue("Bearer", token);

        using var res = await _http.SendAsync(req, ct);
        if (!res.IsSuccessStatusCode)
        {
            return AuthVerifyResult.Failed($"Auth service returned {((int)res.StatusCode)}");
        }

        using var stream = await res.Content.ReadAsStreamAsync(ct);
        using var doc = await JsonDocument.ParseAsync(stream, cancellationToken: ct);
        var root = doc.RootElement;

        // Try to read common fields; tolerate missing ones
        string? role = root.TryGetProperty("role", out var roleEl) && roleEl.ValueKind == JsonValueKind.String
            ? roleEl.GetString()
            : null;
        string? userId = root.TryGetProperty("userId", out var uidEl) && uidEl.ValueKind == JsonValueKind.String
            ? uidEl.GetString()
            : null;
        string? email = root.TryGetProperty("email", out var emailEl) && emailEl.ValueKind == JsonValueKind.String
            ? emailEl.GetString()
            : null;

        // Consider success if at least role is present
        if (string.IsNullOrWhiteSpace(role))
            return AuthVerifyResult.Failed("Role missing in verify-token response");

        return AuthVerifyResult.Success(userId, email, role);
    }
}
