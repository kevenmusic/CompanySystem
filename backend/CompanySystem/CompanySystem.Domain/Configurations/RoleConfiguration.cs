using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using CompanySystem.Domain.Entities;

namespace CompanySystem.Domain.Configurations
{
    public class RoleConfiguration : IEntityTypeConfiguration<RoleEntity>
    {
        public void Configure(EntityTypeBuilder<RoleEntity> entity)
        {
            entity.ToTable("Roles");

            entity.HasKey(r => r.Id);

            entity.Property(r => r.Id)
                .IsRequired()
                .ValueGeneratedOnAdd();

            entity.Property(r => r.Name)
                .IsRequired()
                .HasMaxLength(20);

            entity.HasMany(r => r.Users)
                .WithOne(u => u.Role)
                .HasForeignKey(u => u.RoleId)
                .OnDelete(DeleteBehavior.Restrict);
        }
    }
}
