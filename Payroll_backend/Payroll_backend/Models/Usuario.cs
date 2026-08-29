namespace Payroll_backend.Models
{
    public partial class Usuario
    {
        public Usuario()
        {
         
        }

        public int IdUsuario { get; set; }
        public string? Nombre { get; set; }
        public string? Correo { get; set; }
        public string? Telefono { get; set; }
        public int? IdRol { get; set; }
        public string? Clave { get; set; }
        public bool? EsActivo { get; set; }

        public virtual Rol? IdRolNavigation { get; set; }
    }
}
