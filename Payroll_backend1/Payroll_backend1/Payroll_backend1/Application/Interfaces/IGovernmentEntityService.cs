using SB.PayrollManagement.Application.DTOs;

namespace SB.PayrollManagement.Application.Interfaces
{
    public interface IGovernmentEntityService
    {
        Task<IEnumerable<GovernmentEntityDto>> GetAllAsync(string? name);
        Task<GovernmentEntityDto?> GetByIdAsync(int id);
        Task<GovernmentEntityDto> CreateAsync(GovernmentEntityDto dto);
        Task UpdateAsync(int id, GovernmentEntityDto dto);
        Task DeleteAsync(int id);
    }
}
