namespace CompanySystem.Domain.Entities
{
    public class EmployeeEntity : BaseEntity
    {
        public string FullName { get; set; } = null!;
        public long DepartmentId { get; set; }
        public long? UserId { get; set; } 
        public virtual UserEntity? User { get; set; }
        public virtual DepartmentEntity Department { get; set; } = null!;
        public virtual ICollection<BreakdownEntity> Breakdowns { get; set; } = new List<BreakdownEntity>();
    }
}