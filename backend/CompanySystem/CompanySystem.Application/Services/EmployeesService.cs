using CompanySystem.Application.Mappers;
using CompanySystem.Application.Models.Employees;
using CompanySystem.Domain;
using CompanySystem.Domain.Exceptions;
using CompanySystem.Shared.RequestFeatures;
using Microsoft.EntityFrameworkCore;

namespace CompanySystem.Application.Services
{
    public class EmployeesService : IEmployeeService
    {
        private readonly CompanySystemContext companySystemContext;

        public EmployeesService(CompanySystemContext companySystemContext)
        {
            this.companySystemContext = companySystemContext;
        }

        public async Task<PagedList<EmployeeDto>> GetAllPagination(EmployeeParameters employeeParameters)
        {
            var count = await companySystemContext.Employees.CountAsync();

            var entities = await companySystemContext.Employees
                .Include(e => e.Department)
                .Include(e => e.User)
                .OrderBy(e => e.Id)
                .Skip((employeeParameters.PageNumber - 1) * employeeParameters.PageSize)
                .Take(employeeParameters.PageSize)
                .ToListAsync();

            return PagedList<EmployeeDto>
                .ToPagedList(entities.Select(e => e.ToDto()).ToList(), count, employeeParameters.PageNumber, employeeParameters.PageSize);
        }

        public async Task<IEnumerable<EmployeeDto>> GetAll()
        {
            var entities = await companySystemContext.Employees
                .Include(e => e.Department)
                .Include(e => e.User)
                .OrderBy(e => e.Id)
                .ToListAsync();

            return entities.Select(e => e.ToDto()).ToList();
        }

        public async Task<IEnumerable<EmployeeDto>> GetAllEmployeesWithEmployeeRoleAsync()
        {
            var employees = await companySystemContext.Employees
                .Include(e => e.User)
                    .ThenInclude(u => u.Role)
                .Where(e => e.User != null && e.User.Role.Name == "Employee")
                .OrderBy(e => e.Id)
                .ToListAsync();

            return employees.Select(e => e.ToDto()).ToList();
        }


        public async Task<EmployeeDto> GetById(long id)
        {
            var entity = await companySystemContext.Employees
                .Include(e => e.Department)
                 .Include(e => e.User)
                .FirstOrDefaultAsync(e => e.Id == id)
                ?? throw new EntityNotFoundException($"Сотрудник с Id {id} не найден");

            return entity.ToDto();
        }

        public async Task<EmployeeDto> Create(CreateEmployeeDto employeeDto)
        {
            var entity = employeeDto.ToEntity();
            await companySystemContext.Employees.AddAsync(entity);
            await companySystemContext.SaveChangesAsync();
            return entity.ToDto();
        }

        public async Task<EmployeeDto> Update(long id, UpdateEmployeeDto employeeDto)
        {
            var entity = await companySystemContext.Employees.FirstOrDefaultAsync(e => e.Id == id)
                ?? throw new EntityNotFoundException($"Сотрудник с Id {id} не найден");

            // Обновляем поля, включая DepartmentId
            entity.FullName = employeeDto.FullName;
            entity.DepartmentId = employeeDto.DepartmentId;
            entity.UserId = employeeDto.UserId;

            companySystemContext.Employees.Update(entity);
            await companySystemContext.SaveChangesAsync();

            return entity.ToDto();
        }

        public async Task Delete(long id)
        {
            var entity = await companySystemContext.Employees.FirstOrDefaultAsync(e => e.Id == id)
                ?? throw new EntityNotFoundException($"Сотрудник с Id {id} не найден");

            companySystemContext.Employees.Remove(entity);
            await companySystemContext.SaveChangesAsync();
        }
    }
}