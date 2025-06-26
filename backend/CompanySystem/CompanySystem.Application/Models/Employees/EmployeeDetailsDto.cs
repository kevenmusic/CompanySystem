using CompanySystem.Application.Models.Authentication;

namespace CompanySystem.Application.Models.Employees
{
    public class EmployeeDetailsDto
    {
        public string FullName { get; set; } = null!;
        public long DepartmentId { get; set; }
        public long? UserId { get; set; }
    }
}
