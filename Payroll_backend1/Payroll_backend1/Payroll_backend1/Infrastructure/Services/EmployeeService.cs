using SB.PayrollManagement.Application.DTOs;
using SB.PayrollManagement.Application.Interfaces;
using SB.PayrollManagement.Domain.Entities;
using SB.PayrollManagement.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
using SB.PayrollManagement.Domain.Enums;

namespace SB.PayrollManagement.Infrastructure.Services
{
    public class EmployeeService : IEmployeeService
    {
        private readonly AppDbContext _context;

        public EmployeeService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<EmployeeDto>> GetAllAsync(string? name, string? department, bool? active)
        {
            var query = _context.Employees.AsQueryable();

            if (!string.IsNullOrWhiteSpace(name))
                query = query.Where(e => e.FirstName.Contains(name) || e.LastName.Contains(name));

            if (!string.IsNullOrWhiteSpace(department))
                query = query.Where(e => e.Department == department);

            if (active.HasValue)
                query = query.Where(e => e.IsActive == active.Value);

            var employees = await query.ToListAsync();
            return employees.Select(MapToDto);
        }

        public async Task<EmployeeDto?> GetByIdAsync(int id)
        {
            var emp = await _context.Employees.FindAsync(id);
            return emp == null ? null : MapToDto(emp);
        }

        public async Task<EmployeeDto> CreateAsync(EmployeeDto dto)
        {
            var emp = new Employee
            {
                FirstName = dto.FirstName,
                LastName = dto.LastName,
                SocialSecurityNumber = dto.SocialSecurityNumber,
                Department = dto.Department,
                IsActive = dto.IsActive,
                EmployeeType = (EmployeeType)dto.EmployeeType,
                WeeklySalary = dto.WeeklySalary,
                HourlyRate = dto.HourlyRate,
                HoursWorked = dto.HoursWorked,
                GrossSales = dto.GrossSales,
                CommissionRate = dto.CommissionRate,
                BaseSalary = dto.BaseSalary
            };

            _context.Employees.Add(emp);
            await _context.SaveChangesAsync();
            return MapToDto(emp);
        }

        public async Task<EmployeeDto> UpdateAsync(int id, EmployeeDto dto)
        {
            var emp = await _context.Employees.FindAsync(id)
                ?? throw new KeyNotFoundException($"Empleado {id} no existe.");

            emp.FirstName = dto.FirstName;
            emp.LastName = dto.LastName;
            emp.SocialSecurityNumber = dto.SocialSecurityNumber;
            emp.Department = dto.Department;
            emp.IsActive = dto.IsActive;
            emp.EmployeeType = (EmployeeType)dto.EmployeeType;
            emp.WeeklySalary = dto.WeeklySalary;
            emp.HourlyRate = dto.HourlyRate;
            emp.HoursWorked = dto.HoursWorked;
            emp.GrossSales = dto.GrossSales;
            emp.CommissionRate = dto.CommissionRate;
            emp.BaseSalary = dto.BaseSalary;
            emp.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();
            return MapToDto(emp);
        }

        public async Task DeleteAsync(int id)
        {
            var emp = await _context.Employees.FindAsync(id);
            if (emp != null)
            {
                _context.Employees.Remove(emp);
                await _context.SaveChangesAsync();
            }
        }

        private static EmployeeDto MapToDto(Employee emp)
        {
            decimal earnings = emp.EmployeeType switch
            {
                EmployeeType.Salaried => emp.WeeklySalary ?? 0,
                EmployeeType.Hourly => (emp.HoursWorked <= 40
                    ? (emp.HoursWorked ?? 0) * (emp.HourlyRate ?? 0)
                    : (40 * (emp.HourlyRate ?? 0)) + (((emp.HoursWorked ?? 0) - 40) * (emp.HourlyRate ?? 0) * 1.5m)),
                EmployeeType.Commission => (emp.GrossSales ?? 0) * (emp.CommissionRate ?? 0),
                EmployeeType.BasePlusCommission => (emp.BaseSalary ?? 0) + ((emp.GrossSales ?? 0) * (emp.CommissionRate ?? 0)),
                _ => 0
            };

            return new EmployeeDto
            {
                Id = emp.Id,
                FirstName = emp.FirstName,
                LastName = emp.LastName,
                SocialSecurityNumber = emp.SocialSecurityNumber,
                Department = emp.Department,
                IsActive = emp.IsActive,
                EmployeeType = (int)emp.EmployeeType,
                WeeklySalary = emp.WeeklySalary,
                HourlyRate = emp.HourlyRate,
                HoursWorked = emp.HoursWorked,
                GrossSales = emp.GrossSales,
                CommissionRate = emp.CommissionRate,
                BaseSalary = emp.BaseSalary,
                CalculatedEarnings = earnings
            };
        }
    }
}
