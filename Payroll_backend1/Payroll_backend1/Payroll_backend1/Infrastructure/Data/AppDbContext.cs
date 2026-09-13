using Microsoft.EntityFrameworkCore;
using SB.PayrollManagement.Domain.Entities;

namespace SB.PayrollManagement.Infrastructure.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {
        }

        // Agrega esta propiedad
        public DbSet<GovernmentEntity> GovernmentEntities { get; set; } = null!;
        public DbSet<User> Users { get; set; } = null!;
    }
}
