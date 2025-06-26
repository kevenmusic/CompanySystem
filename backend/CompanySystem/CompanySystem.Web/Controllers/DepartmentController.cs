using System.Text.Json;
using CompanySystem.Application.Abstarctions;
using CompanySystem.Application.Models.Departments;
using CompanySystem.Shared.RequestFeatures;
using Microsoft.AspNetCore.Mvc;

namespace CompanySystem.API.Controllers
{
    [ApiController]
    [Route("api/departments")]
    public class DepartmentsController(IDepartmentService departmentService) : ControllerBase
    {
        [HttpGet("all")]
        public async Task<IActionResult> GetAll()
        {
            try
            {
                var employees = await departmentService.GetAll();
                return Ok(employees);
            }
            catch (Exception)
            {
                return StatusCode(500, "Внутренняя ошибка сервера");
            }
        }

        [HttpGet]
        public async Task<IActionResult> GetAllPagination([FromQuery] DepartmentParameters departmentParameters)
        {
            var departments = await departmentService.GetAllPagination(departmentParameters);
                Response.Headers.Add("X-Pagination", JsonSerializer.Serialize(departments.MetaData));
            return Ok(departments);
        }

        [HttpPost]
        public async Task<IActionResult> Create(CreateDepartmentDto dto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var created = await departmentService.Create(dto);
            return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
        }

        [HttpGet("{id:long}")]
        public async Task<IActionResult> GetById(long id)
        {
            var department = await departmentService.GetById(id);
            return Ok(department);
        }

        [HttpPut("{id:long}")]
        public async Task<IActionResult> Update(long id, UpdateDepartmentDto dto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var updated = await departmentService.Update(id, dto);
            return Ok(updated);
        }

        [HttpDelete("{id:long}")]
        public async Task<IActionResult> Delete(long id)
        {
            await departmentService.Delete(id);
            return NoContent();
        }
    }
}
