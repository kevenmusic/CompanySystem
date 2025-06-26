namespace CompanySystem.Application.Models.Breakdowns
{
    public class CreateBreakdownByAdminDto
    {
        public string Description { get; set; } = null!;
        public DateTimeOffset DateReported { get; set; }
        public string Status { get; set; } = null!;
        public long EmployeeId { get; set; }
        public long UserId { get; set; }
    }
}
