namespace CompanySystem.Domain.Entities
{
    public class RoleEntity : BaseEntity
    {
        public string Name { get; set; } = null!; // "Admin", "Employee", "User"
        public virtual ICollection<UserEntity> Users { get; set; } = new List<UserEntity>();
    }
}