using System.Text.Json;
using CompanySystem.Application.Models.Employees;
using CompanySystem.Domain.Exceptions;
using CompanySystem.Shared.RequestFeatures;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CompanySystem.Web.Controllers
{
    [Route("api/employees")]
    [ApiController]
    public class EmployeesController : ControllerBase
    {
        private readonly IEmployeeService _employeeService;
        private readonly ILogger<EmployeesController> _logger;

        public EmployeesController(IEmployeeService employeeService, ILogger<EmployeesController> logger)
        {
            _employeeService = employeeService;
            _logger = logger;
        }

        [HttpPost]
        [Authorize]
        public async Task<IActionResult> Create(CreateEmployeeDto employeeDto)
        {
            if (!ModelState.IsValid)
            {
                _logger.LogWarning("Создание сотрудника: неверные данные запроса");
                return BadRequest(ModelState);
            }

            try
            {
                var createdEmployee = await _employeeService.Create(employeeDto);
                _logger.LogInformation("Сотрудник создан с ID {Id}", createdEmployee.Id);
                return Ok(createdEmployee);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Ошибка при создании сотрудника");
                return StatusCode(500, "Внутренняя ошибка сервера");
            }
        }

        [HttpGet("{id:long}")]
        public async Task<IActionResult> GetById(long id)
        {
            try
            {
                var employee = await _employeeService.GetById(id);
                if (employee == null)
                {
                    return NotFound($"Сотрудник с ID {id} не найден");
                }
                return Ok(employee);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Ошибка при получении сотрудника с ID {Id}", id);
                return StatusCode(500, "Внутренняя ошибка сервера");
            }
        }

        [HttpGet]
        public async Task<IActionResult> GetAllPagination([FromQuery] EmployeeParameters employeeParameters)
        {
            try
            {
                var employees = await _employeeService.GetAllPagination(employeeParameters);
                Response.Headers.Add("X-Pagination", JsonSerializer.Serialize(employees.MetaData));
                return Ok(employees);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Ошибка при получении списка сотрудников");
                return StatusCode(500, "Внутренняя ошибка сервера");
            }
        }

        [HttpGet("all")]
        public async Task<IActionResult> GetAll()
        {
            try
            {
                var employees = await _employeeService.GetAll();
                return Ok(employees);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Ошибка при получении полного списка сотрудников");
                return StatusCode(500, "Внутренняя ошибка сервера");
            }
        }

        [HttpPut("{id:long}")]
        [Authorize]
        public async Task<IActionResult> Update(long id, UpdateEmployeeDto employeeDto)
        {
            if (!ModelState.IsValid)
            {
                _logger.LogWarning("Обновление сотрудника: неверные данные запроса");
                return BadRequest(ModelState);
            }

            try
            {
                var updatedEmployee = await _employeeService.Update(id, employeeDto);

                if (updatedEmployee == null)
                {
                    _logger.LogWarning("Сотрудник с ID {Id} не найден для обновления", id);
                    return NotFound($"Сотрудник с ID {id} не найден");
                }

                _logger.LogInformation("Сотрудник с ID {Id} успешно обновлен", id);
                return Ok(updatedEmployee);
            }
            catch (EntityNotFoundException ex)
            {
                _logger.LogWarning(ex, "Ошибка при обновлении сотрудника с ID {Id}: не найдено", id);
                return NotFound(ex.Message);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Внутренняя ошибка при обновлении сотрудника с ID {Id}", id);
                return StatusCode(500, "Внутренняя ошибка сервера");
            }
        }

        [HttpGet("{id:long}/breakdowns")]
        [Authorize]
        public async Task<IActionResult> GetBreakdownsForEmployee(long id)
        {
            try
            {
                // Получаем список поломок сотрудника
                var breakdowns = await _employeeService.GetBreakdownsForEmployee(id);
                return Ok(breakdowns);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Ошибка при получении поломок для сотрудника с ID {Id}", id);
                return StatusCode(500, "Внутренняя ошибка сервера");
            }
        }

        [HttpDelete("{id:long}")]
        [Authorize]
        public async Task<IActionResult> Delete(long id)
        {
            try
            {
                await _employeeService.Delete(id);
                _logger.LogInformation("Сотрудник с ID {Id} удален", id);
                return NoContent();
            }
            catch (KeyNotFoundException)
            {
                _logger.LogWarning("Попытка удалить несуществующего сотрудника с ID {Id}", id);
                return NotFound($"Сотрудник с ID {id} не найден");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Ошибка при удалении сотрудника с ID {Id}", id);
                return StatusCode(500, "Внутренняя ошибка сервера");
            }
        }
    }
}
