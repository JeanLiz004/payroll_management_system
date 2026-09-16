using SB.PayrollManagement.Application.DTOs;

namespace SB.PayrollManagement.Application.Interfaces
{
    public interface IEmployeeService
    {
        Task<IEnumerable<EmployeeDto>> GetAllAsync(string? name, string? department, bool? active);
        Task<EmployeeDto?> GetByIdAsync(int id);
        Task<EmployeeDto> CreateAsync(EmployeeDto dto);
        Task<EmployeeDto> UpdateAsync(int id, EmployeeDto dto);
        Task DeleteAsync(int id);
    }
}
