
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Payroll_backend.Services;
using Payroll_backend.Models;
using System.Text;
using Microsoft.OpenApi.Models;
using Payroll_backend.Interface;     // O el namespace donde tengas IRepositorioEmpleado
using Payroll_backend.Repository;

var builder = WebApplication.CreateBuilder(args);


// Add services to the container.

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();

// Definición de nombre de política CORS
var corsPolicyName = "AllowReactApp";

// Configuración de CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy(name: corsPolicyName, policy =>
    {
        policy.WithOrigins("http://localhost:5173") // Dirección de tu cliente React Vite
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials();


    });
});

// Configuración de Swagger con soporte para Bearer JWT Token
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo { Title = "Payroll API", Version = "v1" });

    c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Name = "Authorization",
        Type = SecuritySchemeType.ApiKey,
        Scheme = "Bearer",
        BearerFormat = "JWT",
        In = ParameterLocation.Header,
        Description = "Ingresa el token en el formato: Bearer {tu_token_jwt}"
    });

    c.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            Array.Empty<string>()
        }
    });
});

builder.Services.AddDbContext<PayrollDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

// Configuración de Autenticación JWT
var jwtSettings = builder.Configuration.GetSection("JwtSettings");
var secretKey = jwtSettings["SecretKey"]!;

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        ValidIssuer = jwtSettings["Issuer"],
        ValidAudience = jwtSettings["Audience"],
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secretKey))
    };
});


builder.Services.AddAuthorization();
// Registro de Servicios Inyectados
builder.Services.AddScoped<IServicioJwt, ServicioJwt>();
builder.Services.AddScoped<IRepositorioEmpleado, RepositorioEmpleado>();
builder.Services.AddScoped<IServicioNomina, ServicioNomina>();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

// 2. Middleware (El orden es fundamental)
app.UseRouting();

// Habilitar CORS (Debe ir entre UseRouting y UseAuthentication/UseAuthorization)
app.UseCors(corsPolicyName);

app.UseAuthentication(); // <-- Primero Autenticación
app.UseAuthorization();  // <-- Luego Autorización

app.MapControllers();

app.Run();
