using CompanySystem.Application.Models.Breakdowns;
using CompanySystem.Application.Models.Departments;
using CompanySystem.Application.Models.Employees;
using CompanySystem.Shared.RequestFeatures;
namespace CompanySystem.Application.Abstarctions
{
    public interface IBreakdownsService
    {
        Task<BreakdownDto> Create(CreateBreakdownDto breakdown);
        Task<BreakdownDto> Update(long breakdownId, UpdateBreakdownDto breakdown);
        Task<BreakdownDto> GetById(long breakdownId);
        Task<PagedList<BreakdownDto> > GetAll(BreakdownParameters breakdownParameters);
        Task Delete(long breakdownId);
    }
}
