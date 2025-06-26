using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using CompanySystem.Domain.Entities;

namespace CompanySystem.Domain.Configurations
{
    public class DepartmentConfiguration : IEntityTypeConfiguration<DepartmentEntity>
    {
        public void Configure(EntityTypeBuilder<DepartmentEntity> entity)
        {
            entity.ToTable("Departments");

            entity.HasKey(d => d.Id);

            entity.Property(d => d.Id)
                .IsRequired()
                .ValueGeneratedOnAdd();

            entity.Property(d => d.Name)
                .IsRequired()
                .HasMaxLength(100);

            entity.Property(d => d.ManagerFullName)
                .IsRequired()
                .HasMaxLength(100);

            entity.HasMany(d => d.Employees)
                .WithOne(e => e.Department)
                .HasForeignKey(e => e.DepartmentId)
                .OnDelete(DeleteBehavior.Restrict);
        }
    }
}
