using CompanySystem.Application.Abstarctions;
using CompanySystem.Application.Mappers;
using CompanySystem.Application.Models.Breakdowns;
using CompanySystem.Domain;
using CompanySystem.Domain.Entities;
using CompanySystem.Domain.Exceptions;
using CompanySystem.Shared.RequestFeatures;
using Microsoft.EntityFrameworkCore;

namespace CompanySystem.Application.Services
{
    public class BreakdownsService(CompanySystemContext companySystemContext) : IBreakdownsService
    {
        public async Task<PagedList<BreakdownDto>> GetAll(BreakdownParameters breakdownParameters)
        {
            var count = await companySystemContext.Breakdowns.CountAsync();

            var entities = await companySystemContext.Breakdowns
                .Include(b => b.Employee)
                .Include(b => b.Department)
                .Include(b => b.User) 
                .OrderBy(b => b.Id)
                .Skip((breakdownParameters.PageNumber - 1) * breakdownParameters.PageSize)
                .Take(breakdownParameters.PageSize)
                .ToListAsync();

            return PagedList<BreakdownDto>
                .ToPagedList(entities.Select(x => x.toDto()).ToList(), count, breakdownParameters.PageNumber, breakdownParameters.PageSize);
        }

        public async Task<BreakdownDto> Create(CreateBreakdownDto breakdown)
        {
            var entity = new BreakdownEntity
            {
                Description = breakdown.Description,
                DateReported = breakdown.DateReported.ToUniversalTime(),
                Status = breakdown.Status,
                EmployeeId = breakdown.EmployeeId,
                DepartmentId = breakdown.DepartmentId,
                UserId = breakdown.UserId 
            };

            var result = await companySystemContext.Breakdowns.AddAsync(entity);
            await companySystemContext.SaveChangesAsync();

            return await GetById(result.Entity.Id);
        }

        public async Task<BreakdownDto> Update(long breakdownId, UpdateBreakdownDto breakdown)
        {
            var entity = await companySystemContext.Breakdowns
                .Include(b => b.Employee)
                .Include(b => b.Department)
                .Include(b => b.User) 
                .FirstOrDefaultAsync(b => b.Id == breakdownId)
                ?? throw new EntityNotFoundException($"Поломка с Id={breakdownId} не найдена");

            entity.Description = breakdown.Description;
            entity.Status = breakdown.Status;
            entity.DateReported = breakdown.DateReported.ToUniversalTime();
            entity.DepartmentId = breakdown.DepartmentId;
            entity.EmployeeId = breakdown.EmployeeId;
            entity.UserId = breakdown.UserId; 

            await companySystemContext.SaveChangesAsync();

            return entity.toDto();
        }

        public async Task<BreakdownDto> GetById(long breakdownId)
        {
            var entity = await companySystemContext.Breakdowns
                .Include(b => b.Employee)
                .Include(b => b.Department)
                .Include(b => b.User) 
                .FirstOrDefaultAsync(x => x.Id == breakdownId)
                ?? throw new EntityNotFoundException($"Поломка с Id={breakdownId} не найдена");

            return entity.toDto();
        }

        public async Task Delete(long breakdownId)
        {
            var entity = await companySystemContext.Breakdowns.FindAsync(breakdownId)
                        ?? throw new EntityNotFoundException($"Поломка с Id={breakdownId} не найдена");

            companySystemContext.Breakdowns.Remove(entity);
            await companySystemContext.SaveChangesAsync();
        }
    }
}
