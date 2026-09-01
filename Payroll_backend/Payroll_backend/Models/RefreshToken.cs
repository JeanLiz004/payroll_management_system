namespace Payroll_backend.Models
{
    public class RefreshToken
    {
        public int Id { get; set; }
        public string Token { get; set; } = string.Empty;
        public string UsuarioId { get; set; } = string.Empty;
        public DateTime FechaExpiracion { get; set; }
        public bool EstaRevocado { get; set; }
    }
}
