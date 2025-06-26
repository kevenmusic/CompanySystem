using CompanySystem.Application.Abstarctions;
using CompanySystem.Application.Mappers;
using CompanySystem.Application.Models.Departments;
using CompanySystem.Domain;
using CompanySystem.Domain.Exceptions;
using CompanySystem.Shared.RequestFeatures;
using Microsoft.EntityFrameworkCore;

namespace CompanySystem.Application.Services
{
    public class DepartmentService(CompanySystemContext companySystemContext) : IDepartmentService
    {
        public async Task<PagedList<DepartmentDto>> GetAllPagination(DepartmentParameters departmentParameters)
        {
            var count = await companySystemContext.Departments.CountAsync();

            var entities = await companySystemContext.Departments
                .OrderBy(d => d.Id)
                .Skip((departmentParameters.PageNumber - 1) * departmentParameters.PageSize)
                .Take(departmentParameters.PageSize)
                .ToListAsync();

            return PagedList<DepartmentDto>
                .ToPagedList(entities.Select(d => d.ToDto()).ToList(), count, departmentParameters.PageNumber, departmentParameters.PageSize);
        }

        public async Task<IEnumerable<DepartmentDto>> GetAll()
        {
            var entities = await companySystemContext.Departments
                .OrderBy(e => e.Id)
                .ToListAsync();

            return entities.Select(e => e.ToDto()).ToList();
        }

        public async Task<DepartmentDto> Create(CreateDepartmentDto departmentDto)
        {
            var entity = departmentDto.ToEntity();
            await companySystemContext.Departments.AddAsync(entity);
            await companySystemContext.SaveChangesAsync();

            return entity.ToDto();
        }

        public async Task<DepartmentDto> Update(long id, UpdateDepartmentDto departmentDto)
        {
            var entity = await companySystemContext.Departments.FindAsync(id)
                         ?? throw new EntityNotFoundException($"Отдел с Id={id} не найден");

            entity.UpdateEntity(departmentDto);
            await companySystemContext.SaveChangesAsync();

            return entity.ToDto();
        }

        public async Task<DepartmentDto> GetById(long id)
        {
            var entity = await companySystemContext.Departments.FindAsync(id)
                         ?? throw new EntityNotFoundException($"Отдел с Id={id} не найден");

            return entity.ToDto();
        }

        public async Task Delete(long id)
        {
            var entity = await companySystemContext.Departments.FindAsync(id)
                         ?? throw new EntityNotFoundException($"Отдел с Id={id} не найден");

            companySystemContext.Departments.Remove(entity);
            await companySystemContext.SaveChangesAsync();
        }
    }
}
