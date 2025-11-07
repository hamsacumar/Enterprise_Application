using Backend.Models;

namespace Backend.Services;

/// <summary>
/// Service for handling contact form submissions
/// </summary>
public class ContactService
{
    private readonly List<ContactSubmission> _submissions = new();

    /// <summary>
    /// Submit a new contact form
    /// </summary>
    public ContactSubmission SubmitContact(ContactSubmissionRequest request)
    {
        // Validate input
        if (string.IsNullOrWhiteSpace(request.Name))
            throw new ArgumentException("Name is required");
        if (string.IsNullOrWhiteSpace(request.Email))
            throw new ArgumentException("Email is required");
        if (string.IsNullOrWhiteSpace(request.Phone))
            throw new ArgumentException("Phone is required");
        if (string.IsNullOrWhiteSpace(request.Subject))
            throw new ArgumentException("Subject is required");
        if (string.IsNullOrWhiteSpace(request.Message))
            throw new ArgumentException("Message is required");

        var submission = new ContactSubmission
        {
            Id = Guid.NewGuid().ToString(),
            Name = request.Name.Trim(),
            Email = request.Email.Trim().ToLower(),
            Phone = request.Phone.Trim(),
            Subject = request.Subject.Trim(),
            Message = request.Message.Trim(),
            ServiceType = request.ServiceType?.Trim().ToLower() ?? "general",
            SubmittedAt = DateTime.UtcNow,
            Status = "pending"
        };

        _submissions.Add(submission);
        
        // TODO: Send email notification to admin
        // TODO: Save to MongoDB

        return submission;
    }

    /// <summary>
    /// Get all submissions (with optional filtering)
    /// </summary>
    public List<ContactSubmission> GetAllSubmissions(string? status = null, int page = 1, int pageSize = 10)
    {
        var query = _submissions.AsEnumerable();

        if (!string.IsNullOrWhiteSpace(status))
        {
            query = query.Where(s => s.Status.Equals(status, StringComparison.OrdinalIgnoreCase));
        }

        return query
            .OrderByDescending(s => s.SubmittedAt)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToList();
    }

    /// <summary>
    /// Get submission by ID
    /// </summary>
    public ContactSubmission? GetSubmissionById(string id)
    {
        return _submissions.FirstOrDefault(s => s.Id == id);
    }

    /// <summary>
    /// Get submissions by email
    /// </summary>
    public List<ContactSubmission> GetSubmissionsByEmail(string email)
    {
        return _submissions
            .Where(s => s.Email.Equals(email, StringComparison.OrdinalIgnoreCase))
            .OrderByDescending(s => s.SubmittedAt)
            .ToList();
    }

    /// <summary>
    /// Get submissions by status
    /// </summary>
    public List<ContactSubmission> GetSubmissionsByStatus(string status)
    {
        return _submissions
            .Where(s => s.Status.Equals(status, StringComparison.OrdinalIgnoreCase))
            .OrderByDescending(s => s.SubmittedAt)
            .ToList();
    }

    /// <summary>
    /// Update submission status and notes
    /// </summary>
    public bool UpdateSubmissionStatus(string id, string status, string? adminNotes = null)
    {
        var submission = _submissions.FirstOrDefault(s => s.Id == id);
        if (submission == null)
            return false;

        // Validate status
        var validStatuses = new[] { "pending", "read", "resolved" };
        if (!validStatuses.Contains(status.ToLower()))
            throw new ArgumentException("Invalid status");

        submission.Status = status.ToLower();
        submission.AdminNotes = adminNotes;
        submission.UpdatedAt = DateTime.UtcNow;

        // TODO: Update in MongoDB

        return true;
    }

    /// <summary>
    /// Delete submission
    /// </summary>
    public bool DeleteSubmission(string id)
    {
        var submission = _submissions.FirstOrDefault(s => s.Id == id);
        if (submission == null)
            return false;

        _submissions.Remove(submission);
        
        // TODO: Delete from MongoDB

        return true;
    }

    /// <summary>
    /// Get total count of submissions
    /// </summary>
    public int GetTotalCount(string? status = null)
    {
        if (string.IsNullOrWhiteSpace(status))
            return _submissions.Count;

        return _submissions.Count(s => s.Status.Equals(status, StringComparison.OrdinalIgnoreCase));
    }

    /// <summary>
    /// Get submissions count by status
    /// </summary>
    public Dictionary<string, int> GetCountByStatus()
    {
        return new Dictionary<string, int>
        {
            { "pending", _submissions.Count(s => s.Status == "pending") },
            { "read", _submissions.Count(s => s.Status == "read") },
            { "resolved", _submissions.Count(s => s.Status == "resolved") }
        };
    }
}

