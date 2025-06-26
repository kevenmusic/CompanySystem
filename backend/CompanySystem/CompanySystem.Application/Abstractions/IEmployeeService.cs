using CompanySystem.Application.Models.Employees;
using CompanySystem.Shared.RequestFeatures;

public interface IEmployeeService
{
    Task<EmployeeDto> Create(CreateEmployeeDto employeeDto);
    Task<EmployeeDto> GetById(long id);
    Task<PagedList<EmployeeDto>> GetAllPagination(EmployeeParameters employeeParameters);
    Task<IEnumerable<EmployeeDto>> GetAll();
    Task<IEnumerable<EmployeeDto>> GetAllEmployeesWithEmployeeRoleAsync();
    Task<EmployeeDto> Update(long id, UpdateEmployeeDto employeeDto);
    Task Delete(long id);
}
