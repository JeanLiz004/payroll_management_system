using Microsoft.EntityFrameworkCore;
using Payroll_backend.DTO;
using Payroll_backend.Interface;
using Payroll_backend.Models;


namespace Payroll_backend.Repository
{
    public class RepositorioEmpleado : IRepositorioEmpleado
    {
        private readonly PayrollDbContext _context;

        public RepositorioEmpleado(PayrollDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Empleado>> ObtenerEmpleadosActivosAsync()
        {
            return await _context.Empleados
                .Where(e => e.Activo)
                .ToListAsync();
        }

        public async Task<IEnumerable<Empleado>> FiltrarAsync(string? nombre, string? departamento, bool? activo)
        {
            var query = _context.Empleados.AsQueryable();

            if (!string.IsNullOrWhiteSpace(nombre))
            {
                query = query.Where(e => e.Nombre.Contains(nombre) || e.ApellidoPaterno.Contains(nombre));
            }

            if (!string.IsNullOrWhiteSpace(departamento))
            {
                query = query.Where(e => e.Departamento == departamento);
            }

            if (activo.HasValue)
            {
                query = query.Where(e => e.Activo == activo.Value);
            }

            return await query.ToListAsync();
        }

        public async Task<Empleado> AgregarAsync(CrearEmpleadoDto dto)
        {
            // Instanciar la subclase correspondiente según el Enum TipoEmpleado (TPH)
            Empleado nuevoEmpleado = dto.Tipo switch
            {
                TipoEmpleado.Asalariado => new EmpleadoAsalariado
                {
                    Nombre = dto.Nombre,
                    ApellidoPaterno = dto.ApellidoPaterno,
                    NumeroSeguroSocial = dto.NumeroSeguroSocial,
                    Departamento = dto.Departamento,
                    SalarioSemanal = dto.SalarioSemanal ?? 0m
                },
                TipoEmpleado.PorHora => new EmpleadoPorHora
                {
                    Nombre = dto.Nombre,
                    ApellidoPaterno = dto.ApellidoPaterno,
                    NumeroSeguroSocial = dto.NumeroSeguroSocial,
                    Departamento = dto.Departamento,
                    TarifaPorHora = dto.TarifaPorHora ?? 0m,
                    HorasTrabajadas = dto.HorasTrabajadas ?? 0
                },
                TipoEmpleado.PorComision => new EmpleadoPorComision
                {
                    Nombre = dto.Nombre,
                    ApellidoPaterno = dto.ApellidoPaterno,
                    NumeroSeguroSocial = dto.NumeroSeguroSocial,
                    Departamento = dto.Departamento,
                    VentasBrutas = dto.VentasBrutas ?? 0m,
                    TarifadeComision = dto.TarifadeComision ?? 0m
                },
                TipoEmpleado.AsalariadoConComision => new EmpleadoAsalariadoConComision
                {
                    Nombre = dto.Nombre,
                    ApellidoPaterno = dto.ApellidoPaterno,
                    NumeroSeguroSocial = dto.NumeroSeguroSocial,
                    Departamento = dto.Departamento,
                    SalarioBase = dto.SalarioBase ?? 0m,
                    VentasBrutas = dto.VentasBrutas ?? 0m,
                    TarifadeComision = dto.TarifadeComision ?? 0m
                },
                _ => throw new ArgumentException("Tipo de empleado no válido")
            };

            _context.Empleados.Add(nuevoEmpleado);
            await _context.SaveChangesAsync();

            return nuevoEmpleado;
        }
    }
}