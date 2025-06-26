using System.Text.Json;
using CompanySystem.Application.Abstractions;
using CompanySystem.Application.Models.Breakdowns;
using CompanySystem.Application.Services;
using CompanySystem.Domain.Exceptions;
using CompanySystem.Shared.RequestFeatures;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CompanySystem.Web.Controllers
{
    [Route("api/breakdowns")]
    [ApiController]
    public class BreakdownController : ControllerBase
    {
        private readonly IBreakdownService _breakdowns;

        public BreakdownController(IBreakdownService breakdowns)
        {
            _breakdowns = breakdowns;
        }

        // Получить все с пагинацией (только для Админов)
        [HttpGet]
        [Authorize(Roles = "Admin,User,Employee")]
        public async Task<IActionResult> GetAllPagination([FromQuery] BreakdownParameters breakdownParameters)
        {
            try
            {
                var pagedResult = await _breakdowns.GetAllPaginationAsync(breakdownParameters);
                Response.Headers.Add("X-Pagination", JsonSerializer.Serialize(pagedResult.MetaData));
                return Ok(pagedResult);
            }
            catch (Exception)
            {
                return StatusCode(500, "Внутренняя ошибка сервера");
            }
        }

        // Получить все (без пагинации)
        [HttpGet("all")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> GetAll()
        {
            try
            {
                var all = await _breakdowns.GetAllAsync();
                return Ok(all);
            }
            catch (Exception)
            {
                return StatusCode(500, "Внутренняя ошибка сервера");
            }
        }

        // Получить поломки конкретного пользователя с пагинацией
        [HttpGet("user/{userId}")]
        [Authorize(Roles = "Admin,User")]
        public async Task<IActionResult> GetUserBreakdowns(long userId, [FromQuery] BreakdownParameters parameters)
        {
            if (userId <= 0)
                return BadRequest("Некорректный ID пользователя");

            try
            {
                var result = await _breakdowns.GetByUserAsync(userId, parameters);
                return Ok(result);
            }
            catch (Exception)
            {
                return StatusCode(500, "Внутренняя ошибка сервера");
            }
        }

        // Получить поломку по Id
        [HttpGet("{breakdownId:long}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> GetById(long breakdownId)
        {
            if (breakdownId <= 0)
                return BadRequest("Некорректный ID поломки");

            try
            {
                var breakdown = await _breakdowns.GetByIdAsync(breakdownId);
                return Ok(breakdown);
            }
            catch (EntityNotFoundException ex)
            {
                return NotFound(ex.Message);
            }
            catch (Exception)
            {
                return StatusCode(500, "Внутренняя ошибка сервера");
            }
        }

        // Создать поломку (для Админа)
        [HttpPost("admin")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> CreateByAdmin([FromBody] CreateBreakdownByAdminDto request)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            try
            {
                var created = await _breakdowns.CreateByAdminAsync(request);
                return CreatedAtAction(nameof(GetById), new { breakdownId = created.Id }, created);
            }
            catch (Exception)
            {
                return StatusCode(500, "Внутренняя ошибка сервера");
            }
        }

        // Создать поломку (для User)
        [HttpPost("user")]
        [Authorize(Roles = "User,Admin")]
        public async Task<IActionResult> CreateByUser([FromBody] CreateBreakdownByUserDto request)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            try
            {
                // Здесь можно получить текущего пользователя из контекста, если требуется
                var userIdClaim = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
                if (!long.TryParse(userIdClaim, out var userId))
                    return Unauthorized("Не удалось определить пользователя");

                var created = await _breakdowns.CreateByUserAsync(request, userId);
                return CreatedAtAction(nameof(GetById), new { breakdownId = created.Id }, created);
            }
            catch (Exception)
            {
                return StatusCode(500, "Внутренняя ошибка сервера");
            }
        }

        // Обновить поломку
        [HttpPut("{breakdownId:long}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Update(long breakdownId, [FromBody] UpdateBreakdownDto request)
        {
            if (breakdownId <= 0)
                return BadRequest("Некорректный ID поломки");

            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            try
            {
                var updated = await _breakdowns.UpdateAsync(breakdownId, request);
                return Ok(updated);
            }
            catch (EntityNotFoundException ex)
            {
                return NotFound(ex.Message);
            }
            catch (Exception)
            {
                return StatusCode(500, "Внутренняя ошибка сервера");
            }
        }

        // Обновить статус поломки сотрудником
        [HttpPatch("{breakdownId:long}/status")]
        [Authorize(Roles = "Employee,Admin")]
        public async Task<IActionResult> UpdateStatusByEmployee(long breakdownId, [FromBody] UpdateBreakdownStatusDto request)
        {
            if (breakdownId <= 0)
                return BadRequest("Некорректный ID поломки");

            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            try
            {
                var updated = await _breakdowns.UpdateStatusByEmployeeAsync(breakdownId, request);
                return Ok(updated);
            }
            catch (EntityNotFoundException ex)
            {
                return NotFound(ex.Message);
            }
            catch (Exception)
            {
                return StatusCode(500, "Внутренняя ошибка сервера");
            }
        }

        // Удалить поломку
        [HttpDelete("{breakdownId:long}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Delete(long breakdownId)
        {
            if (breakdownId <= 0)
                return BadRequest("Некорректный ID поломки");

            try
            {
                await _breakdowns.DeleteAsync(breakdownId);
                return NoContent();
            }
            catch (EntityNotFoundException ex)
            {
                return NotFound(ex.Message);
            }
            catch (Exception)
            {
                return StatusCode(500, "Внутренняя ошибка сервера");
            }
        }
    }
}
