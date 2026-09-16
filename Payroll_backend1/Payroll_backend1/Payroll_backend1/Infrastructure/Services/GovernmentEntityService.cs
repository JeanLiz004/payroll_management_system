using SB.PayrollManagement.Application.DTOs;
using SB.PayrollManagement.Application.Interfaces;
using SB.PayrollManagement.Domain.Entities;
using SB.PayrollManagement.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace SB.PayrollManagement.Infrastructure.Services
{
    public class GovernmentEntityService : IGovernmentEntityService
    {
        private readonly AppDbContext _context;

        public GovernmentEntityService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<GovernmentEntityDto>> GetAllAsync(string? name)
        {
            var query = _context.GovernmentEntities.AsQueryable();
            if (!string.IsNullOrWhiteSpace(name))
                query = query.Where(g => g.Name.Contains(name));

            return await query.Select(g => new GovernmentEntityDto
            {
                Id = g.Id,
                Name = g.Name,
                RNC = g.RNC,
                Description = g.Description,
                DiscountPercentage = g.DiscountPercentage
            }).ToListAsync();
        }

        public async Task<GovernmentEntityDto?> GetByIdAsync(int id)
        {
            var g = await _context.GovernmentEntities.FindAsync(id);
            return g == null ? null : new GovernmentEntityDto
            {
                Id = g.Id,
                Name = g.Name,
                RNC = g.RNC,
                Description = g.Description,
                DiscountPercentage = g.DiscountPercentage
            };
        }

        public async Task<GovernmentEntityDto> CreateAsync(GovernmentEntityDto dto)
        {
            var entity = new GovernmentEntity
            {
                Name = dto.Name,
                RNC = dto.RNC,
                Description = dto.Description,
                DiscountPercentage = dto.DiscountPercentage
            };
            _context.GovernmentEntities.Add(entity);
            await _context.SaveChangesAsync();
            dto.Id = entity.Id;
            return dto;
        }

        public async Task UpdateAsync(int id, GovernmentEntityDto dto)
        {
            var entity = await _context.GovernmentEntities.FindAsync(id)
                ?? throw new KeyNotFoundException($"Entidad gubernamental {id} no encontrada.");

            entity.Name = dto.Name;
            entity.RNC = dto.RNC;
            entity.Description = dto.Description;
            entity.DiscountPercentage = dto.DiscountPercentage;

            await _context.SaveChangesAsync();
        }

        public async Task DeleteAsync(int id)
        {
            var entity = await _context.GovernmentEntities.FindAsync(id);
            if (entity != null)
            {
                _context.GovernmentEntities.Remove(entity);
                await _context.SaveChangesAsync();
            }
        }
    }
}
