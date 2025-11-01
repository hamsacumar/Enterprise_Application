using AuthService.Models;
using AuthService.Services;

public static class SeedData
{
    public static async Task<bool> SeedIfNeededAsync(UserService userService)
    {
        var any = await userService.AnyUserAsync();
        if (any) return false;

        var admin = new User
        {
            Username = "admin",
            FirstName = "System",
            LastName = "Admin",
            Email = "admin@gmail.com",
            PasswordHash = BCrypt.Net.BCrypt.HashPassword("Admin@123"),
            Role = Role.Admin,
        };

        var worker = new User
        {
            Username = "worker1",
            FirstName = "Worker",
            LastName = "One",
            Email = "worker1@gmail.com",
            PasswordHash = BCrypt.Net.BCrypt.HashPassword("Worker@123"),
            Role = Role.Worker,
        };

        await userService.CreateAsync(admin);
        await userService.CreateAsync(worker);

        return true;
    }
}
