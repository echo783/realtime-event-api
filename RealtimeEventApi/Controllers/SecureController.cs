using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace FactoryApi.Controllers
{
    [ApiController]
    [Route("api/secure")]
    public class SecureController : ControllerBase
    {
        [Authorize]
        [HttpGet("me")]
        public IActionResult Me()
        {
            var username = User.Identity?.Name ?? "알 수 없음";

            return Ok(new
            {
                message = "인증 성공",
                username = username
            });
        }
    }
}