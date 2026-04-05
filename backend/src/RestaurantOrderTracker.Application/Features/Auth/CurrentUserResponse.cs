namespace RestaurantOrderTracker.Application.Features.Auth;

public sealed record CurrentUserResponse(string UserId, string DisplayName, string Email);