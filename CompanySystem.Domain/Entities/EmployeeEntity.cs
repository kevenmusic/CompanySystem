namespace CompanySystem.Domain.Entities
{
    public class EmployeeEntity : BaseEntity
    {
        public string Name { get; set; } = null!;
        public virtual ICollection<BreakdownEntity> Breakdowns { get; set; } = new List<BreakdownEntity>();
    }
}
 