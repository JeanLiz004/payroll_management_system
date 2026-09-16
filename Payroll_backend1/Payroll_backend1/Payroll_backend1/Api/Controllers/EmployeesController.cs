using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SB.PayrollManagement.Application.DTOs;
using SB.PayrollManagement.Application.Interfaces;

namespace SB.PayrollManagement.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class EmployeesController : ControllerBase
    {
        private readonly IEmployeeService _employeeService;
        private readonly ILogger<EmployeesController> _logger;

        public EmployeesController(IEmployeeService employeeService, ILogger<EmployeesController> logger)
        {
            _employeeService = employeeService;
            _logger = logger;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll([FromQuery] string? name, [FromQuery] string? department, [FromQuery] bool? active)
        {
            var employees = await _employeeService.GetAllAsync(name, department, active);
            return Ok(employees);
        }

        [HttpGet("{id:int}")]
        public async Task<IActionResult> GetById(int id)
        {
            var emp = await _employeeService.GetByIdAsync(id);
            return emp is null ? NotFound(new { message = $"No existe empleado con Id {id}." }) : Ok(emp);
        }

        [HttpPost]
        [Authorize(Roles = "Admin,Administrador")]
        public async Task<IActionResult> Create([FromBody] EmployeeDto dto)
        {
            var created = await _employeeService.CreateAsync(dto);
            _logger.LogInformation("Empleado {Id} creado por {User}", created.Id, User.Identity?.Name);
            return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
        }

        [HttpPut("{id:int}")]
        [Authorize(Roles = "Admin,Administrador")]
        public async Task<IActionResult> Update(int id, [FromBody] EmployeeDto dto)
        {
            var updated = await _employeeService.UpdateAsync(id, dto);
            _logger.LogInformation("Empleado {Id} actualizado por {User}", id, User.Identity?.Name);
            return Ok(updated);
        }

        [HttpDelete("{id:int}")]
        [Authorize(Roles = "Admin,Administrador")]
        public async Task<IActionResult> Delete(int id)
        {
            await _employeeService.DeleteAsync(id);
            _logger.LogInformation("Empleado {Id} eliminado por {User}", id, User.Identity?.Name);
            return NoContent();
        }
    }
}
