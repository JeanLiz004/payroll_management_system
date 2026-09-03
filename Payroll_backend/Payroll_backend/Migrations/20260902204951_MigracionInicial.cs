using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Payroll_backend.Migrations
{
    /// <inheritdoc />
    public partial class MigracionInicial : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Empleados",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Nombre = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    ApellidoPaterno = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    NumeroSeguroSocial = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Departamento = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Activo = table.Column<bool>(type: "bit", nullable: false),
                    Tipo = table.Column<int>(type: "int", nullable: false),
                    TipoEmpleadoDiscriminador = table.Column<string>(type: "nvarchar(21)", maxLength: 21, nullable: false),
                    SalarioSemanal = table.Column<decimal>(type: "decimal(18,2)", precision: 18, scale: 2, nullable: true),
                    VentasBrutas = table.Column<decimal>(type: "decimal(18,2)", precision: 18, scale: 2, nullable: true),
                    TarifadeComision = table.Column<decimal>(type: "decimal(5,4)", precision: 5, scale: 4, nullable: true),
                    SalarioBase = table.Column<decimal>(type: "decimal(18,2)", precision: 18, scale: 2, nullable: true),
                    EmpleadoPorComision_VentasBrutas = table.Column<decimal>(type: "decimal(18,2)", precision: 18, scale: 2, nullable: true),
                    EmpleadoPorComision_TarifadeComision = table.Column<decimal>(type: "decimal(5,4)", precision: 5, scale: 4, nullable: true),
                    TarifaPorHora = table.Column<decimal>(type: "decimal(18,2)", precision: 18, scale: 2, nullable: true),
                    HorasTrabajadas = table.Column<double>(type: "float", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Empleados", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Usuarios",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    NombreUsuario = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    PasswordHash = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Rol = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Usuarios", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "RefreshTokens",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Token = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    FechaExpiracion = table.Column<DateTime>(type: "datetime2", nullable: false),
                    EstaRevocado = table.Column<bool>(type: "bit", nullable: false),
                    UsuarioId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_RefreshTokens", x => x.Id);
                    table.ForeignKey(
                        name: "FK_RefreshTokens_Usuarios_UsuarioId",
                        column: x => x.UsuarioId,
                        principalTable: "Usuarios",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.InsertData(
                table: "Empleados",
                columns: new[] { "Id", "Activo", "ApellidoPaterno", "Departamento", "Nombre", "NumeroSeguroSocial", "SalarioSemanal", "Tipo", "TipoEmpleadoDiscriminador" },
                values: new object[] { 1, true, "Mendoza", "Tecnología", "Carlos", "111-22-333", 1250.00m, 0, "Asalariado" });

            migrationBuilder.InsertData(
                table: "Empleados",
                columns: new[] { "Id", "Activo", "ApellidoPaterno", "Departamento", "HorasTrabajadas", "Nombre", "NumeroSeguroSocial", "TarifaPorHora", "Tipo", "TipoEmpleadoDiscriminador" },
                values: new object[] { 2, true, "Gómez", "Soporte", 40.0, "Ana", "444-55-666", 25.50m, 1, "PorHora" });

            migrationBuilder.InsertData(
                table: "Usuarios",
                columns: new[] { "Id", "NombreUsuario", "PasswordHash", "Rol" },
                values: new object[] { 1, "admin", "$2a$11$0Hiw/UkT/oyVtlu/on2djulD67zhgBo3GmZt3F/IAp.8QHYA.S082", "Admin" });

            migrationBuilder.CreateIndex(
                name: "IX_RefreshTokens_UsuarioId",
                table: "RefreshTokens",
                column: "UsuarioId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Empleados");

            migrationBuilder.DropTable(
                name: "RefreshTokens");

            migrationBuilder.DropTable(
                name: "Usuarios");
        }
    }
}
