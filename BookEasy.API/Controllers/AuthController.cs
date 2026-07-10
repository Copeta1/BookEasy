using BookEasy.API.DTOs.Auth;
using BookEasy.API.Services;
using Microsoft.AspNetCore.Mvc;

namespace BookEasy.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly AuthService _authService;

        public AuthController(AuthService authService)
        {
            _authService = authService;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register(RegisterDto dto)
        {
            var result = await _authService.Register(dto);

            if (result == null)
                return BadRequest(new { message = "Email is already exists or passwords do not match." });

            return Ok(result);
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login(LoginDto dto)
        {
            var result = await _authService.Login(dto);

            if (result == null)
                return Unauthorized(new { message = "Invalid email or password." });

            return Ok(result);
        }

    }
}
