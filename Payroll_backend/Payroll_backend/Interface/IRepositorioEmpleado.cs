using Payroll_backend.DTO;
using Payroll_backend.Models;

namespace Payroll_backend.Interface
{
    public interface IRepositorioEmpleado
    {
        Task<IEnumerable<Empleado>> ObtenerEmpleadosActivosAsync();
        Task<IEnumerable<Empleado>> FiltrarAsync(string? nombre, string? departamento, bool? activo);
        Task<Empleado> AgregarAsync(CrearEmpleadoDto dto);
    }
}
