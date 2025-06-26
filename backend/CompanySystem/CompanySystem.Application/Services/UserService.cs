using CompanySystem.Application.Abstarctions;
using CompanySystem.Application.Models.Authentication;
using CompanySystem.Application.Models.Breakdowns;
using CompanySystem.Domain;
using CompanySystem.Domain.Exceptions;
using Microsoft.EntityFrameworkCore;

namespace CompanySystem.Application.Services
{
    public class UserService : IUserService
    {
        private readonly CompanySystemContext _companySystemContext;

        public UserService(CompanySystemContext companySystemContext)
        {
            _companySystemContext = companySystemContext;
        }

        public async Task<List<UserInfoDto>> GetAllUsersAsync()
        {
            var users = await _companySystemContext.Users
                .Include(u => u.Role)
                .Include(u => u.Employee)
                .Where(u => u.Role.Name == "User")
                .Select(u => new UserInfoDto
                {
                    Id = u.Id,
                    Username = u.Username,
                    Roles = new List<string> { u.Role.Name },
                })
                .ToListAsync();

            return users;
        }

        public async Task<List<BreakdownDto>> GetBreakdownsByUserId(long userId)
        {
            var userWithEmployee = await _companySystemContext.Users
                .Include(u => u.Employee)
                    .ThenInclude(e => e.Breakdowns)
                .FirstOrDefaultAsync(u => u.Id == userId)
                ?? throw new EntityNotFoundException($"Пользователь с Id={userId} не найден");

            var employee = userWithEmployee.Employee
                ?? throw new EntityNotFoundException($"Работник, связанный с пользователем Id={userId}, не найден");

            var breakdownsDto = employee.Breakdowns
                .Select(b => new BreakdownDto
                {
                    Id = b.Id,
                    Description = b.Description,
                    EmployeeId = b.EmployeeId,
                    DateReported = b.DateReported,
                    Status = b.Status,
                    UserId = b.UserId
                })
                .ToList();

            return breakdownsDto;
        }

        public async Task<List<UserInfoDto>> GetAllEmployeesAsync()
        {
            var employees = await _companySystemContext.Users
                .Include(u => u.Role)
                .Include(u => u.Employee)
                .Where(u => u.Role.Name == "Employee")
                .Select(u => new UserInfoDto
                {
                    Id = u.Id,
                    Username = u.Username,
                    Roles = new List<string> { u.Role.Name },
                })
                .ToListAsync();

            return employees;
        }

        public async Task<UserInfoDto> GetById(long userId)
        {
            var entity = await _companySystemContext.Users
                .Include(u => u.Role)
                .Include(u => u.Employee)
                .FirstOrDefaultAsync(u => u.Id == userId)
                ?? throw new EntityNotFoundException($"Пользователь с Id={userId} не найден");

            return new UserInfoDto
            {
                Id = entity.Id,
                Username = entity.Username,
                Roles = new List<string> { entity.Role.Name },
            };
        }
    }
}
