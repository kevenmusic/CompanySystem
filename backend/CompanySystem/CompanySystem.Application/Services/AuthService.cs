using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using CompanySystem.Application.Abstarctions;
using CompanySystem.Application.Models.Authentication;
using CompanySystem.Domain;
using CompanySystem.Domain.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;

namespace CompanySystem.Application.Services
{
    public class AuthService : IAuthService
    {
        private readonly CompanySystemContext _companySystemContext;
        private readonly IConfiguration _configuration;

        public AuthService(CompanySystemContext companySystemContext, IConfiguration configuration)
        {
            _companySystemContext = companySystemContext;
            _configuration = configuration;
        }

        public async Task<TokenResponseDto?> LoginAsync(UserDto request)
        {
            var user = await _companySystemContext.Users
                .Include(u => u.Role)
                .Include(u => u.Employee)
                .FirstOrDefaultAsync(u => u.Username == request.Username);
            if (user is null)
            {
                return null;
            }

            if (new PasswordHasher<UserEntity>().VerifyHashedPassword(user, user.PasswordHash, request.Password)
                == PasswordVerificationResult.Failed)
            {
                return null;
            }

            var tokenResponse = await CreateTokenResponse(user);
            return tokenResponse;
        }

        private async Task<TokenResponseDto> CreateTokenResponse(UserEntity user)
        {
            var tokenResponse = new TokenResponseDto
            {
                AccessToken = CreateToken(user),
                RefreshToken = await GenerateAndSaveRefreshTokenAsync(user),
                User = new UserInfoDto
                {
                    Id = user.Id,
                    Username = user.Username,
                    Roles = new List<string> { user.Role.Name },
                    EmployeeName = user.Employee?.FullName
                }
            };

            return tokenResponse;
        }

        public async Task<UserEntity?> RegisterAsync(UserDto request)
        {
            if (await _companySystemContext.Users.AnyAsync(u => u.Username == request.Username))
            {
                return null;
            }

            var userRole = await _companySystemContext.Set<RoleEntity>()
                .FirstOrDefaultAsync(r => r.Name == "User");
            if (userRole is null)
            {
                throw new InvalidOperationException("Role 'User' not found in the database.");
            }

            var user = new UserEntity
            {
                Username = request.Username,
                PasswordHash = new PasswordHasher<UserEntity>().HashPassword(null!, request.Password),
                RoleId = userRole.Id 
            };

            _companySystemContext.Users.Add(user);
            await _companySystemContext.SaveChangesAsync();

            return user;
        }

        public async Task<TokenResponseDto?> RefreshTokensAsync(RefreshTokenRequestDto request)
        {
            var user = await ValidateRefreshTokenAsync(request.UserId, request.RefreshToken);
            if (user is null)
                return null;

            return await CreateTokenResponse(user);
        }

        private async Task<UserEntity?> ValidateRefreshTokenAsync(long userId, string refreshToken)
        {
            var user = await _companySystemContext.Users
                .Include(u => u.Role) 
                .FirstOrDefaultAsync(u => u.Id == userId);
            if (user is null || user.RefreshToken != refreshToken
                || user.RefreshTokenExpiryTime <= DateTime.UtcNow)
            {
                return null;
            }

            return user;
        }

        private string GenerateRefreshToken()
        {
            var randomNumber = new byte[32];
            using var rng = RandomNumberGenerator.Create();
            rng.GetBytes(randomNumber);
            return Convert.ToBase64String(randomNumber);
        }

        private async Task<string> GenerateAndSaveRefreshTokenAsync(UserEntity user)
        {
            var refreshToken = GenerateRefreshToken();
            user.RefreshToken = refreshToken;
            user.RefreshTokenExpiryTime = DateTime.UtcNow.AddDays(7);
            await _companySystemContext.SaveChangesAsync();
            return refreshToken;
        }

        private string CreateToken(UserEntity user)
        {
            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.Name, user.Username),
                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                new Claim(ClaimTypes.Role, user.Role.Name)
            };

            var key = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(_configuration.GetValue<string>("AppSettings:Token")!));

            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha512);

            var tokenDescriptor = new JwtSecurityToken(
                issuer: _configuration.GetValue<string>("AppSettings:Issuer"),
                audience: _configuration.GetValue<string>("AppSettings:Audience"),
                claims: claims,
                expires: DateTime.UtcNow.AddDays(1),
                signingCredentials: creds
            );

            return new JwtSecurityTokenHandler().WriteToken(tokenDescriptor);
        }
    }
}