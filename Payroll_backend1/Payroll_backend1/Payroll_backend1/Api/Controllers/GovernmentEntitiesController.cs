using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SB.PayrollManagement.Infrastructure.Data;

namespace SB.PayrollManagement.Api.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class GovernmentEntitiesController : ControllerBase
    {
        private readonly AppDbContext _context;

        public GovernmentEntitiesController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll([FromQuery] string? search, [FromQuery] string? sector)
        {
            var query = _context.GovernmentEntities.AsQueryable();

            if (!string.IsNullOrWhiteSpace(search))
            {
                query = query.Where(e => e.Name.Contains(search) || e.Category.Contains(search));
            }

            if (!string.IsNullOrWhiteSpace(sector))
            {
                query = query.Where(e => e.Sector == sector);
            }

            var result = await query.ToListAsync();
            return Ok(result);
        }
    }
}
