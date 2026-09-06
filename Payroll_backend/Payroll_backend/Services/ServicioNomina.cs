using Microsoft.Extensions.Logging;
using Payroll_backend.Models;
using Microsoft.Extensions.Logging;
using Payroll_backend.Interface;

namespace Payroll_backend.Services
{ 

    public interface IServicioNomina
    {
        Task<IEnumerable<ItemReporteNominaDto>> GenerarReporteSemanalAsync();
    }

    public class ItemReporteNominaDto
    {
        public int EmpleadoId { get; set; }
        public string NombreCompleto { get; set; } = string.Empty;
        public string TipoEmpleado { get; set; } = string.Empty;
        public decimal PagoSemanal { get; set; }
        public string DetalleCalculo { get; set; } = string.Empty;
    }

    public class ServicioNomina : IServicioNomina
    {
        private readonly IRepositorioEmpleado _repositorio;
        private readonly ILogger<ServicioNomina> _logger;

        public ServicioNomina(IRepositorioEmpleado repositorio, ILogger<ServicioNomina> logger)
        {
            _repositorio = repositorio;
            _logger = logger;
        }

        public async Task<IEnumerable<ItemReporteNominaDto>> GenerarReporteSemanalAsync()
        {
            _logger.LogInformation("Iniciando cálculo de nómina semanal.");
            var empleados = await _repositorio.ObtenerEmpleadosActivosAsync();

            var reporte = empleados.Select(e => new ItemReporteNominaDto
            {
                EmpleadoId = e.Id,
                NombreCompleto = $"{e.Nombre} {e.ApellidoPaterno}".Trim(),
                TipoEmpleado = e.Tipo.ToString(),
                PagoSemanal = e.CalcularPagoSemanal(),
                DetalleCalculo = ConstruirDetalleCalculo(e)
            }).ToList();

            _logger.LogInformation("Cálculo de nómina completado para {Cant} empleados.", reporte.Count);
            return reporte;
        }

        private static string ConstruirDetalleCalculo(Empleado e) => e switch
        {
            EmpleadoAsalariado s => $"Sueldo fijo semanal: {s.SalarioSemanal:C}",
            EmpleadoPorHora h => h.HorasTrabajadas <= 40
                ? $"{h.HorasTrabajadas} hrs × {h.TarifaPorHora:C}"
                : $"40 hrs × {h.TarifaPorHora:C} + {h.HorasTrabajadas - 40} hrs extras × {h.TarifaPorHora * 1.5m:C}",
            EmpleadoPorComision c => $"Ventas: {c.VentasBrutas:C} × Tarifa: {c.TarifadeComision:P}",
            EmpleadoAsalariadoConComision sc => $"Comisión ({sc.VentasBrutas:C} × {sc.TarifadeComision:P}) + Salario Base ({sc.SalarioBase:C}) + 10% Bono Base ({sc.SalarioBase * 0.10m:C})",
            _ => "Sin detalle"
        };
    }
}
