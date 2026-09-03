using Microsoft.AspNetCore.Mvc;
using Payroll_backend.DTO;
using Payroll_backend.Services;
using System.Security.Claims;

namespace Payroll_backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly IServicioJwt _servicioJwt;

        public AuthController(IServicioJwt servicioJwt)
        {
            _servicioJwt = servicioJwt;
        }

        [HttpPost("login")]
        public IActionResult Login([FromBody] LoginDto dto)
        {
            // Validación simulada de credenciales (conectar a DB o Identity en producción)
            if (dto.Usuario == "admin" && dto.Password == "Admin123*")
            {
                var token = _servicioJwt.GenerarToken("1", dto.Usuario, "Admin");
                return Ok(new RespuestaAutenticacionDto
                {
                    Token = token,
                    Expiracion = DateTime.UtcNow.AddHours(8),
                    Usuario = dto.Usuario,
                    Rol = "Admin"
                });
            }

            if (dto.Usuario == "operador" && dto.Password == "User123*")
            {
                var token = _servicioJwt.GenerarToken("2", dto.Usuario, "User");
                return Ok(new RespuestaAutenticacionDto
                {
                    Token = token,
                    Expiracion = DateTime.UtcNow.AddHours(8),
                    Usuario = dto.Usuario,
                    Rol = "User"
                });
            }

            return Unauthorized(new { mensaje = "Credenciales inválidas" });
        }

        [HttpPost("refresh")]
        public IActionResult Refresh([FromBody] SolicitudRefreshDto dto)
        {
            var principal = _servicioJwt.ObtenerPrincipalDeTokenExpirado(dto.TokenExpirado);
            if (principal == null) return BadRequest("Token inválido");

            var usuarioId = principal.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            var nombreUsuario = principal.FindFirst(ClaimTypes.Name)?.Value;
            var rol = principal.FindFirst(ClaimTypes.Role)?.Value;

            // Validar el RefreshToken almacenado en base de datos aquí...

            var nuevoJwt = _servicioJwt.GenerarToken(usuarioId!, nombreUsuario!, rol!);
            var nuevoRefreshToken = _servicioJwt.GenerarRefreshToken();

            return Ok(new { token = nuevoJwt, refreshToken = nuevoRefreshToken });
        }
    }

}
