

# Sistema de Gestión de Nómina
Payroll management system built with ASP.NET Core 8, React with Vite and Microsoft SQL Server.

Aplicación web modular para el cálculo de pagos semanales, gestión de empleados y generación de reportes con autenticación JWT y control de acceso basado en roles (Admin/Usuario).

## Requisitos Previos
- [.NET 8 SDK](https://dotnet.microsoft.com/download/dotnet/8.0)
- [Node.js v18+](https://nodejs.org/)
- [SQL Server](https://www.microsoft.com/sql-server/)

## Ejecución del Backend

1. Navegar a la carpeta backend:
   ```bash
   cd backend/Nomina.API

   Add this to payroll_backend/appsetting.json
   "ConnectionStrings": {
    "DefaultConnection": "Server=[server_name];Database=payroll_management_system;Trusted_Connection=True;TrustServerCertificate=True;"
  }
