using Backend.Models;

namespace Backend.Services;

public class FooterService
{
    // Mock database - In production, use real database
    private static readonly List<FooterSection> _footerSections = new()
    {
        new FooterSection
        {
            Id = "1",
            Title = "Company",
            Order = 1,
            Links = new()
            {
                new FooterLink { Text = "About Us", Url = "/about", Icon = "info", Order = 1 },
                new FooterLink { Text = "Careers", Url = "/careers", Icon = "briefcase", Order = 2 },
                new FooterLink { Text = "Blog", Url = "/blog", Icon = "newspaper", Order = 3 }
            }
        },
        new FooterSection
        {
            Id = "2",
            Title = "Services",
            Order = 2,
            Links = new()
            {
                new FooterLink { Text = "Car Wash", Url = "/services/car-wash", Icon = "water", Order = 1 },
                new FooterLink { Text = "Detailing", Url = "/services/detailing", Icon = "sparkles", Order = 2 },
                new FooterLink { Text = "Maintenance", Url = "/services/maintenance", Icon = "tools", Order = 3 },
                new FooterLink { Text = "Pricing", Url = "/pricing", Icon = "tag", Order = 4 }
            }
        },
        new FooterSection
        {
            Id = "3",
            Title = "Support",
            Order = 3,
            Links = new()
            {
                new FooterLink { Text = "Help Center", Url = "/help", Icon = "help-circle", Order = 1 },
                new FooterLink { Text = "Contact Us", Url = "/contact", Icon = "mail", Order = 2 },
                new FooterLink { Text = "FAQ", Url = "/faq", Icon = "question", Order = 3 }
            }
        },
        new FooterSection
        {
            Id = "4",
            Title = "Legal",
            Order = 4,
            Links = new()
            {
                new FooterLink { Text = "Privacy Policy", Url = "/privacy", Icon = "lock", Order = 1 },
                new FooterLink { Text = "Terms of Service", Url = "/terms", Icon = "file-text", Order = 2 },
                new FooterLink { Text = "Cookie Policy", Url = "/cookies", Icon = "cookie", Order = 3 }
            }
        }
    };

    private static FooterInfo _companyInfo = new()
    {
        CompanyName = "AutoWash Pro",
        Description = "Professional car washing and detailing services",
        Address = "123 Main Street, City, State 12345",
        Email = "info@autowashpro.com",
        Phone = "(555) 123-4567",
        Copyright = $"© {DateTime.Now.Year} AutoWash Pro. All rights reserved.",
        SocialLinks = new()
        {
            new SocialMedia { Platform = "Facebook", Url = "https://facebook.com/autowashpro", Icon = "facebook" },
            new SocialMedia { Platform = "Twitter", Url = "https://twitter.com/autowashpro", Icon = "twitter" },
            new SocialMedia { Platform = "Instagram", Url = "https://instagram.com/autowashpro", Icon = "instagram" },
            new SocialMedia { Platform = "LinkedIn", Url = "https://linkedin.com/company/autowashpro", Icon = "linkedin" }
        }
    };

    public List<FooterSection> GetAllFooterSections()
    {
        return _footerSections.OrderBy(x => x.Order).ToList();
    }

    public FooterSection? GetFooterSectionById(string id)
    {
        return _footerSections.FirstOrDefault(x => x.Id == id);
    }

    public FooterInfo GetFooterInfo()
    {
        return _companyInfo;
    }

    public FooterSection CreateFooterSection(FooterRequest request)
    {
        if (string.IsNullOrEmpty(request.Title))
            throw new ArgumentException("Title is required");

        var maxOrder = _footerSections.Any() ? _footerSections.Max(x => x.Order) : 0;

        var newSection = new FooterSection
        {
            Title = request.Title,
            Order = maxOrder + 1,
            Links = request.Links ?? new()
        };

        _footerSections.Add(newSection);
        return newSection;
    }

    public FooterSection? UpdateFooterSection(string id, FooterRequest request)
    {
        var section = _footerSections.FirstOrDefault(x => x.Id == id);
        if (section == null)
            return null;

        if (!string.IsNullOrEmpty(request.Title))
            section.Title = request.Title;

        if (request.Links != null)
            section.Links = request.Links;

        section.UpdatedAt = DateTime.UtcNow;
        return section;
    }

    public bool DeleteFooterSection(string id)
    {
        var section = _footerSections.FirstOrDefault(x => x.Id == id);
        if (section == null)
            return false;

        return _footerSections.Remove(section);
    }

    public FooterSection? AddLinkToSection(string sectionId, FooterLink link)
    {
        var section = _footerSections.FirstOrDefault(x => x.Id == sectionId);
        if (section == null)
            return null;

        if (string.IsNullOrEmpty(link.Text) || string.IsNullOrEmpty(link.Url))
            throw new ArgumentException("Text and Url are required");

        var maxOrder = section.Links.Any() ? section.Links.Max(x => x.Order) : 0;
        link.Order = maxOrder + 1;
        link.Id = Guid.NewGuid().ToString();

        section.Links.Add(link);
        section.UpdatedAt = DateTime.UtcNow;
        return section;
    }

    public FooterSection? RemoveLinkFromSection(string sectionId, string linkId)
    {
        var section = _footerSections.FirstOrDefault(x => x.Id == sectionId);
        if (section == null)
            return null;

        var link = section.Links.FirstOrDefault(x => x.Id == linkId);
        if (link == null)
            return null;

        section.Links.Remove(link);
        section.UpdatedAt = DateTime.UtcNow;
        return section;
    }

    public FooterInfo UpdateFooterInfo(FooterInfoRequest request)
    {
        _companyInfo.CompanyName = request.CompanyName ?? _companyInfo.CompanyName;
        _companyInfo.Description = request.Description ?? _companyInfo.Description;
        _companyInfo.Address = request.Address ?? _companyInfo.Address;
        _companyInfo.Email = request.Email ?? _companyInfo.Email;
        _companyInfo.Phone = request.Phone ?? _companyInfo.Phone;
        _companyInfo.Copyright = request.Copyright ?? _companyInfo.Copyright;

        if (request.SocialLinks != null)
            _companyInfo.SocialLinks = request.SocialLinks;

        _companyInfo.UpdatedAt = DateTime.UtcNow;
        return _companyInfo;
    }

    public FooterListResponse GetCompleteFooter()
    {
        return new FooterListResponse
        {
            Success = true,
            Message = "Footer data retrieved successfully",
            Sections = _footerSections.OrderBy(x => x.Order).ToList(),
            CompanyInfo = _companyInfo
        };
    }
}

