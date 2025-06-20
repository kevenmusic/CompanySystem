using System.Text.Json;
using CompanySystem.Application.Abstarctions;
using CompanySystem.Application.Models.Departments;
using CompanySystem.Shared.RequestFeatures;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;

namespace CompanySystem.API.Controllers
{
    [ApiController]
    [Route("api/departments")]
    public class DepartmentsController(IDepartmentService departmentService, ILogger<DepartmentsController> logger) : ControllerBase
    {
        [HttpPost]
        public async Task<IActionResult> Create(CreateDepartmentDto dto)
        {
            if (!ModelState.IsValid)
            {
                logger.LogWarning("Создание отдела: неверные данные");
                return BadRequest(ModelState);
            }

            var created = await departmentService.Create(dto);
            logger.LogInformation("Создан отдел с ID {Id}", created.Id);
            return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
        }

        [HttpGet("{id:long}")]
        public async Task<IActionResult> GetById(long id)
        {
            var department = await departmentService.GetById(id);
            return Ok(department);
        }

        [HttpGet]
        public async Task<IActionResult> GetAll([FromQuery] DepartmentParameters departmentParameters)
        {
            var departments = await departmentService.GetAll(departmentParameters);
            Response.Headers.Add("X-Pagination", JsonSerializer.Serialize(departments.MetaData));
            return Ok(departments);
        }

        [HttpPut("{id:long}")]
        public async Task<IActionResult> Update(long id, UpdateDepartmentDto dto)
        {
            if (!ModelState.IsValid)
            {
                logger.LogWarning("Обновление отдела: неверные данные");
                return BadRequest(ModelState);
            }

            var updated = await departmentService.Update(id, dto);
            logger.LogInformation("Обновлен отдел с ID {Id}", updated.Id);
            return Ok(updated);
        }

        [HttpDelete("{id:long}")]
        public async Task<IActionResult> Delete(long id)
        {
            await departmentService.Delete(id);
            logger.LogInformation("Удален отдел с ID {Id}", id);
            return NoContent();
        }
    }
}
