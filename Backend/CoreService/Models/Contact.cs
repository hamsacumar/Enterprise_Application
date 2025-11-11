using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace Backend.Models;

/// <summary>
/// Contact form submission model
/// </summary>
public class ContactSubmission
{
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string Id { get; set; } = ObjectId.GenerateNewId().ToString();
    public string Name { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Phone { get; set; } = string.Empty;
    public string Subject { get; set; } = string.Empty;
    public string Message { get; set; } = string.Empty;
    public string ServiceType { get; set; } = string.Empty; // "general", "booking", "complaint", "feedback", "corporate"
    public DateTime SubmittedAt { get; set; } = DateTime.UtcNow;
    public string Status { get; set; } = "pending"; // "pending", "read", "resolved"
    public string? AdminNotes { get; set; }
    public DateTime? UpdatedAt { get; set; }
}

/// <summary>
/// Request model for contact form submission
/// </summary>
public class ContactSubmissionRequest
{
    public string Name { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Phone { get; set; } = string.Empty;
    public string Subject { get; set; } = string.Empty;
    public string Message { get; set; } = string.Empty;
    public string ServiceType { get; set; } = string.Empty;
}

/// <summary>
/// Response model for contact operations
/// </summary>
public class ContactResponse
{
    public bool Success { get; set; }
    public string Message { get; set; } = string.Empty;
    public object? Data { get; set; }
}

/// <summary>
/// Response model for paginated submissions
/// </summary>
public class PaginatedContactResponse
{
    public bool Success { get; set; }
    public string Message { get; set; } = string.Empty;
    public List<ContactSubmission> Data { get; set; } = new();
    public int Total { get; set; }
    public int Page { get; set; }
    public int PageSize { get; set; }
}

/// <summary>
/// Request model to update submission status
/// </summary>
public class UpdateStatusRequest
{
    public string Status { get; set; } = string.Empty; // "pending", "read", "resolved"
    public string? AdminNotes { get; set; }
}
