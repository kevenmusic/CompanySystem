using CompanySystem.Application.Abstarctions;
using CompanySystem.Application.Models.Employees;
using CompanySystem.Application.Mappers;
using CompanySystem.Domain;
using CompanySystem.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using CompanySystem.Domain.Exceptions;
using CompanySystem.Application.Models.Breakdowns;
using CompanySystem.Shared.RequestFeatures;

namespace CompanySystem.Application.Services
{
    public class EmployeesService : IEmployeeService
    {
        private readonly CompanySystemContext _context;

        public EmployeesService(CompanySystemContext context)
        {
            _context = context;
        }

        public async Task<PagedList<EmployeeDto>> GetAllPagination(EmployeeParameters employeeParameters)
        {
            var count = await _context.Employees.CountAsync();

            var entities = await _context.Employees
                .OrderBy(e => e.Id)
                .Skip((employeeParameters.PageNumber - 1) * employeeParameters.PageSize)
                .Take(employeeParameters.PageSize)
                .ToListAsync();

            return PagedList<EmployeeDto>
                .ToPagedList(entities.Select(e => e.ToDto()).ToList(), count, employeeParameters.PageNumber, employeeParameters.PageSize);
        }

        public async Task<IEnumerable<EmployeeDto>> GetAll()
        {
            var entities = await _context.Employees
                .OrderBy(e => e.Id)
                .ToListAsync();

            return entities.Select(e => e.ToDto()).ToList();
        }

        public async Task<List<BreakdownDto>> GetBreakdownsForEmployee(long employeeId)
        {
            var breakdowns = await _context.Breakdowns
                .Where(b => b.EmployeeId == employeeId)
                .Include(b => b.User) // если нужно получить данные о пользователе
                .Include(b => b.Department) // если нужен департамент
                .ToListAsync();

            // Предполагается, что у тебя есть маппер из BreakdownEntity в BreakdownDto
            return breakdowns.toDto();
        }

        public async Task<EmployeeDto> Create(CreateEmployeeDto employeeDto)
        {
            var entity = employeeDto.ToEntity();
            await _context.Employees.AddAsync(entity);
            await _context.SaveChangesAsync();
            return entity.ToDto();
        }

        public async Task<EmployeeDto> Update(long id, UpdateEmployeeDto employeeDto)
        {
            var entity = await _context.Employees.FirstOrDefaultAsync(e => e.Id == id)
                ?? throw new EntityNotFoundException($"Сотрудник с Id {id} не найден");

            // Обновляем поля
            entity.Name = employeeDto.Name;

            _context.Employees.Update(entity);
            await _context.SaveChangesAsync();

            return entity.ToDto();
        }

        public async Task<EmployeeDto> GetById(long id)
        {
            var entity = await _context.Employees.FirstOrDefaultAsync(e => e.Id == id)
                ?? throw new EntityNotFoundException($"Сотрудник с Id {id} не найден");
            return entity.ToDto();
        }

        public async Task Delete(long id)
        {
            var entity = await _context.Employees.FirstOrDefaultAsync(e => e.Id == id)
                ?? throw new EntityNotFoundException($"Сотрудник с Id {id} не найден");

            _context.Employees.Remove(entity);
            await _context.SaveChangesAsync();
        }
    }
}