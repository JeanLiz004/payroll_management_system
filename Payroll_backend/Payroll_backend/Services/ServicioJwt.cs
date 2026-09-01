using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.Extensions.Configuration;
using System.Security.Cryptography;

namespace Payroll_backend.Services
{
    public interface IServicioJwt
    {
        string GenerarToken(string usuarioId, string nombreUsuario, string rol);
        string GenerarRefreshToken();
        ClaimsPrincipal? ObtenerPrincipalDeTokenExpirado(string token);
    }
    public class ServicioJwt : IServicioJwt
    {
        private readonly IConfiguration _config;

        public ServicioJwt(IConfiguration config) => _config = config;

        public string GenerarToken(string usuarioId, string nombreUsuario, string rol)
        {
            var claveSecreta = _config["JwtSettings:SecretKey"]!;
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(claveSecreta));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var claims = new[]
            {
            new Claim(JwtRegisteredClaimNames.Sub, usuarioId),
            new Claim(JwtRegisteredClaimNames.UniqueName, nombreUsuario),
            new Claim(ClaimTypes.Role, rol),
        };

            var token = new JwtSecurityToken(
                issuer: _config["JwtSettings:Issuer"],
                audience: _config["JwtSettings:Audience"],
                claims: claims,
                expires: DateTime.UtcNow.AddMinutes(15), // Token de corta duración
                signingCredentials: creds
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }

        public string GenerarRefreshToken()
        {
            var numeroAleatorio = new byte[64];
            using var rng = RandomNumberGenerator.Create();
            rng.GetBytes(numeroAleatorio);
            return Convert.ToBase64String(numeroAleatorio);
        }

        public ClaimsPrincipal? ObtenerPrincipalDeTokenExpirado(string token)
        {
            var parametrosValidacion = new TokenValidationParameters
            {
                ValidateAudience = true,
                ValidateIssuer = true,
                ValidateIssuerSigningKey = true,
                IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["JwtSettings:SecretKey"]!)),
                ValidIssuer = _config["JwtSettings:Issuer"],
                ValidAudience = _config["JwtSettings:Audience"],
                ValidateLifetime = false // Ignorar expiración para leer los claims
            };

            var tokenHandler = new JwtSecurityTokenHandler();
            var principal = tokenHandler.ValidateToken(token, parametrosValidacion, out SecurityToken securityToken);

            if (securityToken is not JwtSecurityToken jwtSecurityToken ||
                !jwtSecurityToken.Header.Alg.Equals(SecurityAlgorithms.HmacSha256, StringComparison.InvariantCultureIgnoreCase))
                throw new SecurityTokenException("Token inválido");

            return principal;
        }
    }
    }
