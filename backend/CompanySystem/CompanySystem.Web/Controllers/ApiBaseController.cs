using CompanySystem.Web.Filters;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;

namespace CompanySystem.Web.Controllers
{
    [ApiController]
    [TypeFilter<ApiExceptionFilter>]
    public class ApiBaseController : ControllerBase
    {

    }
}
