using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SB.PayrollManagement.Application.DTOs;
using SB.PayrollManagement.Application.Interfaces;

namespace SB.PayrollManagement.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(Roles = "Admin,Administrador")]
    public class UsersController : ControllerBase
    {
        private readonly IUserService _userService;
        private readonly ILogger<UsersController> _logger;

        public UsersController(IUserService userService, ILogger<UsersController> logger)
        {
            _userService = userService;
            _logger = logger;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var users = await _userService.GetAllAsync();
            return Ok(users);
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CreateUserDto dto)
        {
            var created = await _userService.CreateAsync(dto);
            _logger.LogInformation("Usuario {Username} creado por {User}", created.Username, User.Identity?.Name);
            return CreatedAtAction(nameof(GetAll), created);
        }

        [HttpPut("{id:int}")]
        public async Task<IActionResult> Update(int id, [FromBody] CreateUserDto dto)
        {
            await _userService.UpdateAsync(id, dto);
            _logger.LogInformation("Usuario {Id} actualizado por {User}", id, User.Identity?.Name);
            return NoContent();
        }

        [HttpDelete("{id:int}")]
        public async Task<IActionResult> Delete(int id)
        {
            await _userService.DeleteAsync(id);
            _logger.LogInformation("Usuario {Id} eliminado por {User}", id, User.Identity?.Name);
            return NoContent();
        }
    }
}
