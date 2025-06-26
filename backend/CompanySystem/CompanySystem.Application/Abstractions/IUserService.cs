using CompanySystem.Application.Models.Authentication;
using CompanySystem.Application.Models.Breakdowns;

namespace CompanySystem.Application.Abstarctions
{
    public interface IUserService
    {
        Task<List<UserInfoDto>> GetAllUsersAsync();
        Task<UserInfoDto> GetById(long id);
        Task<List<BreakdownDto>> GetBreakdownsByUserId(long userId);
        Task<List<UserInfoDto>> GetAllEmployeesAsync();
    }
}