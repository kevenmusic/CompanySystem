using CompanySystem.Application.Abstarctions;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CompanySystem.API.Controllers
{
    [Route("api/users")]
    [ApiController]
    public class UsersController(IUserService userService) : ControllerBase
    {
        [HttpGet]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> GetAllUsers()
        {
            var users = await userService.GetAllUsersAsync();
            return Ok(users);
        }

        [HttpGet("{id:long}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> GetUserById(long id)
        {
            var user = await userService.GetById(id);
            return Ok(user);
        }
    }
}
