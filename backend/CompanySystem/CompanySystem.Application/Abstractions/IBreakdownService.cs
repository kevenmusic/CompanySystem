using CompanySystem.Application.Models.Breakdowns;
using CompanySystem.Shared.RequestFeatures;

namespace CompanySystem.Application.Abstractions
{
    public interface IBreakdownService
    {
        Task<BreakdownDto> CreateByAdminAsync(CreateBreakdownByAdminDto breakdown);
        Task<BreakdownDto> CreateByUserAsync(CreateBreakdownByUserDto breakdown, long userId);
        Task<BreakdownDto> UpdateAsync(long breakdownId, UpdateBreakdownDto breakdown);
        Task<BreakdownDto> UpdateStatusByEmployeeAsync(long breakdownId, UpdateBreakdownStatusDto breakdown);
        Task<BreakdownDto> GetByIdAsync(long breakdownId);
        Task<PagedList<BreakdownDto>> GetAllPaginationAsync(BreakdownParameters breakdownParameters);
        Task<PagedList<BreakdownDto>> GetByUserAsync(long userId, BreakdownParameters breakdownParameters);
        Task<IEnumerable<BreakdownDto>> GetAllAsync();
        Task DeleteAsync(long breakdownId);
    }
}
