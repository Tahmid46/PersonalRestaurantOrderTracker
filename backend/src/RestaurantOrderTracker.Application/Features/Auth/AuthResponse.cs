namespace RestaurantOrderTracker.Application.Features.Auth;

public sealed record AuthResponse(
    string UserId,
    string DisplayName,
    string Email,
    string Token,
    DateTimeOffset ExpiresAtUtc);