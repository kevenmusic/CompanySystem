using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using CompanySystem.Application.Models.Authentication;
using CompanySystem.Domain;
using Microsoft.EntityFrameworkCore;
using CompanySystem.Application.Mappers;
using CompanySystem.Application.Abstarctions;
using CompanySystem.Application.Models.Breakdowns;
using CompanySystem.Domain.Exceptions;

namespace CompanySystem.Application.Services
{
    public class UserService(CompanySystemContext context) : IUserService
    {
        public async Task<List<UserInfoDto>> GetAllUsersAsync()
        {
            var users = await context.Users
                .Select(u => new UserInfoDto
                {
                    Id = u.Id.ToString(),
                    Username = u.Username,
                    Roles = new List<string> { u.Role }
                })
                .ToListAsync();

            return users;
        }

        public async Task<UserInfoDto> GetById(long userId)
        {
            var entity = await context.Users
                .FirstOrDefaultAsync(x => x.Id == userId)
                ?? throw new EntityNotFoundException($"Пользователь с Id={userId} не найден");

            var dto = new UserInfoDto
            {
                Id = entity.Id.ToString(),
                Username = entity.Username,
                Roles = new List<string> { entity.Role }
            };

            return dto;
        }
    }
}
