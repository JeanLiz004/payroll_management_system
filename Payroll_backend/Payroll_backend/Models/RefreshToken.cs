namespace Payroll_backend.Models
{
    public class RefreshToken
    {
        public int Id { get; set; }
        public string Token { get; set; } = string.Empty;
        public DateTime FechaExpiracion { get; set; }
        public bool EstaRevocado { get; set; }

        // Debe coincidir con el tipo de dato de Usuario.Id (int)
        public int UsuarioId { get; set; }
        public Usuario? Usuario { get; set; }
    }
}
