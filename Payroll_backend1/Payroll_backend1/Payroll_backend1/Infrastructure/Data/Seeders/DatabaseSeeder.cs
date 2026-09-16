using ExcelDataReader;
using SB.PayrollManagement.Domain.Entities;
using SB.PayrollManagement.Infrastructure.Data;

namespace SB.PayrollManagement.Infrastructure.Data.Seeders
{
    public static class DatabaseSeeder
    {
        /// <summary>
        /// Método de siembra para usuarios iniciales y datos base por defecto.
        /// </summary>
        public static void Seed(AppDbContext context)
        {
            // 1. Crear el usuario Administrador inicial si no existe ninguno
            if (!context.Users.Any())
            {
                context.Users.Add(new User
                {
                    Username = "admin",
                    Password = "Admin123!",
                    Role = "Admin"
                });
            }

            // 2. Si no hay entidades gubernamentales registradas ni archivo Excel, inserta las por defecto
            if (!context.GovernmentEntities.Any())
            {
                context.GovernmentEntities.AddRange(
                    new GovernmentEntity
                    {
                        Name = "DGII - Dirección General de Impuestos Internos",
                        RNC = "101000101",
                        Description = "Entidad recaudadora del Impuesto sobre la Renta (ISR).",
                        DiscountPercentage = 0.00m
                    },
                    new GovernmentEntity
                    {
                        Name = "TSS - Tesorería de la Seguridad Social",
                        RNC = "101888222",
                        Description = "Entidad encargada del cobro y distribución de aportes al SDSS.",
                        DiscountPercentage = 5.91m
                    }
                );
            }

            context.SaveChanges();
        }

        /// <summary>
        /// Método para sembrar las entidades gubernamentales desde un archivo Excel.
        /// </summary>
        public static void SeedGovernmentEntities(AppDbContext context, string excelPath)
        {
            // Primero aseguramos la creación del usuario Admin
            if (!context.Users.Any())
            {
                context.Users.Add(new User
                {
                    Username = "admin",
                    Password = "Admin123!",
                    Role = "Admin"
                });
                context.SaveChanges();
            }

            if (context.GovernmentEntities.Any())
                return; // Si ya existen registros, no vuelve a sembrar

            if (!File.Exists(excelPath))
            {
                // Si el archivo Excel no existe en la ruta, ejecuta la siembra estándar por defecto
                Seed(context);
                return;
            }

            // Registrar el proveedor de codificación para ExcelDataReader
            System.Text.Encoding.RegisterProvider(System.Text.CodePagesEncodingProvider.Instance);

            using var stream = File.Open(excelPath, FileMode.Open, FileAccess.Read);
            using var reader = ExcelReaderFactory.CreateReader(stream);

            // Omitir cabecera si existe
            reader.Read();

            while (reader.Read())
            {
                var name = reader.GetValue(0)?.ToString() ?? string.Empty;
                var rnc = reader.GetValue(1)?.ToString() ?? string.Empty;
                var description = reader.GetValue(2)?.ToString() ?? string.Empty;

                if (!string.IsNullOrWhiteSpace(name))
                {
                    context.GovernmentEntities.Add(new GovernmentEntity
                    {
                        Name = name,
                        RNC = rnc,
                        Description = description,
                        DiscountPercentage = 0.00m
                    });
                }
            }

            context.SaveChanges();
        }
    }
}
