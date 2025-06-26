namespace CompanySystem.Domain.Entities
{
    public class DepartmentEntity : BaseEntity
    {
        public string Name { get; set; } = null!;
        public string ManagerFullName { get; set; } = null!;
        public virtual ICollection<EmployeeEntity> Employees { get; set; } = new List<EmployeeEntity>();
    }
}