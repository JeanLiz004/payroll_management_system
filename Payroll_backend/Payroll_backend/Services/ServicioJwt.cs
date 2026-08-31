using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.Extensions.Configuration;

namespace Payroll_backend.Services
{
    public interface IServicioJwt
    {
        string GenerarToken(string usuarioId, string nombreUsuario, string rol);
    }
    public class ServicioJwt : IServicioJwt
    {
        private readonly IConfiguration _config;

        public ServicioJwt(IConfiguration config)
        {
            _config = config;
        }

        public string GenerarToken(string usuarioId, string nombreUsuario, string rol)
        {
            var claveSecreta = _config["JwtSettings:SecretKey"] ?? throw new InvalidOperationException("Clave JWT no configurada.");
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(claveSecreta));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var claims = new[]
            {
            new Claim(JwtRegisteredClaimNames.Sub, usuarioId),
            new Claim(JwtRegisteredClaimNames.UniqueName, nombreUsuario),
            new Claim(ClaimTypes.Role, rol),
            new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
        };

            var token = new JwtSecurityToken(
                issuer: _config["JwtSettings:Issuer"],
                audience: _config["JwtSettings:Audience"],
                claims: claims,
                expires: DateTime.UtcNow.AddHours(8),
                signingCredentials: creds
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}
