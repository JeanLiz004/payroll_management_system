using Microsoft.EntityFrameworkCore;
using BCrypt.Net;

namespace Payroll_backend.Models
{
    public class PayrollDbContext : DbContext
    {
        public PayrollDbContext(DbContextOptions<PayrollDbContext> options) : base(options) { }

        public DbSet<Usuario> Usuarios => Set<Usuario>();
        public DbSet<RefreshToken> RefreshTokens => Set<RefreshToken>();
        public DbSet<Empleado> Empleados => Set<Empleado>();

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // 1. Configuración de Herencia para Empleados (TPH)
            modelBuilder.Entity<Empleado>()
                .HasDiscriminator<string>("TipoEmpleadoDiscriminador")
                .HasValue<EmpleadoAsalariado>("Asalariado")
                .HasValue<EmpleadoPorHora>("PorHora")
                .HasValue<EmpleadoPorComision>("PorComision")
                .HasValue<EmpleadoAsalariadoConComision>("AsalariadoConComision");

            // 2. Mapeo de Precisiones Decimales
            modelBuilder.Entity<EmpleadoAsalariado>()
                .Property(e => e.SalarioSemanal)
                .HasPrecision(18, 2);

            modelBuilder.Entity<EmpleadoPorHora>()
                .Property(e => e.TarifaPorHora)
                .HasPrecision(18, 2);

            modelBuilder.Entity<EmpleadoPorComision>(e =>
            {
                e.Property(c => c.VentasBrutas).HasPrecision(18, 2);
                e.Property(c => c.TarifadeComision).HasPrecision(5, 4);
            });

            modelBuilder.Entity<EmpleadoAsalariadoConComision>(e =>
            {
                e.Property(c => c.SalarioBase).HasPrecision(18, 2);
                e.Property(c => c.VentasBrutas).HasPrecision(18, 2);
                e.Property(c => c.TarifadeComision).HasPrecision(5, 4);
            });

            // 3. Data Seeding (Datos Inciales)
            modelBuilder.Entity<Usuario>().HasData(
                new Usuario
                {
                    Id = 1,
                    NombreUsuario = "admin",
                    PasswordHash = BCrypt.Net.BCrypt.HashPassword("Admin123!"),
                    Rol = "Admin"
                }
            );

            modelBuilder.Entity<EmpleadoAsalariado>().HasData(
                new EmpleadoAsalariado
                {
                    Id = 1,
                    Nombre = "Carlos",
                    ApellidoPaterno = "Mendoza",
                    NumeroSeguroSocial = "111-22-333",
                    Departamento = "Tecnología",
                    Activo = true,
                    SalarioSemanal = 1250.00m
                }
            );

            modelBuilder.Entity<EmpleadoPorHora>().HasData(
                new EmpleadoPorHora
                {
                    Id = 2,
                    Nombre = "Ana",
                    ApellidoPaterno = "Gómez",
                    NumeroSeguroSocial = "444-55-666",
                    Departamento = "Soporte",
                    Activo = true,
                    TarifaPorHora = 25.50m,
                    HorasTrabajadas = 40
                }
            );
        }
    }
}

