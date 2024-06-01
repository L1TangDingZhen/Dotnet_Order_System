using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Order.Data;
using Order.Models;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;

namespace Order.Controllers
{
    [ApiController]
    [Route("api/merchant/menu")]
    public class MerchantMenuController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly IWebHostEnvironment _env;

        public MerchantMenuController(ApplicationDbContext context, IWebHostEnvironment env)
        {
            _context = context;
            _env = env;
        }

        // GET: api/merchant/menu
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Menu>>> GetMenus()
        {
            return await _context.Menus.ToListAsync();
        }

        // GET: api/merchant/menu/{id}
        [HttpGet("{id}")]
        public async Task<ActionResult<Menu>> GetMenu(int id)
        {
            var menu = await _context.Menus.FindAsync(id);

            if (menu == null)
            {
                return NotFound();
            }

            return menu;
        }

        // POST: api/merchant/menu
        [HttpPost]
        public async Task<ActionResult<Menu>> CreateMenu([FromForm] Menu menu)
        {
            if (menu.ImageFile != null && menu.ImageFile.Length > 0)
            {
                var uploads = Path.Combine(_env.WebRootPath, "uploads");
                var filePath = Path.Combine(uploads, menu.ImageFile.FileName);

                using (var fileStream = new FileStream(filePath, FileMode.Create))
                {
                    await menu.ImageFile.CopyToAsync(fileStream);
                }

                menu.ImagePath = $"/uploads/{menu.ImageFile.FileName}";
            }

            _context.Menus.Add(menu);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetMenu), new { id = menu.Id }, menu);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateMenu(int id, [FromForm] Menu menu)
        {
            if (id != menu.Id)
            {
                return BadRequest();
            }

            if (menu.ImageFile != null && menu.ImageFile.Length > 0)
            {
                var uploads = Path.Combine(_env.WebRootPath, "uploads");
                var filePath = Path.Combine(uploads, menu.ImageFile.FileName);

                using (var fileStream = new FileStream(filePath, FileMode.Create))
                {
                    await menu.ImageFile.CopyToAsync(fileStream);
                }

                menu.ImagePath = $"/uploads/{menu.ImageFile.FileName}";
            }

            _context.Entry(menu).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!_context.Menus.Any(e => e.Id == id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }


        // DELETE: api/merchant/menu/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteMenu(int id)
        {
            var menu = await _context.Menus.FindAsync(id);
            if (menu == null)
            {
                return NotFound();
            }

            _context.Menus.Remove(menu);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        // GET: api/merchant/menu/categories
        [HttpGet("categories")]
        public async Task<ActionResult<IEnumerable<string>>> GetCategories()
        {
            var categories = await _context.Menus.Select(m => m.Category).Distinct().ToListAsync();
            return categories;
        }
    }
}
