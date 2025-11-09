namespace Backend.Models;

public class FooterSection
{
    public string Id { get; set; } = Guid.NewGuid().ToString();
    public string Title { get; set; } = string.Empty;
    public int Order { get; set; }
    public List<FooterLink> Links { get; set; } = new();
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
}

public class FooterLink
{
    public string Id { get; set; } = Guid.NewGuid().ToString();
    public string Text { get; set; } = string.Empty;
    public string Url { get; set; } = string.Empty;
    public string Icon { get; set; } = string.Empty;
    public bool IsExternal { get; set; } = false;
    public int Order { get; set; }
}

public class FooterInfo
{
    public string Id { get; set; } = Guid.NewGuid().ToString();
    public string CompanyName { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string Address { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Phone { get; set; } = string.Empty;
    public List<SocialMedia> SocialLinks { get; set; } = new();
    public string Copyright { get; set; } = string.Empty;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
}

public class SocialMedia
{
    public string Platform { get; set; } = string.Empty; // Facebook, Twitter, LinkedIn, Instagram
    public string Url { get; set; } = string.Empty;
    public string Icon { get; set; } = string.Empty;
}

public class FooterRequest
{
    public string? Title { get; set; }
    public List<FooterLink>? Links { get; set; }
}

public class FooterInfoRequest
{
    public string CompanyName { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string Address { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Phone { get; set; } = string.Empty;
    public List<SocialMedia>? SocialLinks { get; set; }
    public string Copyright { get; set; } = string.Empty;
}

public class FooterResponse
{
    public bool Success { get; set; }
    public string Message { get; set; } = string.Empty;
    public object? Data { get; set; }
}

public class FooterListResponse
{
    public bool Success { get; set; }
    public string Message { get; set; } = string.Empty;
    public List<FooterSection> Sections { get; set; } = new();
    public FooterInfo? CompanyInfo { get; set; }
}

