using CompanySystem.Application.Models.Departments;
using CompanySystem.Application.Models.Employees;

namespace CompanySystem.Application.Models.Breakdowns
{
    public abstract class BreakdownDetailsDto
    {
        public string Description { get; set; } = null!;
        public DateTimeOffset DateReported { get; set; }
        public string Status { get; set; } = null!;
        public long EmployeeId { get; set; }
        public long DepartmentId { get; set; }
        public long UserId { get; set; }
    }
}
