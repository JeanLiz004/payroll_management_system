using System.Text.Json.Serialization;

namespace Payroll_backend.DTO
{
    public class AuthDtos
    {
    }

    public class LoginDto
    {
        [JsonPropertyName("nombreUsuario")]
        public string Usuario { get; set; } = string.Empty;

        public string Password { get; set; } = string.Empty;
    }

    public class RespuestaAutenticacionDto
    {
        public string Token { get; set; } = string.Empty;
        public DateTime Expiracion { get; set; }
        public string Usuario { get; set; } = string.Empty;
        public string Rol { get; set; } = string.Empty;
    }
}
