using CompanySystem.Application.Abstractions;
using CompanySystem.Application.Mappers;
using CompanySystem.Application.Models.Breakdowns;
using CompanySystem.Domain;
using CompanySystem.Domain.Entities;
using CompanySystem.Domain.Exceptions;
using CompanySystem.Shared.RequestFeatures;
using Microsoft.EntityFrameworkCore;

namespace CompanySystem.Application.Services
{
    public class BreakdownsService(CompanySystemContext companySystemContext) : IBreakdownService
    {
        public async Task<PagedList<BreakdownDto>> GetAllPaginationAsync(BreakdownParameters breakdownParameters)
        {
            var count = await companySystemContext.Breakdowns.CountAsync();

            var entities = await companySystemContext.Breakdowns
                .Include(b => b.Employee)
                .Include(b => b.User)
                .OrderBy(b => b.Id)
                .Skip((breakdownParameters.PageNumber - 1) * breakdownParameters.PageSize)
                .Take(breakdownParameters.PageSize)
                .ToListAsync();

            return PagedList<BreakdownDto>.ToPagedList(
                entities.Select(b => b.toDto()).ToList(),
                count,
                breakdownParameters.PageNumber,
                breakdownParameters.PageSize
            );
        }

        public async Task<PagedList<BreakdownDto>> GetByUserAsync(long userId, BreakdownParameters breakdownParameters)
        {
            var query = companySystemContext.Breakdowns
                .Where(b => b.UserId == userId)
                .Include(b => b.Employee)
                .Include(b => b.User)
                .OrderBy(b => b.Id);

            var count = await query.CountAsync();

            var entities = await query
                .Skip((breakdownParameters.PageNumber - 1) * breakdownParameters.PageSize)
                .Take(breakdownParameters.PageSize)
                .ToListAsync();

            return PagedList<BreakdownDto>.ToPagedList(
                entities.Select(b => b.toDto()).ToList(),
                count,
                breakdownParameters.PageNumber,
                breakdownParameters.PageSize
            );
        }

        public async Task<IEnumerable<BreakdownDto>> GetAllAsync()
        {
            var entities = await companySystemContext.Breakdowns
                .Include(b => b.Employee)
                .Include(b => b.User)
                .OrderBy(b => b.Id)
                .ToListAsync();

            return entities.Select(b => b.toDto()).ToList();
        }

        public async Task<BreakdownDto> GetByIdAsync(long breakdownId)
        {
            var entity = await companySystemContext.Breakdowns
                .Include(b => b.Employee)
                .Include(b => b.User)
                .FirstOrDefaultAsync(b => b.Id == breakdownId)
                ?? throw new EntityNotFoundException($"Поломка с Id={breakdownId} не найдена");

            return entity.toDto();
        }

        public async Task<BreakdownDto> CreateByAdminAsync(CreateBreakdownByAdminDto breakdown)
        {
            var entity = new BreakdownEntity
            {
                Description = breakdown.Description,
                DateReported = breakdown.DateReported.ToUniversalTime(),
                Status = breakdown.Status,
                EmployeeId = breakdown.EmployeeId,
                UserId = breakdown.UserId
            };

            await companySystemContext.Breakdowns.AddAsync(entity);
            await companySystemContext.SaveChangesAsync();

            return await GetByIdAsync(entity.Id);
        }

        public async Task<BreakdownDto> CreateByUserAsync(CreateBreakdownByUserDto breakdown, long userId)
        {
            var employee = await companySystemContext.Employees
                .FirstOrDefaultAsync(e => e.Id == breakdown.EmployeeId)
                ?? throw new EntityNotFoundException($"Работник с Id={breakdown.EmployeeId} не найден");

            var entity = new BreakdownEntity
            {
                Description = breakdown.Description,
                DateReported = DateTime.UtcNow,  
                Status = "Cообщено",                  
                EmployeeId = breakdown.EmployeeId,
                UserId = userId
            };

            await companySystemContext.Breakdowns.AddAsync(entity);
            await companySystemContext.SaveChangesAsync();

            return await GetByIdAsync(entity.Id);
        }

        public async Task<BreakdownDto> UpdateStatusByEmployeeAsync(long breakdownId, UpdateBreakdownStatusDto updateDto)
        {
            var entity = await companySystemContext.Breakdowns
                .Include(b => b.Employee)
                .Include(b => b.User)
                .FirstOrDefaultAsync(b => b.Id == breakdownId)
                ?? throw new EntityNotFoundException($"Поломка с Id={breakdownId} не найдена");

            entity.Status = updateDto.Status;

            await companySystemContext.SaveChangesAsync();

            return entity.toDto();
        }

        public async Task<BreakdownDto> UpdateAsync(long breakdownId, UpdateBreakdownDto breakdown)
        {
            var entity = await companySystemContext.Breakdowns
                .Include(b => b.Employee)
                .Include(b => b.User)
                .FirstOrDefaultAsync(b => b.Id == breakdownId)
                ?? throw new EntityNotFoundException($"Поломка с Id={breakdownId} не найдена");

            entity.Description = breakdown.Description;
            entity.DateReported = breakdown.DateReported.ToUniversalTime();
            entity.Status = breakdown.Status;
            entity.EmployeeId = breakdown.EmployeeId;
            entity.UserId = breakdown.UserId;

            await companySystemContext.SaveChangesAsync();

            return entity.toDto();
        }

        public async Task DeleteAsync(long breakdownId)
        {
            var entity = await companySystemContext.Breakdowns.FindAsync(breakdownId)
                ?? throw new EntityNotFoundException($"Поломка с Id={breakdownId} не найдена");

            companySystemContext.Breakdowns.Remove(entity);
            await companySystemContext.SaveChangesAsync();
        }
    }
}
