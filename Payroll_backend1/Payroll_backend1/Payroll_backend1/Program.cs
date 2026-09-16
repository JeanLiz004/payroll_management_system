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
using SB.PayrollManagement.Domain.Entities;
using SB.PayrollManagement.Application.Interfaces;
using SB.PayrollManagement.Infrastructure.Services;

var builder = WebApplication.CreateBuilder(args);

// 1. Serilog Logging Configuration
Serilog.Log.Logger = new LoggerConfiguration()
    .WriteTo.Console()
    .WriteTo.File("Logs/payroll_log.txt", rollingInterval: RollingInterval.Day)
    .CreateLogger();

builder.Host.UseSerilog();

// 2. Base de Datos: Registrar ÚNICAMENTE SQL Server (Eliminar registro duplicado de SQLite)
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(connectionString));

builder.Services.AddScoped<IEmployeeService, EmployeeService>();
builder.Services.AddScoped<IGovernmentEntityService, GovernmentEntityService>();
builder.Services.AddScoped<IUserService, UserService>();

// 3. JWT Authentication Setup
var jwtKey = builder.Configuration["Jwt:Key"];

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey!)),
            ValidateIssuer = false,
            ValidateAudience = false
        };
    });

builder.Services.AddAuthorization();

// 4. Servicios de Controladores y CORS
builder.Services.AddControllers()
    .AddApplicationPart(typeof(SB.PayrollManagement.Api.Controllers.GovernmentEntitiesController).Assembly);


builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp",
        policy => policy.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader());
});


// 5. Configuración de Swagger UI con Botón Authorize
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo
    {
        Title = "SB Payroll Management API",
        Version = "v1"
    });

    // Definir el esquema de seguridad Bearer JWT
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
    //Aplicar el requerimiento de seguridad a todos los endpoints
    c.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        { securityScheme, Array.Empty<string>() }
    });
});

var app = builder.Build();

// 6. Siembra de Datos (Sin ejecutar Database.Migrate() al iniciar la app)
using (var scope = app.Services.CreateScope())
{
    var context = scope.ServiceProvider.GetRequiredService<AppDbContext>();

    // 1. Asegurar la creación de tablas
    context.Database.EnsureCreated();

    // 2. Ejecutar Seeders
    var excelPath = Path.Combine(Directory.GetCurrentDirectory(), "Data", "ListaEntidadesGubernamentales.xlsx");

    // Puedes llamar a Seed (base) o a SeedGovernmentEntities (Excel)
    DatabaseSeeder.SeedGovernmentEntities(context, excelPath);
    TextFileSeeder.Seed(context);
}


if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}


app.UseSerilogRequestLogging();
app.UseCors("AllowReactApp");
app.UseHttpsRedirection();
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();

app.Run();