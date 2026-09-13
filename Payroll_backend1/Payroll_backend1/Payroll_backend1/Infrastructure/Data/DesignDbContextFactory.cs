using Microsoft.EntityFrameworkCore.Design;
using Microsoft.EntityFrameworkCore;

namespace SB.PayrollManagement.Infrastructure.Data
{
    public class DesignDbContextFactory : IDesignTimeDbContextFactory<AppDbContext>
    {
        public AppDbContext CreateDbContext(string[] args)
        {
            // Construye la configuración leyendo el appsettings.json del proyecto API
            IConfigurationRoot configuration = new ConfigurationBuilder()
                .SetBasePath(Directory.GetCurrentDirectory())
                .AddJsonFile("appsettings.json", optional: true)
                .Build();

            var builder = new DbContextOptionsBuilder<AppDbContext>();
            var connectionString = configuration.GetConnectionString("DefaultConnection")
                ?? "Server=localhost;Database=PayrollDb;Trusted_Connection=True;TrustServerCertificate=True;";

            builder.UseSqlServer(connectionString);

            return new AppDbContext(builder.Options);
        }
    }
}
