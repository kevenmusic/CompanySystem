using CompanySystem.Application.Models.Departments;
using CompanySystem.Shared.RequestFeatures;

namespace CompanySystem.Application.Abstarctions
{
    public interface IDepartmentService
    {
        Task<DepartmentDto> Create(CreateDepartmentDto departmentDto);
        Task<DepartmentDto> GetById(long id);
        Task<PagedList<DepartmentDto>> GetAllPagination(DepartmentParameters departmentParameters);
        Task<IEnumerable<DepartmentDto>> GetAll();
        Task<DepartmentDto> Update(long id, UpdateDepartmentDto departmentDto);
        Task Delete(long id);
    }
}
