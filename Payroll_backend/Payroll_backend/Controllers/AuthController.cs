using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Payroll_backend.DTO;
using Payroll_backend.Models;
using Payroll_backend.Services;
using System.Security.Claims;
using BCrypt.Net;

namespace Payroll_backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly IServicioJwt _servicioJwt;
        private readonly PayrollDbContext _context;

        // Inyectamos el DbContext junto con el ServicioJwt
        public AuthController(IServicioJwt servicioJwt, PayrollDbContext context)
        {
            _servicioJwt = servicioJwt;
            _context = context;
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginDto dto)
        {
            if (string.IsNullOrWhiteSpace(dto.Usuario) || string.IsNullOrWhiteSpace(dto.Password))
            {
                return BadRequest(new { mensaje = "El usuario y la contraseña son requeridos" });
            }

            var usuarioDb = await _context.Usuarios
                .FirstOrDefaultAsync(u => u.NombreUsuario == dto.Usuario);

            if (usuarioDb == null || !BCrypt.Net.BCrypt.Verify(dto.Password, usuarioDb.PasswordHash))
            {
                return Unauthorized(new { mensaje = "Credenciales inválidas" });
            }

            var token = _servicioJwt.GenerarToken(
                usuarioDb.Id.ToString(),
                usuarioDb.NombreUsuario,
                usuarioDb.Rol
            );

            return Ok(new RespuestaAutenticacionDto
            {
                Token = token,
                Expiracion = DateTime.UtcNow.AddHours(8),
                Usuario = usuarioDb.NombreUsuario,
                Rol = usuarioDb.Rol
            });
        }

        [HttpPost("refresh")]
        public IActionResult Refresh([FromBody] SolicitudRefreshDto dto)
        {
            var principal = _servicioJwt.ObtenerPrincipalDeTokenExpirado(dto.TokenExpirado);
            if (principal == null) return BadRequest("Token inválido");

            var usuarioId = principal.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            var nombreUsuario = principal.FindFirst(ClaimTypes.Name)?.Value;
            var rol = principal.FindFirst(ClaimTypes.Role)?.Value;

            var nuevoJwt = _servicioJwt.GenerarToken(usuarioId!, nombreUsuario!, rol!);
            var nuevoRefreshToken = _servicioJwt.GenerarRefreshToken();

            return Ok(new { token = nuevoJwt, refreshToken = nuevoRefreshToken });
        }

        [HttpPost("seed-admin")]
        public async Task<IActionResult> SeedAdmin()
        {
            var usuarioExistente = await _context.Usuarios
                .FirstOrDefaultAsync(u => u.NombreUsuario == "admin");

            // Genera el hash dinámicamente usando la misma librería BCrypt.Net
            string hashValido = BCrypt.Net.BCrypt.HashPassword("Admin123!");

            if (usuarioExistente != null)
            {
                usuarioExistente.PasswordHash = hashValido;
                usuarioExistente.Rol = "Admin";
                _context.Usuarios.Update(usuarioExistente);
            }
            else
            {
                var nuevoAdmin = new Usuario
                {
                    NombreUsuario = "admin",
                    PasswordHash = hashValido,
                    Rol = "Admin"
                };
                _context.Usuarios.Add(nuevoAdmin);
            }

            await _context.SaveChangesAsync();

            return Ok(new { mensaje = "Usuario admin sembrado/actualizado exitosamente con BCrypt nativo" });
        }
    }
}