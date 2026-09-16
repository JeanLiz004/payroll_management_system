using SB.PayrollManagement.Application.DTOs;
using SB.PayrollManagement.Application.Interfaces;
using SB.PayrollManagement.Domain.Entities;
using SB.PayrollManagement.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace SB.PayrollManagement.Infrastructure.Services
{
    public class UserService : IUserService
    {
        private readonly AppDbContext _context;

        public UserService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<UserDto>> GetAllAsync()
        {
            return await _context.Users
                .Select(u => new UserDto
                {
                    Id = u.Id,
                    Username = u.Username,
                    Role = u.Role
                })
                .ToListAsync();
        }

        public async Task<UserDto> CreateAsync(CreateUserDto dto)
        {
            var user = new User
            {
                Username = dto.Username,
                Password = dto.Password, // Recomendado: aplicar hash con BCrypt
                Role = dto.Role
            };

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            return new UserDto
            {
                Id = user.Id,
                Username = user.Username,
                Role = user.Role
            };
        }

        public async Task UpdateAsync(int id, CreateUserDto dto)
        {
            var user = await _context.Users.FindAsync(id)
                ?? throw new KeyNotFoundException($"Usuario con Id {id} no existe.");

            user.Username = dto.Username;
            if (!string.IsNullOrWhiteSpace(dto.Password))
            {
                user.Password = dto.Password;
            }
            user.Role = dto.Role;

            await _context.SaveChangesAsync();
        }

        public async Task DeleteAsync(int id)
        {
            var user = await _context.Users.FindAsync(id);
            if (user != null)
            {
                _context.Users.Remove(user);
                await _context.SaveChangesAsync();
            }
        }
    }
}

