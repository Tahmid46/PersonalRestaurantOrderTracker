using Microsoft.AspNetCore.Identity;

namespace RestaurantOrderTracker.Infrastructure.Authentication;

public sealed class ApplicationUser : IdentityUser
{
    public string DisplayName { get; set; } = string.Empty;
}