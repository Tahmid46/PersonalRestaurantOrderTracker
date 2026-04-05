namespace RestaurantOrderTracker.Application.Features.Auth;

public sealed record RegisterRequest(string DisplayName, string Email, string Password);