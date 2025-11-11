using Backend.Models;
using Backend.Settings;
using Microsoft.Extensions.Options;
using MongoDB.Driver;

namespace Backend.Services;

/// <summary>
/// Service for handling contact form submissions with MongoDB persistence
/// </summary>
public class ContactService
{
    private readonly IMongoCollection<ContactSubmission> _contactsCollection;
    private readonly IMongoClient _mongoClient;

    public ContactService(IMongoClient mongoClient, IOptions<MongoDbSettings> mongoDbSettings)
    {
        _mongoClient = mongoClient;
        var mongoDbSettings_Value = mongoDbSettings.Value;
        var mongoDatabase = mongoClient.GetDatabase(mongoDbSettings_Value.DatabaseName);
        
        _contactsCollection = mongoDatabase.GetCollection<ContactSubmission>("Contacts");
        
        // Create index on email for faster queries
        var emailIndexModel = new CreateIndexModel<ContactSubmission>(
            Builders<ContactSubmission>.IndexKeys.Ascending(c => c.Email));
        try
        {
            _contactsCollection.Indexes.CreateOne(emailIndexModel);
        }
        catch
        {
            // Index might already exist
        }

        // Create index on status for filtering
        var statusIndexModel = new CreateIndexModel<ContactSubmission>(
            Builders<ContactSubmission>.IndexKeys.Ascending(c => c.Status));
        try
        {
            _contactsCollection.Indexes.CreateOne(statusIndexModel);
        }
        catch
        {
            // Index might already exist
        }
    }

    /// <summary>
    /// Submit a new contact form
    /// </summary>
    public async Task<ContactSubmission> SubmitContactAsync(ContactSubmissionRequest request)
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
            Id = MongoDB.Bson.ObjectId.GenerateNewId().ToString(),
            Name = request.Name.Trim(),
            Email = request.Email.Trim().ToLower(),
            Phone = request.Phone.Trim(),
            Subject = request.Subject.Trim(),
            Message = request.Message.Trim(),
            ServiceType = request.ServiceType?.Trim().ToLower() ?? "general",
            SubmittedAt = DateTime.UtcNow,
            Status = "pending"
        };

        await _contactsCollection.InsertOneAsync(submission);
        
        return submission;
    }

    /// <summary>
    /// Get all submissions (with optional filtering and pagination)
    /// </summary>
    public async Task<List<ContactSubmission>> GetAllSubmissionsAsync(string? status = null, int page = 1, int pageSize = 10)
    {
        var filter = Builders<ContactSubmission>.Filter.Empty;

        if (!string.IsNullOrWhiteSpace(status))
        {
            filter = Builders<ContactSubmission>.Filter.Eq(s => s.Status, status.ToLower());
        }

        var submissions = await _contactsCollection
            .Find(filter)
            .SortByDescending(s => s.SubmittedAt)
            .Skip((page - 1) * pageSize)
            .Limit(pageSize)
            .ToListAsync();

        return submissions;
    }

    /// <summary>
    /// Get submission by ID
    /// </summary>
    public async Task<ContactSubmission?> GetSubmissionByIdAsync(string id)
    {
        var filter = Builders<ContactSubmission>.Filter.Eq(s => s.Id, id);
        return await _contactsCollection.Find(filter).FirstOrDefaultAsync();
    }

    /// <summary>
    /// Get submissions by email
    /// </summary>
    public async Task<List<ContactSubmission>> GetSubmissionsByEmailAsync(string email)
    {
        var filter = Builders<ContactSubmission>.Filter.Eq(s => s.Email, email.ToLower());
        return await _contactsCollection
            .Find(filter)
            .SortByDescending(s => s.SubmittedAt)
            .ToListAsync();
    }

    /// <summary>
    /// Get submissions by status
    /// </summary>
    public async Task<List<ContactSubmission>> GetSubmissionsByStatusAsync(string status)
    {
        var filter = Builders<ContactSubmission>.Filter.Eq(s => s.Status, status.ToLower());
        return await _contactsCollection
            .Find(filter)
            .SortByDescending(s => s.SubmittedAt)
            .ToListAsync();
    }

    /// <summary>
    /// Update submission status and notes
    /// </summary>
    public async Task<bool> UpdateSubmissionStatusAsync(string id, string status, string? adminNotes = null)
    {
        // Validate status
        var validStatuses = new[] { "pending", "read", "resolved" };
        if (!validStatuses.Contains(status.ToLower()))
            throw new ArgumentException("Invalid status");

        var filter = Builders<ContactSubmission>.Filter.Eq(s => s.Id, id);
        var update = Builders<ContactSubmission>.Update
            .Set(s => s.Status, status.ToLower())
            .Set(s => s.AdminNotes, adminNotes)
            .Set(s => s.UpdatedAt, DateTime.UtcNow);

        var result = await _contactsCollection.UpdateOneAsync(filter, update);
        return result.ModifiedCount > 0;
    }

    /// <summary>
    /// Delete submission
    /// </summary>
    public async Task<bool> DeleteSubmissionAsync(string id)
    {
        var filter = Builders<ContactSubmission>.Filter.Eq(s => s.Id, id);
        var result = await _contactsCollection.DeleteOneAsync(filter);
        return result.DeletedCount > 0;
    }

    /// <summary>
    /// Get total count of submissions
    /// </summary>
    public async Task<long> GetTotalCountAsync(string? status = null)
    {
        var filter = Builders<ContactSubmission>.Filter.Empty;
        
        if (!string.IsNullOrWhiteSpace(status))
        {
            filter = Builders<ContactSubmission>.Filter.Eq(s => s.Status, status.ToLower());
        }

        return await _contactsCollection.CountDocumentsAsync(filter);
    }

    /// <summary>
    /// Get submissions count by status
    /// </summary>
    public async Task<Dictionary<string, long>> GetCountByStatusAsync()
    {
        var counts = new Dictionary<string, long>();
        
        foreach (var status in new[] { "pending", "read", "resolved" })
        {
            var filter = Builders<ContactSubmission>.Filter.Eq(s => s.Status, status);
            counts[status] = await _contactsCollection.CountDocumentsAsync(filter);
        }

        return counts;
    }
}