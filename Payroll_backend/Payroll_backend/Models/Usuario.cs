using NUnit.Framework.Internal.Execution;


namespace Payroll_backend.Models
{
    public partial class Usuario
    {
        public int Id { get; set; }
        public string NombreUsuario { get; set; } = string.Empty;
        public string PasswordHash { get; set; } = string.Empty;
        public string Rol { get; set; } = string.Empty;

        public List<RefreshToken> RefreshTokens { get; set; } = new();
    }
}
