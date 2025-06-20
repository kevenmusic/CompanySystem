using CompanySystem.Application.Models.Authentication;
using CompanySystem.Domain.Entities;

namespace CompanySystem.Application.Abstarctions
{
    public interface IAuthService
    {
        Task<UserEntity?> RegisterAsync(UserDto request);
        Task<TokenResponseDto?> LoginAsync(UserDto request);
        Task<TokenResponseDto?> RefreshTokensAsync(RefreshTokenRequestDto request);
    }
}
