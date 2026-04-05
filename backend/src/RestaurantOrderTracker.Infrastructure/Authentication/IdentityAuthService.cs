using FluentValidation;
using Microsoft.AspNetCore.Identity;
using RestaurantOrderTracker.Application.Abstractions.Authentication;
using RestaurantOrderTracker.Application.Common;
using RestaurantOrderTracker.Application.Features.Auth;

namespace RestaurantOrderTracker.Infrastructure.Authentication;

internal sealed class IdentityAuthService(
    UserManager<ApplicationUser> userManager,
    IValidator<RegisterRequest> registerValidator,
    IValidator<LoginRequest> loginValidator,
    JwtTokenGenerator jwtTokenGenerator) : IAuthService
{
    public async Task<OperationResult<AuthResponse>> RegisterAsync(RegisterRequest request, CancellationToken cancellationToken = default)
    {
        var validationResult = await registerValidator.ValidateAsync(request, cancellationToken);

        if (!validationResult.IsValid)
        {
            return OperationResult<AuthResponse>.Failure(validationResult.Errors.Select(error => error.ErrorMessage));
        }

        var existingUser = await userManager.FindByEmailAsync(request.Email);
        if (existingUser is not null)
        {
            return OperationResult<AuthResponse>.Failure("An account with this email already exists.");
        }

        var user = new ApplicationUser
        {
            UserName = request.Email,
            Email = request.Email,
            DisplayName = request.DisplayName,
            EmailConfirmed = true
        };

        var createResult = await userManager.CreateAsync(user, request.Password);

        if (!createResult.Succeeded)
        {
            return OperationResult<AuthResponse>.Failure(createResult.Errors.Select(error => error.Description));
        }

        return OperationResult<AuthResponse>.Success(jwtTokenGenerator.GenerateToken(user));
    }

    public async Task<OperationResult<AuthResponse>> LoginAsync(LoginRequest request, CancellationToken cancellationToken = default)
    {
        var validationResult = await loginValidator.ValidateAsync(request, cancellationToken);

        if (!validationResult.IsValid)
        {
            return OperationResult<AuthResponse>.Failure(validationResult.Errors.Select(error => error.ErrorMessage));
        }

        var user = await userManager.FindByEmailAsync(request.Email);
        if (user is null)
        {
            return OperationResult<AuthResponse>.Failure("Invalid email or password.");
        }

        var isPasswordValid = await userManager.CheckPasswordAsync(user, request.Password);
        if (!isPasswordValid)
        {
            return OperationResult<AuthResponse>.Failure("Invalid email or password.");
        }

        return OperationResult<AuthResponse>.Success(jwtTokenGenerator.GenerateToken(user));
    }

    public async Task<OperationResult<CurrentUserResponse>> GetCurrentUserAsync(string userId, CancellationToken cancellationToken = default)
    {
        var user = await userManager.FindByIdAsync(userId);
        if (user is null)
        {
            return OperationResult<CurrentUserResponse>.Failure("User was not found.");
        }

        return OperationResult<CurrentUserResponse>.Success(new CurrentUserResponse(
            user.Id,
            user.DisplayName,
            user.Email ?? string.Empty));
    }
}