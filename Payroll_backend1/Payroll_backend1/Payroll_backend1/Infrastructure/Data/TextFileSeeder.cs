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
            // Seeder para el usuario Administrador inicial
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
        }
    }
}
