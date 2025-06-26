using CompanySystem.Application.Abstarctions;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CompanySystem.API.Controllers
{
    [Route("api/users")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private readonly IUserService userService;

        public UsersController(IUserService userService)
        {
            this.userService = userService;
        }

        [HttpGet]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> GetAllUsers()
        {
            var users = await userService.GetAllUsersAsync();
            return Ok(users);
        }

        [HttpGet("employees")]
        [Authorize(Roles = "Admin,Employee")]
        public async Task<IActionResult> GetAllEmployees()
        {
            var employees = await userService.GetAllEmployeesAsync();
            return Ok(employees);
        }


        [HttpGet("{id:long}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> GetUserById(long id)
        {
            var user = await userService.GetById(id);
            return Ok(user);
        }

        // Новый метод — получение поломок сотрудника по userId
        [HttpGet("{id:long}/breakdowns")]
        [Authorize(Roles = "Admin,Employee")]
        public async Task<IActionResult> GetBreakdownsByUserId(long id)
        {
            try
            {
                var breakdowns = await userService.GetBreakdownsByUserId(id);
                return Ok(breakdowns);
            }
            catch (Exception ex)
            {
                // Можно сделать более тонкую обработку исключений
                return NotFound(new { message = ex.Message });
            }
        }
    }
}
