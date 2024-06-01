using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using Order.Models;
using Order.Data;


namespace Order.Controllers
{
    [ApiController]
    [Route("api/account")]
    [EnableCors("AllowAllOrigins")] // 添加 CORS 策略

    public class AccountController : ControllerBase
    {
        private readonly UserManager<IdentityUser> _userManager;
        private readonly SignInManager<IdentityUser> _signInManager;

        public AccountController(UserManager<IdentityUser> userManager, SignInManager<IdentityUser> signInManager)
        {
            _userManager = userManager;
            _signInManager = signInManager;
        }

        [HttpPost("register")]

        public async Task<IActionResult> Register([FromBody] RegisterModel model)
        {
            var user = new IdentityUser { UserName = model.Username };
            var result = await _userManager.CreateAsync(user, model.Password);
            if (result.Succeeded)
            {
                return Ok(new { message = "User registered successfully." });
            }

            return BadRequest(new { errors = result.Errors });
        }

        [HttpOptions("login")]
        public IActionResult HandleOptionsRequest()
        {
            Response.Headers["Access-Control-Allow-Origin"] = "*";
            Response.Headers["Access-Control-Allow-Methods"] = "POST";
            Response.Headers["Access-Control-Allow-Headers"] = "Content-Type";
            return NoContent();
        }


        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginModel model)
        {
            var result = await _signInManager.PasswordSignInAsync(model.Username, model.Password, false, false);
            if (result.Succeeded)
            {
                Response.Headers["Access-Control-Allow-Origin"] = "http://localhost:3001";
                return Ok(new { message = "User logged in successfully." });
            }

            Response.Headers["Access-Control-Allow-Origin"] = "http://localhost:3001";
            return Unauthorized(new { error = "Invalid username or password." });
        }
    }
}
