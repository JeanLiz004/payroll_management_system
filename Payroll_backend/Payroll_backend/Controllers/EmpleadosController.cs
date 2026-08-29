using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Payroll_backend.DTO;
using Payroll_backend.Services;
using Payroll_backend.Interface;

namespace Payroll_backend.Controllers
{
   

    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class EmpleadosController : ControllerBase
    {
        private readonly IRepositorioEmpleado _repositorio;
        private readonly IServicioNomina _servicioNomina;
        private readonly ILogger<EmpleadosController> _logger;

        public EmpleadosController(IRepositorioEmpleado repositorio, IServicioNomina servicioNomina, ILogger<EmpleadosController> logger)
        {
            _repositorio = repositorio;
            _servicioNomina = servicioNomina;
            _logger = logger;
        }

        [HttpGet]
        public async Task<IActionResult> ObtenerTodos([FromQuery] string? nombre, [FromQuery] string? departamento, [FromQuery] bool? activo)
        {
            _logger.LogInformation("Filtrando empleados. Nombre: {Nombre}, Depto: {Depto}, Activo: {Estado}", nombre, departamento, activo);
            var resultado = await _repositorio.FiltrarAsync(nombre, departamento, activo);
            return Ok(resultado);
        }

        [Authorize(Roles = "Admin")]
        [HttpPost]
        public async Task<IActionResult> Crear([FromBody] CrearEmpleadoDto dto)
        {
            _logger.LogInformation("Creando nuevo empleado de tipo: {Tipo}", dto.Tipo);
            var creado = await _repositorio.AgregarAsync(dto);
            return CreatedAtAction(nameof(ObtenerTodos), new { id = creado.Id }, creado);
        }

        [HttpGet("reporte-nomina")]
        public async Task<IActionResult> ObtenerReporteNomina()
        {
            var reporte = await _servicioNomina.GenerarReporteSemanalAsync();
            return Ok(reporte);
        }
    }
}
