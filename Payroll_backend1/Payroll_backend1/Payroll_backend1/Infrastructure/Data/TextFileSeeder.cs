using ExcelDataReader;
using SB.PayrollManagement.Domain.Entities;
using System.Text;
using System;

namespace SB.PayrollManagement.Infrastructure.Data
{
    public static class TextFileSeeder
    {
        public static void Seed(AppDbContext context)
        {
            // Evita insertar duplicados si la tabla ya contiene registros
            if (context.GovernmentEntities.Any())
            {
                return;
            }

            // Si lees desde un archivo plano / CSV / TXT en un directorio local:
            var filePath = Path.Combine(Directory.GetCurrentDirectory(), "Data", "GovernmentEntities.txt");

            if (!File.Exists(filePath)) return;

            var lines = File.ReadAllLines(filePath);
            var entities = new List<GovernmentEntity>();

            foreach (var line in lines.Skip(1)) // Omitir encabezado si existe
            {
                var values = line.Split(';'); // O el separador usado (, o \t)
                if (values.Length >= 4)
                {
                    entities.Add(new GovernmentEntity
                    {
                        Name = values[0].Trim(),
                        Category = values[1].Trim(),
                        StatePower = values[2].Trim(),
                        Sector = values[3].Trim()
                    });
                }
            }

            context.GovernmentEntities.AddRange(entities);
            context.SaveChanges();
        }
    }
}
