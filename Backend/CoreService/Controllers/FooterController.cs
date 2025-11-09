using Backend.Models;
using Backend.Services;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers;

[ApiController]
[Route("api/footer")]
public class FooterController : ControllerBase
{
    private readonly FooterService _footerService;

    public FooterController(FooterService footerService)
    {
        _footerService = footerService;
    }

    /// <summary>
    /// Get complete footer data (sections + company info)
    /// </summary>
    [HttpGet("all")]
    public IActionResult GetCompleteFooter()
    {
        try
        {
            var footer = _footerService.GetCompleteFooter();
            return Ok(footer);
        }
        catch (Exception ex)
        {
            return BadRequest(new FooterResponse
            {
                Success = false,
                Message = $"Error: {ex.Message}"
            });
        }
    }

    /// <summary>
    /// Get all footer sections
    /// </summary>
    [HttpGet("sections")]
    public IActionResult GetAllFooterSections()
    {
        try
        {
            var sections = _footerService.GetAllFooterSections();
            return Ok(new FooterResponse
            {
                Success = true,
                Message = "Footer sections retrieved successfully",
                Data = sections
            });
        }
        catch (Exception ex)
        {
            return BadRequest(new FooterResponse
            {
                Success = false,
                Message = $"Error: {ex.Message}"
            });
        }
    }

    /// <summary>
    /// Get footer section by ID
    /// </summary>
    [HttpGet("sections/{id}")]
    public IActionResult GetFooterSectionById(string id)
    {
        try
        {
            var section = _footerService.GetFooterSectionById(id);
            if (section == null)
                return NotFound(new FooterResponse
                {
                    Success = false,
                    Message = "Footer section not found"
                });

            return Ok(new FooterResponse
            {
                Success = true,
                Message = "Footer section retrieved successfully",
                Data = section
            });
        }
        catch (Exception ex)
        {
            return BadRequest(new FooterResponse
            {
                Success = false,
                Message = $"Error: {ex.Message}"
            });
        }
    }

    /// <summary>
    /// Create a new footer section (Admin only)
    /// </summary>
    [HttpPost("sections/create")]
    public IActionResult CreateFooterSection([FromBody] FooterRequest request)
    {
        try
        {
            if (string.IsNullOrEmpty(request.Title))
                return BadRequest(new FooterResponse
                {
                    Success = false,
                    Message = "Title is required"
                });

            var section = _footerService.CreateFooterSection(request);
            return CreatedAtAction(nameof(GetFooterSectionById), new { id = section.Id }, new FooterResponse
            {
                Success = true,
                Message = "Footer section created successfully",
                Data = section
            });
        }
        catch (Exception ex)
        {
            return BadRequest(new FooterResponse
            {
                Success = false,
                Message = $"Error: {ex.Message}"
            });
        }
    }

    /// <summary>
    /// Update a footer section (Admin only)
    /// </summary>
    [HttpPut("sections/update/{id}")]
    public IActionResult UpdateFooterSection(string id, [FromBody] FooterRequest request)
    {
        try
        {
            var section = _footerService.UpdateFooterSection(id, request);
            if (section == null)
                return NotFound(new FooterResponse
                {
                    Success = false,
                    Message = "Footer section not found"
                });

            return Ok(new FooterResponse
            {
                Success = true,
                Message = "Footer section updated successfully",
                Data = section
            });
        }
        catch (Exception ex)
        {
            return BadRequest(new FooterResponse
            {
                Success = false,
                Message = $"Error: {ex.Message}"
            });
        }
    }

    /// <summary>
    /// Delete a footer section (Admin only)
    /// </summary>
    [HttpDelete("sections/delete/{id}")]
    public IActionResult DeleteFooterSection(string id)
    {
        try
        {
            var result = _footerService.DeleteFooterSection(id);
            if (!result)
                return NotFound(new FooterResponse
                {
                    Success = false,
                    Message = "Footer section not found"
                });

            return Ok(new FooterResponse
            {
                Success = true,
                Message = "Footer section deleted successfully"
            });
        }
        catch (Exception ex)
        {
            return BadRequest(new FooterResponse
            {
                Success = false,
                Message = $"Error: {ex.Message}"
            });
        }
    }

    /// <summary>
    /// Add a link to a footer section
    /// </summary>
    [HttpPost("sections/{sectionId}/add-link")]
    public IActionResult AddLinkToSection(string sectionId, [FromBody] FooterLink link)
    {
        try
        {
            if (string.IsNullOrEmpty(link.Text) || string.IsNullOrEmpty(link.Url))
                return BadRequest(new FooterResponse
                {
                    Success = false,
                    Message = "Text and Url are required"
                });

            var section = _footerService.AddLinkToSection(sectionId, link);
            if (section == null)
                return NotFound(new FooterResponse
                {
                    Success = false,
                    Message = "Footer section not found"
                });

            return Ok(new FooterResponse
            {
                Success = true,
                Message = "Link added successfully",
                Data = section
            });
        }
        catch (Exception ex)
        {
            return BadRequest(new FooterResponse
            {
                Success = false,
                Message = $"Error: {ex.Message}"
            });
        }
    }

    /// <summary>
    /// Remove a link from a footer section
    /// </summary>
    [HttpDelete("sections/{sectionId}/remove-link/{linkId}")]
    public IActionResult RemoveLinkFromSection(string sectionId, string linkId)
    {
        try
        {
            var section = _footerService.RemoveLinkFromSection(sectionId, linkId);
            if (section == null)
                return NotFound(new FooterResponse
                {
                    Success = false,
                    Message = "Footer section or link not found"
                });

            return Ok(new FooterResponse
            {
                Success = true,
                Message = "Link removed successfully",
                Data = section
            });
        }
        catch (Exception ex)
        {
            return BadRequest(new FooterResponse
            {
                Success = false,
                Message = $"Error: {ex.Message}"
            });
        }
    }

    /// <summary>
    /// Get company information
    /// </summary>
    [HttpGet("company-info")]
    public IActionResult GetCompanyInfo()
    {
        try
        {
            var info = _footerService.GetFooterInfo();
            return Ok(new FooterResponse
            {
                Success = true,
                Message = "Company information retrieved successfully",
                Data = info
            });
        }
        catch (Exception ex)
        {
            return BadRequest(new FooterResponse
            {
                Success = false,
                Message = $"Error: {ex.Message}"
            });
        }
    }

    /// <summary>
    /// Update company information (Admin only)
    /// </summary>
    [HttpPut("company-info/update")]
    public IActionResult UpdateCompanyInfo([FromBody] FooterInfoRequest request)
    {
        try
        {
            var info = _footerService.UpdateFooterInfo(request);
            return Ok(new FooterResponse
            {
                Success = true,
                Message = "Company information updated successfully",
                Data = info
            });
        }
        catch (Exception ex)
        {
            return BadRequest(new FooterResponse
            {
                Success = false,
                Message = $"Error: {ex.Message}"
            });
        }
    }
}

