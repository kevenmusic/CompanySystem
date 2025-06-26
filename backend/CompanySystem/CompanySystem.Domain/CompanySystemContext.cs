using Microsoft.EntityFrameworkCore;
using CompanySystem.Domain.Entities;
using CompanySystem.Domain.Configurations;

namespace CompanySystem.Domain
{
    public partial class CompanySystemContext : DbContext
    {
        public CompanySystemContext(DbContextOptions<CompanySystemContext> options) : base(options)
        {
        }

        public virtual DbSet<UserEntity> Users { get; set; } = null!;
        public virtual DbSet<BreakdownEntity> Breakdowns { get; set; } = null!;
        public virtual DbSet<DepartmentEntity> Departments { get; set; } = null!;
        public virtual DbSet<EmployeeEntity> Employees { get; set; } = null!;
        public virtual DbSet<RoleEntity> Roles { get; set; } = null!;

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.ApplyConfiguration(new RoleConfiguration());
            modelBuilder.ApplyConfiguration(new UserConfiguration());
            modelBuilder.ApplyConfiguration(new DepartmentConfiguration());
            modelBuilder.ApplyConfiguration(new EmployeeConfiguration());
            modelBuilder.ApplyConfiguration(new BreakdownConfiguration());
        }
    }
}
