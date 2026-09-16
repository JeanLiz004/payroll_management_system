using Microsoft.EntityFrameworkCore;
using SB.PayrollManagement.Domain.Entities;

namespace SB.PayrollManagement.Infrastructure.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {
        }

        public DbSet<GovernmentEntity> GovernmentEntities { get; set; } = null!;
        public DbSet<User> Users { get; set; } = null!;
        public DbSet<Employee> Employees { get; set; } = null!;

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Configuración explícita de precisión decimal para GovernmentEntity
            modelBuilder.Entity<GovernmentEntity>()
                .Property(g => g.DiscountPercentage)
                .HasPrecision(18, 4); // Permite porcentajes con decimales exactos

            // Configurar precisión decimal (18 enteros/decimales, 2 decimales)
            modelBuilder.Entity<Employee>(entity =>
            {
                entity.Property(e => e.WeeklySalary).HasPrecision(18, 2);
                entity.Property(e => e.HourlyRate).HasPrecision(18, 2);
                entity.Property(e => e.HoursWorked).HasPrecision(18, 2);
                entity.Property(e => e.GrossSales).HasPrecision(18, 2);
                entity.Property(e => e.CommissionRate).HasPrecision(18, 2);
                entity.Property(e => e.BaseSalary).HasPrecision(18, 2);
            });
        }
    }

}