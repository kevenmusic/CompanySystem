using System.Text.Json;
using CompanySystem.Application.Abstarctions;
using CompanySystem.Application.Models.Breakdowns;
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
        private readonly IBreakdownsService _breakdowns;
        private readonly ILogger<BreakdownController> _logger;

        public BreakdownController(IBreakdownsService breakdowns, ILogger<BreakdownController> logger)
        {
            _breakdowns = breakdowns;
            _logger = logger;
        }

        [HttpPost]
        [Authorize(Roles = "User,Admin")] // Allow both Users and Admins to create breakdowns
        public async Task<IActionResult> Create([FromBody] CreateBreakdownDto request)
        {
            if (!ModelState.IsValid)
            {
                _logger.LogWarning("Создание неисправности: неправильные данные запроса от пользователя {User}", User.Identity?.Name);
                return BadRequest(ModelState);
            }

            try
            {
                var result = await _breakdowns.Create(request);
                _logger.LogInformation("Неисправность создана с ID {Id} пользователем {User}", result.Id, User.Identity?.Name);
                return Ok(result);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Ошибка при создании неисправности пользователем {User}", User.Identity?.Name);
                return StatusCode(500, "Внутренняя ошибка сервера");
            }
        }

        [HttpGet("{breakdownId:long}")]
        [Authorize(Roles = "Admin")] // Only Admins can get a specific breakdown
        public async Task<IActionResult> GetById(long breakdownId)
        {
            try
            {
                var result = await _breakdowns.GetById(breakdownId);
                if (result == null)
                {
                    _logger.LogWarning("Неисправность с ID {Id} не найдена пользователем {User}", breakdownId, User.Identity?.Name);
                    return NotFound($"Неисправность с ID {breakdownId} не найдена");
                }
                _logger.LogInformation("Неисправность с ID {Id} получена пользователем {User}", breakdownId, User.Identity?.Name);
                return Ok(result);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Ошибка при получении неисправности с ID {Id} пользователем {User}", breakdownId, User.Identity?.Name);
                return StatusCode(500, "Внутренняя ошибка сервера");
            }
        }

        [HttpGet]
        [Authorize(Roles = "Admin")] // Only Admins can get all breakdowns
        public async Task<IActionResult> GetAll([FromQuery] BreakdownParameters breakdownParameters)
        {
            try
            {
                var pagedResult = await _breakdowns.GetAll(breakdownParameters);
                Response.Headers.Add("X-Pagination", JsonSerializer.Serialize(pagedResult.MetaData));
                _logger.LogInformation("Список неисправностей получен пользователем {User}", User.Identity?.Name);
                return Ok(pagedResult);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Ошибка при получении всех неисправностей пользователем {User}", User.Identity?.Name);
                return StatusCode(500, "Внутренняя ошибка сервера");
            }
        }

        [HttpPut("{breakdownId:long}")]
        [Authorize(Roles = "Admin")] // Only Admins can update breakdowns
        public async Task<IActionResult> Update(long breakdownId, UpdateBreakdownDto request)
        {
            if (!ModelState.IsValid)
            {
                _logger.LogWarning("Обновление неисправности: неправильные данные запроса от пользователя {User}", User.Identity?.Name);
                return BadRequest(ModelState);
            }

            try
            {
                var result = await _breakdowns.Update(breakdownId, request);
                _logger.LogInformation("Неисправность с ID {Id} обновлена пользователем {User}", breakdownId, User.Identity?.Name);
                return Ok(result);
            }
            catch (EntityNotFoundException ex)
            {
                _logger.LogWarning(ex, "Попытка обновить несуществующую неисправность с ID {Id} пользователем {User}", breakdownId, User.Identity?.Name);
                return NotFound(ex.Message);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Ошибка при обновлении неисправности с ID {Id} пользователем {User}", breakdownId, User.Identity?.Name);
                return StatusCode(500, "Внутренняя ошибка сервера");
            }
        }

        [HttpDelete("{breakdownId:long}")]
        [Authorize(Roles = "Admin")] // Only Admins can delete breakdowns
        public async Task<IActionResult> Delete(long breakdownId)
        {
            try
            {
                await _breakdowns.Delete(breakdownId);
                _logger.LogInformation("Неисправность с ID {Id} удалена пользователем {User}", breakdownId, User.Identity?.Name);
                return NoContent();
            }
            catch (KeyNotFoundException)
            {
                _logger.LogWarning("Попытка удалить несуществующую неисправность с ID {Id} пользователем {User}", breakdownId, User.Identity?.Name);
                return NotFound($"Неисправность с ID {breakdownId} не найдена");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Ошибка при удалении неисправности с ID {Id} пользователем {User}", breakdownId, User.Identity?.Name);
                return StatusCode(500, "Внутренняя ошибка сервера");
            }
        }
    }
}