using Backend.Models;
using Backend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers;

/// <summary>
/// Controller for handling contact form submissions
/// </summary>
[ApiController]
[Route("api/contact")]
public class ContactController : ControllerBase
{
    private readonly ContactService _contactService;
    private readonly ILogger<ContactController> _logger;

    public ContactController(ContactService contactService, ILogger<ContactController> logger)
    {
        _contactService = contactService;
        _logger = logger;
    }

    /// <summary>
    /// Submit a new contact form
    /// POST: /api/contact/submit
    /// </summary>
    [HttpPost("submit")]
    [AllowAnonymous]
    public async Task<IActionResult> SubmitContact([FromBody] ContactSubmissionRequest request)
    {
        try
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(new ContactResponse
                {
                    Success = false,
                    Message = "Invalid input data",
                    Data = ModelState.Values.SelectMany(v => v.Errors)
                });
            }

            var submission = await _contactService.SubmitContactAsync(request);
            
            _logger.LogInformation($"New contact submission from {request.Email} about '{request.Subject}'");

            return Ok(new ContactResponse
            {
                Success = true,
                Message = "Your message has been sent successfully! We will get back to you within 24 hours.",
                Data = submission
            });
        }
        catch (ArgumentException ex)
        {
            _logger.LogWarning($"Validation error in contact submission: {ex.Message}");
            return BadRequest(new ContactResponse
            {
                Success = false,
                Message = ex.Message
            });
        }
        catch (Exception ex)
        {
            _logger.LogError($"Error submitting contact form: {ex.Message}");
            return StatusCode(500, new ContactResponse
            {
                Success = false,
                Message = "An error occurred while processing your request. Please try again later."
            });
        }
    }

    /// <summary>
    /// Get all contact submissions (Admin only)
    /// GET: /api/contact/submissions?status=pending&page=1&pageSize=10
    /// </summary>
    [HttpGet("submissions")]
    [Authorize]
    public async Task<IActionResult> GetSubmissions([FromQuery] string? status, [FromQuery] int page = 1, [FromQuery] int pageSize = 10)
    {
        try
        {
            if (page < 1) page = 1;
            if (pageSize < 1 || pageSize > 100) pageSize = 10;

            var submissions = await _contactService.GetAllSubmissionsAsync(status, page, pageSize);
            var total = await _contactService.GetTotalCountAsync(status);

            _logger.LogInformation($"Retrieved {submissions.Count} contact submissions");

            return Ok(new PaginatedContactResponse
            {
                Success = true,
                Message = "Contact submissions retrieved successfully",
                Data = submissions,
                Total = (int)total,
                Page = page,
                PageSize = pageSize
            });
        }
        catch (Exception ex)
        {
            _logger.LogError($"Error retrieving contact submissions: {ex.Message}");
            return StatusCode(500, new ContactResponse
            {
                Success = false,
                Message = "An error occurred while retrieving submissions."
            });
        }
    }

    /// <summary>
    /// Get submission by ID
    /// GET: /api/contact/submissions/{id}
    /// </summary>
    [HttpGet("submissions/{id}")]
    [Authorize]
    public async Task<IActionResult> GetSubmissionById(string id)
    {
        try
        {
            if (string.IsNullOrWhiteSpace(id))
            {
                return BadRequest(new ContactResponse
                {
                    Success = false,
                    Message = "Submission ID is required"
                });
            }

            var submission = await _contactService.GetSubmissionByIdAsync(id);
            if (submission == null)
            {
                return NotFound(new ContactResponse
                {
                    Success = false,
                    Message = "Submission not found"
                });
            }

            return Ok(new ContactResponse
            {
                Success = true,
                Message = "Submission retrieved successfully",
                Data = submission
            });
        }
        catch (Exception ex)
        {
            _logger.LogError($"Error retrieving submission: {ex.Message}");
            return StatusCode(500, new ContactResponse
            {
                Success = false,
                Message = "An error occurred while retrieving the submission."
            });
        }
    }

    /// <summary>
    /// Get submissions by email
    /// GET: /api/contact/submissions/email/{email}
    /// </summary>
    [HttpGet("submissions/email/{email}")]
    [Authorize]
    public async Task<IActionResult> GetSubmissionsByEmail(string email)
    {
        try
        {
            if (string.IsNullOrWhiteSpace(email))
            {
                return BadRequest(new ContactResponse
                {
                    Success = false,
                    Message = "Email is required"
                });
            }

            var submissions = await _contactService.GetSubmissionsByEmailAsync(email);

            return Ok(new ContactResponse
            {
                Success = true,
                Message = $"Found {submissions.Count} submissions for {email}",
                Data = submissions
            });
        }
        catch (Exception ex)
        {
            _logger.LogError($"Error retrieving submissions by email: {ex.Message}");
            return StatusCode(500, new ContactResponse
            {
                Success = false,
                Message = "An error occurred while retrieving submissions."
            });
        }
    }

    /// <summary>
    /// Update submission status and notes
    /// PUT: /api/contact/submissions/{id}/status
    /// </summary>
    [HttpPut("submissions/{id}/status")]
    [Authorize]
    public async Task<IActionResult> UpdateSubmissionStatus(string id, [FromBody] UpdateStatusRequest request)
    {
        try
        {
            if (string.IsNullOrWhiteSpace(id))
            {
                return BadRequest(new ContactResponse
                {
                    Success = false,
                    Message = "Submission ID is required"
                });
            }

            if (string.IsNullOrWhiteSpace(request.Status))
            {
                return BadRequest(new ContactResponse
                {
                    Success = false,
                    Message = "Status is required"
                });
            }

            var success = await _contactService.UpdateSubmissionStatusAsync(id, request.Status, request.AdminNotes);
            
            if (!success)
            {
                return NotFound(new ContactResponse
                {
                    Success = false,
                    Message = "Submission not found"
                });
            }

            _logger.LogInformation($"Updated submission {id} status to {request.Status}");

            return Ok(new ContactResponse
            {
                Success = true,
                Message = "Submission status updated successfully",
                Data = await _contactService.GetSubmissionByIdAsync(id)
            });
        }
        catch (ArgumentException ex)
        {
            return BadRequest(new ContactResponse
            {
                Success = false,
                Message = ex.Message
            });
        }
        catch (Exception ex)
        {
            _logger.LogError($"Error updating submission status: {ex.Message}");
            return StatusCode(500, new ContactResponse
            {
                Success = false,
                Message = "An error occurred while updating the submission."
            });
        }
    }

    /// <summary>
    /// Delete submission
    /// DELETE: /api/contact/submissions/{id}
    /// </summary>
    [HttpDelete("submissions/{id}")]
    [Authorize]
    public async Task<IActionResult> DeleteSubmission(string id)
    {
        try
        {
            if (string.IsNullOrWhiteSpace(id))
            {
                return BadRequest(new ContactResponse
                {
                    Success = false,
                    Message = "Submission ID is required"
                });
            }

            var success = await _contactService.DeleteSubmissionAsync(id);
            
            if (!success)
            {
                return NotFound(new ContactResponse
                {
                    Success = false,
                    Message = "Submission not found"
                });
            }

            _logger.LogInformation($"Deleted submission {id}");

            return Ok(new ContactResponse
            {
                Success = true,
                Message = "Submission deleted successfully"
            });
        }
        catch (Exception ex)
        {
            _logger.LogError($"Error deleting submission: {ex.Message}");
            return StatusCode(500, new ContactResponse
            {
                Success = false,
                Message = "An error occurred while deleting the submission."
            });
        }
    }

    /// <summary>
    /// Get statistics about submissions
    /// GET: /api/contact/statistics
    /// </summary>
    [HttpGet("statistics")]
    [Authorize]
    public async Task<IActionResult> GetStatistics()
    {
        try
        {
            var countByStatus = await _contactService.GetCountByStatusAsync();
            var total = await _contactService.GetTotalCountAsync();

            return Ok(new ContactResponse
            {
                Success = true,
                Message = "Statistics retrieved successfully",
                Data = new
                {
                    total,
                    countByStatus,
                    pending = countByStatus["pending"],
                    read = countByStatus["read"],
                    resolved = countByStatus["resolved"]
                }
            });
        }
        catch (Exception ex)
        {
            _logger.LogError($"Error retrieving statistics: {ex.Message}");
            return StatusCode(500, new ContactResponse
            {
                Success = false,
                Message = "An error occurred while retrieving statistics."
            });
        }
    }
}