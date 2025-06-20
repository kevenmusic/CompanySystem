using Microsoft.EntityFrameworkCore;
using CompanySystem.Domain.Entities;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity;

namespace CompanySystem.Domain
{
    public partial class CompanySystemContext(DbContextOptions options) : DbContext(options)
    {  
        public virtual DbSet<UserEntity> Users { get; set; }
        public virtual DbSet<BreakdownEntity> Breakdowns { get; set; }
        public virtual DbSet<DepartmentEntity> Departments { get; set; }
        public virtual DbSet<EmployeeEntity> Employees { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // ======================
            // UserEntity
            // ======================
            modelBuilder.Entity<UserEntity>(entity =>
            {
                entity.ToTable("Users");

                entity.HasKey(u => u.Id);

                entity.Property(u => u.Id)
                    .IsRequired()
                    .ValueGeneratedOnAdd();

                entity.Property(u => u.Username)
                    .IsRequired()
                    .HasMaxLength(50);

                entity.Property(u => u.PasswordHash)
                    .IsRequired();

                entity.Property(u => u.Role)
                    .IsRequired()
                    .HasMaxLength(20);

                entity.Property(u => u.RefreshToken)
                    .HasMaxLength(200);

                entity.Property(u => u.RefreshTokenExpiryTime);

                entity.HasMany(u => u.Breakdowns)
                    .WithOne(b => b.User)
                    .HasForeignKey(b => b.UserId)
                    .OnDelete(DeleteBehavior.Cascade);
            });

            // ======================
            // DepartmentEntity
            // ======================
            modelBuilder.Entity<DepartmentEntity>(entity =>
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

                entity.HasMany(d => d.Breakdowns)
                    .WithOne(b => b.Department)
                    .HasForeignKey(b => b.DepartmentId)
                    .OnDelete(DeleteBehavior.Restrict);
            });

            // ======================
            // EmployeeEntity
            // ======================
            modelBuilder.Entity<EmployeeEntity>(entity =>
            {
                entity.ToTable("Employees");

                entity.HasKey(e => e.Id);

                entity.Property(e => e.Id)
                    .IsRequired()
                    .ValueGeneratedOnAdd();

                entity.Property(e => e.Name)
                    .IsRequired()
                    .HasMaxLength(100);

                entity.HasMany(e => e.Breakdowns)
                    .WithOne(b => b.Employee)
                    .HasForeignKey(b => b.EmployeeId)
                    .OnDelete(DeleteBehavior.SetNull);
            });

            // ======================
            // BreakdownEntity
            // ======================
            modelBuilder.Entity<BreakdownEntity>(entity =>
            {
                entity.ToTable("Breakdowns");

                entity.HasKey(b => b.Id);

                entity.Property(b => b.Id)
                    .IsRequired()
                    .ValueGeneratedOnAdd();

                entity.Property(b => b.Description)
                    .IsRequired()
                    .HasMaxLength(500);

                entity.Property(b => b.DateReported)
                    .IsRequired();

                entity.Property(b => b.Status)
                    .IsRequired()
                    .HasMaxLength(50);

                entity.Property(b => b.EmployeeId)
                    .IsRequired();

                entity.Property(b => b.DepartmentId)
                    .IsRequired();

                entity.Property(b => b.UserId)
                    .IsRequired();

                // Связи настроены через WithOne выше
            });
        }

    }
}
