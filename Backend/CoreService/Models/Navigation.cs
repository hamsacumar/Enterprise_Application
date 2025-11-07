namespace Backend.Models;

public class NavMenuItem
{
    public string Id { get; set; } = Guid.NewGuid().ToString();
    public string Label { get; set; } = string.Empty;
    public string Route { get; set; } = string.Empty;
    public string Icon { get; set; } = string.Empty;
    public int Order { get; set; }
    public bool IsActive { get; set; } = true;
    public string? Role { get; set; } // null = everyone, "Admin" = only admins, etc.
    public List<NavMenuItem> SubItems { get; set; } = new();
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
}

public class NavItemRequest
{
    public string Label { get; set; } = string.Empty;
    public string Route { get; set; } = string.Empty;
    public string Icon { get; set; } = string.Empty;
    public int Order { get; set; }
    public string? Role { get; set; }
    public List<NavMenuItem> SubItems { get; set; } = new();
}

public class NavItemResponse
{
    public bool Success { get; set; }
    public string Message { get; set; } = string.Empty;
    public NavMenuItem? Data { get; set; }
}

public class NavItemsListResponse
{
    public bool Success { get; set; }
    public string Message { get; set; } = string.Empty;
    public List<NavMenuItem> Items { get; set; } = new();
}

