# SB.PayrollManagement - Sistema de Gestión de Nómina

Sistema web de gestión de nómina desarrollado para la **Superintendencia de Bancos (SB)**. Permite la administración de empleados, cálculo automatizado de pagos semanales por tipo de contrato, siembra de entidades gubernamentales y generación de reportes con autenticación segura por roles (Admin/Usuario).

---

## 🛠️ Tecnologías Utilizadas

- **Backend:** .NET 8, ASP.NET Core Web API, Entity Framework Core, Serilog, JWT Bearer
- **Frontend:** React, TypeScript, Vite
- **Base de Datos:** Microsoft SQL Server
- **Arquitectura:** Onion Architecture (Domain, Application, Infrastructure, API)

---

## 📋 Requisitos Previos

- [.NET 8.0 SDK](https://dotnet.microsoft.com/download/dotnet/8.0)
- [Node.js v18+](https://nodejs.org/)
- [SQL Server 2019+](https://www.microsoft.com/sql-server/)

---

## 🚀 Configuración y Ejecución

### 1. Configurar la Cadena de Conexión (Backend)

En el archivo `appsettings.json` ubicado en `Payroll_backend1/Payroll_backend1/Payroll_backend1/`, configura la cadena de conexión a tu instancia local de SQL Server:

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=localhost;Database=SB_PayrollManagementDb;Trusted_Connection=True;TrustServerCertificate=True;"
  }
}