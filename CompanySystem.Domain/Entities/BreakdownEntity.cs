namespace CompanySystem.Domain.Entities
{
    public class BreakdownEntity : BaseEntity
    {
        public string Description { get; set; } = null!;
        public DateTimeOffset DateReported { get; set; }
        public string Status { get; set; } = null!;
        public long EmployeeId { get; set; }
        public long DepartmentId { get; set; }
        public long UserId { get; set; } 
        public virtual UserEntity User { get; set; } = null!;
        public virtual DepartmentEntity Department { get; set; } = null!;
        public virtual EmployeeEntity Employee { get; set; } = null!;
    }
}
