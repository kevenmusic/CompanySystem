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

        public EmployeesController(IEmployeeService employeeService)
        {
            _employeeService = employeeService;
        }

        // Доступ для всех (например, анонимных или авторизованных)
        [HttpGet("all")]
        [Authorize(Roles = "Admin,Employee,User")]
        public async Task<IActionResult> GetAll()
        {
            var employees = await _employeeService.GetAll();
            return Ok(employees);
        }

        [HttpGet]
        [Authorize(Roles = "Admin,Employee,User")]   
        public async Task<IActionResult> GetAllPagination([FromQuery] EmployeeParameters employeeParameters)
        {
            var employees = await _employeeService.GetAllPagination(employeeParameters);
            Response.Headers.Add("X-Pagination", JsonSerializer.Serialize(employees.MetaData));
            return Ok(employees);
        }


        // Только для Employee и Admin
        [HttpPost]
        [Authorize(Roles = "Admin,Employee")]
        public async Task<IActionResult> Create(CreateEmployeeDto employeeDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var createdEmployee = await _employeeService.Create(employeeDto);
            return Ok(createdEmployee);
        }

        [HttpGet("{id:long}")]
        public async Task<IActionResult> GetById(long id)
        {
            var employee = await _employeeService.GetById(id);
            if (employee == null)
            {
                return NotFound($"Сотрудник с ID {id} не найден");
            }
            return Ok(employee);
        }
        [HttpPut("{id:long}")]
        [Authorize(Roles = "Admin,Employee")]
        public async Task<IActionResult> Update(long id, UpdateEmployeeDto employeeDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                var updatedEmployee = await _employeeService.Update(id, employeeDto);
                return Ok(updatedEmployee);
            }
            catch (EntityNotFoundException ex)
            {
                return NotFound(new { message = ex.Message });
            }
            catch (InvalidOperationException ex)
            {
                return Conflict(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                // Можно добавить логирование ошибки
                return StatusCode(500, new { message = "Внутренняя ошибка сервера" });
            }
        }


        [HttpGet("employees-with-role")]
        [Authorize(Roles = "Admin,Employee,User")]
        public async Task<IActionResult> GetAllEmployeesWithEmployeeRole()
        {
            var employees = await _employeeService.GetAllEmployeesWithEmployeeRoleAsync();
            return Ok(employees);
        }

        // Только для Employee и Admin
        [HttpDelete("{id:long}")]
        [Authorize(Roles = "Admin,Employee")]
        public async Task<IActionResult> Delete(long id)
        {
            try
            {
                await _employeeService.Delete(id);
                return NoContent();
            }
            catch (KeyNotFoundException)
            {
                return NotFound($"Сотрудник с ID {id} не найден");
            }
        }
    }
}
