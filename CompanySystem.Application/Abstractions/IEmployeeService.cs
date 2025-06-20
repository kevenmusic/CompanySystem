using CompanySystem.Application.Models.Employees;
using CompanySystem.Application.Models.Breakdowns;
using CompanySystem.Shared.RequestFeatures;

public interface IEmployeeService
{
    Task<EmployeeDto> Create(CreateEmployeeDto employeeDto);
    Task<EmployeeDto> GetById(long id);
    Task<PagedList<EmployeeDto>> GetAllPagination(EmployeeParameters employeeParameters);
    Task<IEnumerable<EmployeeDto>> GetAll();
    Task<EmployeeDto> Update(long id, UpdateEmployeeDto employeeDto);
    Task Delete(long id);
    Task<List<BreakdownDto>> GetBreakdownsForEmployee(long employeeId);
}
