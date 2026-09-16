using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SB.PayrollManagement.Application.Interfaces;

namespace SB.PayrollManagement.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class ReportsController : ControllerBase
    {
        private readonly IEmployeeService _employeeService;

        public ReportsController(IEmployeeService employeeService)
        {
            _employeeService = employeeService;
        }

        [HttpGet("payroll")]
        public async Task<IActionResult> GetPayrollReport()
        {
            var employees = (await _employeeService.GetAllAsync(null, null, true)).ToList();
            var report = new
            {
                GeneratedAt = DateTime.UtcNow,
                TotalEmployees = employees.Count,
                TotalPayrollAmount = employees.Sum(e => e.CalculatedEarnings),
                Employees = employees
            };

            return Ok(report);
        }
    }
}
