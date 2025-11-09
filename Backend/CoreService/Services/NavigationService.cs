using Backend.Models;

namespace Backend.Services;

public class NavigationService
{
    // Mock database - In production, use real database
    private static readonly List<NavMenuItem> _navigationItems = new()
    {
        new NavMenuItem
        {
            Id = "1",
            Label = "Dashboard",
            Route = "/dashboard",
            Icon = "dashboard",
            Order = 1,
            IsActive = true,
            Role = null,
            SubItems = new()
        },
        new NavMenuItem
        {
            Id = "2",
            Label = "Services",
            Route = "/services",
            Icon = "services",
            Order = 2,
            IsActive = true,
            Role = null,
            SubItems = new()
            {
                new NavMenuItem { Label = "Car Wash", Route = "/services/car-wash", Icon = "wash", Order = 1 },
                new NavMenuItem { Label = "Detailing", Route = "/services/detailing", Icon = "detail", Order = 2 },
                new NavMenuItem { Label = "Maintenance", Route = "/services/maintenance", Icon = "maintenance", Order = 3 }
            }
        },
        new NavMenuItem
        {
            Id = "3",
            Label = "Bookings",
            Route = "/bookings",
            Icon = "bookings",
            Order = 3,
            IsActive = true,
            Role = null,
            SubItems = new()
        },
        new NavMenuItem
        {
            Id = "4",
            Label = "Management",
            Route = "/management",
            Icon = "management",
            Order = 4,
            IsActive = true,
            Role = "Admin",
            SubItems = new()
            {
                new NavMenuItem { Label = "Users", Route = "/management/users", Icon = "users", Order = 1 },
                new NavMenuItem { Label = "Settings", Route = "/management/settings", Icon = "settings", Order = 2 }
            }
        },
        new NavMenuItem
        {
            Id = "5",
            Label = "Reports",
            Route = "/reports",
            Icon = "reports",
            Order = 5,
            IsActive = true,
            Role = "Admin",
            SubItems = new()
        }
    };

    public List<NavMenuItem> GetAllNavigationItems()
    {
        return _navigationItems.OrderBy(x => x.Order).ToList();
    }

    public List<NavMenuItem> GetNavigationItemsByRole(string? userRole)
    {
        var items = _navigationItems
            .Where(x => x.IsActive && (x.Role == null || x.Role == userRole))
            .OrderBy(x => x.Order)
            .ToList();

        // Sort sub-items as well
        foreach (var item in items)
        {
            item.SubItems = item.SubItems.OrderBy(x => x.Order).ToList();
        }

        return items;
    }

    public NavMenuItem? GetNavigationItemById(string id)
    {
        return _navigationItems.FirstOrDefault(x => x.Id == id);
    }

    public NavMenuItem CreateNavigationItem(NavItemRequest request)
    {
        var newItem = new NavMenuItem
        {
            Label = request.Label,
            Route = request.Route,
            Icon = request.Icon,
            Order = request.Order,
            Role = request.Role,
            IsActive = true,
            SubItems = request.SubItems ?? new()
        };

        _navigationItems.Add(newItem);
        return newItem;
    }

    public NavMenuItem? UpdateNavigationItem(string id, NavItemRequest request)
    {
        var item = _navigationItems.FirstOrDefault(x => x.Id == id);
        if (item == null)
            return null;

        item.Label = request.Label;
        item.Route = request.Route;
        item.Icon = request.Icon;
        item.Order = request.Order;
        item.Role = request.Role;
        item.SubItems = request.SubItems ?? new();
        item.UpdatedAt = DateTime.UtcNow;

        return item;
    }

    public bool DeleteNavigationItem(string id)
    {
        var item = _navigationItems.FirstOrDefault(x => x.Id == id);
        if (item == null)
            return false;

        return _navigationItems.Remove(item);
    }

    public bool ToggleNavigationItemStatus(string id)
    {
        var item = _navigationItems.FirstOrDefault(x => x.Id == id);
        if (item == null)
            return false;

        item.IsActive = !item.IsActive;
        item.UpdatedAt = DateTime.UtcNow;
        return true;
    }

    public NavMenuItem? AddSubItem(string parentId, NavItemRequest request)
    {
        var parent = _navigationItems.FirstOrDefault(x => x.Id == parentId);
        if (parent == null)
            return null;

        var subItem = new NavMenuItem
        {
            Label = request.Label,
            Route = request.Route,
            Icon = request.Icon,
            Order = request.Order,
            IsActive = true
        };

        parent.SubItems.Add(subItem);
        parent.UpdatedAt = DateTime.UtcNow;
        return parent;
    }

    public bool RemoveSubItem(string parentId, string subItemLabel)
    {
        var parent = _navigationItems.FirstOrDefault(x => x.Id == parentId);
        if (parent == null)
            return false;

        var subItem = parent.SubItems.FirstOrDefault(x => x.Label == subItemLabel);
        if (subItem == null)
            return false;

        parent.SubItems.Remove(subItem);
        parent.UpdatedAt = DateTime.UtcNow;
        return true;
    }
}

