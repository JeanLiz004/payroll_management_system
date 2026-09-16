using SB.PayrollManagement.Application.DTOs;

namespace SB.PayrollManagement.Application.Interfaces
{
    public interface IUserService
    {
        Task<IEnumerable<UserDto>> GetAllAsync();
        Task<UserDto> CreateAsync(CreateUserDto dto);
        Task UpdateAsync(int id, CreateUserDto dto);
        Task DeleteAsync(int id);
    }
}
