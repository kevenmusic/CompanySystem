using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using CompanySystem.Domain.Entities;

namespace CompanySystem.Domain.Configurations
{
    public class UserConfiguration : IEntityTypeConfiguration<UserEntity>
    {
        public void Configure(EntityTypeBuilder<UserEntity> entity)
        {
            entity.ToTable("Users");

            entity.HasKey(u => u.Id);

            entity.Property(u => u.Username)
                .IsRequired()
                .HasMaxLength(50);

            entity.HasIndex(u => u.Username).IsUnique();

            entity.HasIndex(u => u.RoleId);

            entity.Property(u => u.PasswordHash)
                .IsRequired();

            entity.Property(u => u.RoleId)
                .IsRequired();

            entity.Property(u => u.RefreshToken)
                .HasMaxLength(200);

            entity.Property(u => u.RefreshTokenExpiryTime)
                .IsRequired(false);

            entity.HasOne(u => u.Role)
                .WithMany(r => r.Users)
                .HasForeignKey(u => u.RoleId)
                .OnDelete(DeleteBehavior.Restrict);

            entity.HasOne(u => u.Employee)
                .WithOne(e => e.User)
                .HasForeignKey<EmployeeEntity>(e => e.UserId)
                .OnDelete(DeleteBehavior.SetNull);

            entity.HasMany(u => u.Breakdowns)
                .WithOne(b => b.User)
                .HasForeignKey(b => b.UserId)
                .OnDelete(DeleteBehavior.Cascade);
        }
    }
}
