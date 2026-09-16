using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SB.PayrollManagement.Application.DTOs;
using SB.PayrollManagement.Application.Interfaces;
using SB.PayrollManagement.Infrastructure.Data;

namespace SB.PayrollManagement.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class GovernmentEntitiesController : ControllerBase
    {
        private readonly IGovernmentEntityService _service;

        public GovernmentEntitiesController(IGovernmentEntityService service)
        {
            _service = service;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll([FromQuery] string? name)
        {
            var entities = await _service.GetAllAsync(name);
            return Ok(entities);
        }

        [HttpGet("{id:int}")]
        public async Task<IActionResult> GetById(int id)
        {
            var entity = await _service.GetByIdAsync(id);
            return entity is null ? NotFound(new { message = $"Entidad {id} no encontrada." }) : Ok(entity);
        }

        [HttpPost]
        [Authorize(Roles = "Admin,Administrador")]
        public async Task<IActionResult> Create([FromBody] GovernmentEntityDto dto)
        {
            var created = await _service.CreateAsync(dto);
            return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
        }

        [HttpPut("{id:int}")]
        [Authorize(Roles = "Admin,Administrador")]
        public async Task<IActionResult> Update(int id, [FromBody] GovernmentEntityDto dto)
        {
            await _service.UpdateAsync(id, dto);
            return NoContent();
        }

        [HttpDelete("{id:int}")]
        [Authorize(Roles = "Admin,Administrador")]
        public async Task<IActionResult> Delete(int id)
        {
            await _service.DeleteAsync(id);
            return NoContent();
        }
    }
}
