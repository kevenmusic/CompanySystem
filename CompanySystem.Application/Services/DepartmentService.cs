using CompanySystem.Application.Abstarctions;
using CompanySystem.Application.Mappers;
using CompanySystem.Application.Models.Departments;
using CompanySystem.Domain;
using CompanySystem.Domain.Entities;
using CompanySystem.Domain.Exceptions;
using CompanySystem.Shared.RequestFeatures;
using Microsoft.EntityFrameworkCore;

namespace CompanySystem.Application.Services
{
    public class DepartmentService(CompanySystemContext context) : IDepartmentService
    {
        public async Task<PagedList<DepartmentDto>> GetAll(DepartmentParameters departmentParameters)
        {
            var count = await context.Departments.CountAsync();

            var entities = await context.Departments
                .OrderBy(d => d.Id)
                .Skip((departmentParameters.PageNumber - 1) * departmentParameters.PageSize)
                .Take(departmentParameters.PageSize)
                .ToListAsync();

            return PagedList<DepartmentDto>
                .ToPagedList(entities.Select(d => d.ToDto()).ToList(), count, departmentParameters.PageNumber, departmentParameters.PageSize);
        }

        public async Task<DepartmentDto> Create(CreateDepartmentDto departmentDto)
        {
            var entity = departmentDto.ToEntity();
            await context.Departments.AddAsync(entity);
            await context.SaveChangesAsync();

            return entity.ToDto();
        }

        public async Task<DepartmentDto> Update(long id, UpdateDepartmentDto departmentDto)
        {
            var entity = await context.Departments.FindAsync(id)
                         ?? throw new EntityNotFoundException($"Отдел с Id={id} не найден");

            entity.UpdateEntity(departmentDto);
            await context.SaveChangesAsync();

            return entity.ToDto();
        }

        public async Task<DepartmentDto> GetById(long id)
        {
            var entity = await context.Departments.FindAsync(id)
                         ?? throw new EntityNotFoundException($"Отдел с Id={id} не найден");

            return entity.ToDto();
        }

        public async Task Delete(long id)
        {
            var entity = await context.Departments.FindAsync(id)
                         ?? throw new EntityNotFoundException($"Отдел с Id={id} не найден");

            context.Departments.Remove(entity);
            await context.SaveChangesAsync();
        }
    }
}
