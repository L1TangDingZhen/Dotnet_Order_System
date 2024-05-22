using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using System.Threading.Tasks;

namespace Order.Controllers
{
    [Route("account")]
    public class AccountController : Controller
    {
        // 显示登录页面
        [HttpGet("login")]
        public IActionResult Login()
        {
            return View();
        }

        // 处理登录请求
        [HttpPost("login")]
        public async Task<IActionResult> Login(string username, string password)
        {
            // 这里您应该添加实际的用户验证逻辑
            if (username == "merchant" && password == "password")
            {
                var claims = new List<Claim>
                {
                    new Claim(ClaimTypes.Name, username)
                };

                var claimsIdentity = new ClaimsIdentity(claims, CookieAuthenticationDefaults.AuthenticationScheme);

                await HttpContext.SignInAsync(CookieAuthenticationDefaults.AuthenticationScheme, new ClaimsPrincipal(claimsIdentity));

                return RedirectToAction("Index", "Home");
            }

            return View();
        }

        // 处理注销请求
        [HttpGet("logout")]
        public async Task<IActionResult> Logout()
        {
            await HttpContext.SignOutAsync(CookieAuthenticationDefaults.AuthenticationScheme);
            return RedirectToAction("Login", "Account");
        }

        // register
        [HttpPost("register")]
        public async Task<IActionResult> Register(string username, string password)
        {
            // 这里您应该添加实际的用户注册逻辑
            if (username == "merchant" && password == "password")
            {
                var claims = new List<Claim>
                {
                    new Claim(ClaimTypes.Name, username)
                };

                var claimsIdentity = new ClaimsIdentity(claims, CookieAuthenticationDefaults.AuthenticationScheme);

                await HttpContext.SignInAsync(CookieAuthenticationDefaults.AuthenticationScheme, new ClaimsPrincipal(claimsIdentity));

                return RedirectToAction("Index", "Home");
            }

            return View();
        }
    }
}
