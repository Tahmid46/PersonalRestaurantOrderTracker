using RestaurantOrderTracker.Application.Common;
using RestaurantOrderTracker.Application.Features.Auth;

namespace RestaurantOrderTracker.Application.Abstractions.Authentication;

public interface IAuthService
{
    Task<OperationResult<AuthResponse>> RegisterAsync(RegisterRequest request, CancellationToken cancellationToken = default);

    Task<OperationResult<AuthResponse>> LoginAsync(LoginRequest request, CancellationToken cancellationToken = default);

    Task<OperationResult<CurrentUserResponse>> GetCurrentUserAsync(string userId, CancellationToken cancellationToken = default);
}