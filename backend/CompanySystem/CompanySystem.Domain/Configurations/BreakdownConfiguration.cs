using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using CompanySystem.Domain.Entities;

namespace CompanySystem.Domain.Configurations
{
    public class BreakdownConfiguration : IEntityTypeConfiguration<BreakdownEntity>
    {
        public void Configure(EntityTypeBuilder<BreakdownEntity> entity)
        {
            entity.ToTable("Breakdowns");

            entity.HasKey(b => b.Id);

            entity.Property(b => b.Id)
                .IsRequired()
                .ValueGeneratedOnAdd();

            entity.Property(b => b.Description)
                .IsRequired()
                .HasMaxLength(500);

            entity.HasIndex(b => b.UserId);
            entity.HasIndex(b => b.EmployeeId);
            entity.HasIndex(b => b.Status);

            entity.Property(b => b.DateReported)
                .IsRequired();

            entity.Property(b => b.Status)
                .IsRequired()
                .HasMaxLength(20)
                .HasDefaultValue("Сообщено");

            entity.Property(b => b.EmployeeId)
                .IsRequired();

            entity.Property(b => b.UserId)
                .IsRequired();

            entity.HasOne(b => b.User)
                .WithMany(u => u.Breakdowns)
                .HasForeignKey(b => b.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            entity.HasOne(b => b.Employee)
                .WithMany(e => e.Breakdowns)
                .HasForeignKey(b => b.EmployeeId)
                .OnDelete(DeleteBehavior.SetNull);
        }
    }
}
