using System;
using System.Text;
using ExcelDataReader.Log;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using SB.PayrollManagement.Infrastructure.Data;
using Serilog;
using System.Reflection;
using SB.PayrollManagement.Infrastructure.Data.Seeders;
using Microsoft.OpenApi.Models;

var builder = WebApplication.CreateBuilder(args);

var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");

builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(connectionString));

// 1. Serilog Logging Configuration
Serilog.Log.Logger = new LoggerConfiguration()
    .WriteTo.Console()
    .WriteTo.File("Logs/payroll_log.txt", rollingInterval: RollingInterval.Day)
    .CreateLogger();

builder.Host.UseSerilog();

// 2. Local Text File / SQLite Database Setup
var dbPath = Path.Combine(Directory.GetCurrentDirectory(), "Database", "payroll.db");
Directory.CreateDirectory(Path.GetDirectoryName(dbPath)!);
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlite($"Data Source={dbPath}"));

// 3. JWT Authentication Setup
var jwtSecret = builder.Configuration["Jwt:Secret"] ?? "SuperSecretKeyForSBSuperintendenciaDeBancos2026!";
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = "SB.PayrollManagement",
            ValidAudience = "SB.PayrollUsers",
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSecret))
        };
    });

builder.Services.AddAuthorization();
// 1. Agregar servicios de controladores
// Reemplaza 'GovernmentEntitiesController' por una clase existente dentro del proyecto de la API/Controladores
builder.Services.AddControllers()
    .AddApplicationPart(typeof(SB.PayrollManagement.Api.Controllers.GovernmentEntitiesController).Assembly);
// 2. Configurar Swagger
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddEndpointsApiExplorer();

// 4. Swagger Documentation
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo
    {
        Title = "SB Payroll Management API",
        Version = "v1"
    });

    // 1. Definir el esquema de seguridad Bearer JWT
    var securityScheme = new OpenApiSecurityScheme
    {
        Name = "Authorization",
        Description = "Ingrese el token JWT en el formato: Bearer {tu_token}",
        In = ParameterLocation.Header,
        Type = SecuritySchemeType.Http,
        Scheme = "bearer",
        BearerFormat = "JWT",
        Reference = new OpenApiReference
        {
            Type = ReferenceType.SecurityScheme,
            Id = "Bearer"
        }
    };

    c.AddSecurityDefinition("Bearer", securityScheme);

    // 2. Aplicar el requerimiento de seguridad a todos los endpoints
    c.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        { securityScheme, Array.Empty<string>() }
    });
});

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp",
        policy => policy.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader());
});

var app = builder.Build();

using (var scope = app.Services.CreateScope())
{
    var context = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    context.Database.Migrate();

    var excelPath = Path.Combine(Directory.GetCurrentDirectory(), "Data", "ListaEntidadesGubernamentales.xlsx");
    DatabaseSeeder.SeedGovernmentEntities(context, excelPath);
}


if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// Inicializar y sembrar datos en la base de datos
using (var scope = app.Services.CreateScope())
{
    var context = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    context.Database.Migrate(); // Asegura que la BD/tabla esté creada
    TextFileSeeder.Seed(context); // Carga las entidades si la tabla está vacía
}

app.UseSerilogRequestLogging();
app.UseCors("AllowReactApp");
app.UseSwagger();
app.UseSwaggerUI();

app.UseHttpsRedirection();
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();

app.Run();