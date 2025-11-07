using Backend.Models;
using Backend.Services;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers;

[ApiController]
[Route("api/navigation")]
public class NavigationController : ControllerBase
{
    private readonly NavigationService _navigationService;

    public NavigationController(NavigationService navigationService)
    {
        _navigationService = navigationService;
    }

    /// <summary>
    /// Get all navigation items (Admin only)
    /// </summary>
    [HttpGet("all")]
    public IActionResult GetAllNavigationItems()
    {
        try
        {
            var items = _navigationService.GetAllNavigationItems();
            return Ok(new NavItemsListResponse
            {
                Success = true,
                Message = "All navigation items retrieved successfully",
                Items = items
            });
        }
        catch (Exception ex)
        {
            return BadRequest(new NavItemsListResponse
            {
                Success = false,
                Message = $"Error: {ex.Message}"
            });
        }
    }

    /// <summary>
    /// Get navigation items by user role
    /// </summary>
    [HttpGet("by-role")]
    public IActionResult GetNavigationByRole([FromQuery] string? userRole)
    {
        try
        {
            var items = _navigationService.GetNavigationItemsByRole(userRole);
            return Ok(new NavItemsListResponse
            {
                Success = true,
                Message = "Navigation items retrieved successfully",
                Items = items
            });
        }
        catch (Exception ex)
        {
            return BadRequest(new NavItemsListResponse
            {
                Success = false,
                Message = $"Error: {ex.Message}"
            });
        }
    }

    /// <summary>
    /// Get navigation item by ID
    /// </summary>
    [HttpGet("{id}")]
    public IActionResult GetNavigationItemById(string id)
    {
        try
        {
            var item = _navigationService.GetNavigationItemById(id);
            if (item == null)
                return NotFound(new NavItemResponse
                {
                    Success = false,
                    Message = "Navigation item not found"
                });

            return Ok(new NavItemResponse
            {
                Success = true,
                Message = "Navigation item retrieved successfully",
                Data = item
            });
        }
        catch (Exception ex)
        {
            return BadRequest(new NavItemResponse
            {
                Success = false,
                Message = $"Error: {ex.Message}"
            });
        }
    }

    /// <summary>
    /// Create a new navigation item (Admin only)
    /// </summary>
    [HttpPost("create")]
    public IActionResult CreateNavigationItem([FromBody] NavItemRequest request)
    {
        try
        {
            if (string.IsNullOrEmpty(request.Label) || string.IsNullOrEmpty(request.Route))
                return BadRequest(new NavItemResponse
                {
                    Success = false,
                    Message = "Label and Route are required"
                });

            var item = _navigationService.CreateNavigationItem(request);
            return CreatedAtAction(nameof(GetNavigationItemById), new { id = item.Id }, new NavItemResponse
            {
                Success = true,
                Message = "Navigation item created successfully",
                Data = item
            });
        }
        catch (Exception ex)
        {
            return BadRequest(new NavItemResponse
            {
                Success = false,
                Message = $"Error: {ex.Message}"
            });
        }
    }

    /// <summary>
    /// Update a navigation item (Admin only)
    /// </summary>
    [HttpPut("update/{id}")]
    public IActionResult UpdateNavigationItem(string id, [FromBody] NavItemRequest request)
    {
        try
        {
            if (string.IsNullOrEmpty(request.Label) || string.IsNullOrEmpty(request.Route))
                return BadRequest(new NavItemResponse
                {
                    Success = false,
                    Message = "Label and Route are required"
                });

            var item = _navigationService.UpdateNavigationItem(id, request);
            if (item == null)
                return NotFound(new NavItemResponse
                {
                    Success = false,
                    Message = "Navigation item not found"
                });

            return Ok(new NavItemResponse
            {
                Success = true,
                Message = "Navigation item updated successfully",
                Data = item
            });
        }
        catch (Exception ex)
        {
            return BadRequest(new NavItemResponse
            {
                Success = false,
                Message = $"Error: {ex.Message}"
            });
        }
    }

    /// <summary>
    /// Delete a navigation item (Admin only)
    /// </summary>
    [HttpDelete("delete/{id}")]
    public IActionResult DeleteNavigationItem(string id)
    {
        try
        {
            var result = _navigationService.DeleteNavigationItem(id);
            if (!result)
                return NotFound(new NavItemResponse
                {
                    Success = false,
                    Message = "Navigation item not found"
                });

            return Ok(new NavItemResponse
            {
                Success = true,
                Message = "Navigation item deleted successfully"
            });
        }
        catch (Exception ex)
        {
            return BadRequest(new NavItemResponse
            {
                Success = false,
                Message = $"Error: {ex.Message}"
            });
        }
    }

    /// <summary>
    /// Toggle navigation item status (Active/Inactive)
    /// </summary>
    [HttpPatch("toggle-status/{id}")]
    public IActionResult ToggleNavigationStatus(string id)
    {
        try
        {
            var result = _navigationService.ToggleNavigationItemStatus(id);
            if (!result)
                return NotFound(new NavItemResponse
                {
                    Success = false,
                    Message = "Navigation item not found"
                });

            var item = _navigationService.GetNavigationItemById(id);
            return Ok(new NavItemResponse
            {
                Success = true,
                Message = $"Navigation item status changed to {(item?.IsActive == true ? "Active" : "Inactive")}",
                Data = item
            });
        }
        catch (Exception ex)
        {
            return BadRequest(new NavItemResponse
            {
                Success = false,
                Message = $"Error: {ex.Message}"
            });
        }
    }

    /// <summary>
    /// Add a sub-item to a navigation item
    /// </summary>
    [HttpPost("{parentId}/add-subitem")]
    public IActionResult AddSubItem(string parentId, [FromBody] NavItemRequest request)
    {
        try
        {
            if (string.IsNullOrEmpty(request.Label) || string.IsNullOrEmpty(request.Route))
                return BadRequest(new NavItemResponse
                {
                    Success = false,
                    Message = "Label and Route are required"
                });

            var item = _navigationService.AddSubItem(parentId, request);
            if (item == null)
                return NotFound(new NavItemResponse
                {
                    Success = false,
                    Message = "Parent navigation item not found"
                });

            return Ok(new NavItemResponse
            {
                Success = true,
                Message = "Sub-item added successfully",
                Data = item
            });
        }
        catch (Exception ex)
        {
            return BadRequest(new NavItemResponse
            {
                Success = false,
                Message = $"Error: {ex.Message}"
            });
        }
    }

    /// <summary>
    /// Remove a sub-item from a navigation item
    /// </summary>
    [HttpDelete("{parentId}/remove-subitem")]
    public IActionResult RemoveSubItem(string parentId, [FromQuery] string subItemLabel)
    {
        try
        {
            if (string.IsNullOrEmpty(subItemLabel))
                return BadRequest(new NavItemResponse
                {
                    Success = false,
                    Message = "subItemLabel is required"
                });

            var result = _navigationService.RemoveSubItem(parentId, subItemLabel);
            if (!result)
                return NotFound(new NavItemResponse
                {
                    Success = false,
                    Message = "Parent item or sub-item not found"
                });

            return Ok(new NavItemResponse
            {
                Success = true,
                Message = "Sub-item removed successfully"
            });
        }
        catch (Exception ex)
        {
            return BadRequest(new NavItemResponse
            {
                Success = false,
                Message = $"Error: {ex.Message}"
            });
        }
    }
}

