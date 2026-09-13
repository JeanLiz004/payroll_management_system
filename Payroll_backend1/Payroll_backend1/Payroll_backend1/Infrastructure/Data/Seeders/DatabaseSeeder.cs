using ExcelDataReader;
using SB.PayrollManagement.Domain.Entities;
using SB.PayrollManagement.Infrastructure.Data;

namespace SB.PayrollManagement.Infrastructure.Data.Seeders
{
    public static class DatabaseSeeder
    {
        public static void SeedGovernmentEntities(AppDbContext context, string filePath)
        {
            if (context.GovernmentEntities.Any() || !File.Exists(filePath)) return;

            System.Text.Encoding.RegisterProvider(System.Text.CodePagesEncodingProvider.Instance);

            using var stream = File.Open(filePath, FileMode.Open, FileAccess.Read);
            using var reader = ExcelReaderFactory.CreateReader(stream);

            var entities = new List<GovernmentEntity>();
            reader.Read(); // Omitir encabezado

            while (reader.Read())
            {
                var name = reader.GetValue(0)?.ToString()?.Trim();
                if (string.IsNullOrEmpty(name)) continue;

                entities.Add(new GovernmentEntity
                {
                    Name = name,
                    Category = reader.GetValue(1)?.ToString()?.Trim() ?? string.Empty,
                    StatePower = reader.GetValue(2)?.ToString()?.Trim() ?? string.Empty,
                    Sector = reader.GetValue(3)?.ToString()?.Trim() ?? string.Empty
                });
            }

            context.GovernmentEntities.AddRange(entities);
            context.SaveChanges();
        }
    }
}
