using CompanySystem.Application.Models.Authentication;
using CompanySystem.Application.Models.Departments;

namespace CompanySystem.Application.Abstarctions
{
    public interface IUserService
    {
        Task<List<UserInfoDto>> GetAllUsersAsync();
        Task<UserInfoDto> GetById(long id);
    }
}
