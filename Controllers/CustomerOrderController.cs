using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Order.Data;
using Order.Models;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Order.Controllers
{
    [ApiController]
    [Route("api/customer/order")]
    public class CustomerOrderController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public CustomerOrderController(ApplicationDbContext context)
        {
            _context = context;
        }

        //Get: api/customer/order/menu
        [HttpGet("menu")]
        public async Task<ActionResult<IEnumerable<Menu>>> GetMenus()
        {
            return await _context.Menus.Where(m => m.IsAvailable).ToListAsync();
        }

        //Post: api/customer/order
        [HttpPost]
        public async Task<ActionResult<OrderItem>> CreateOrder(OrderItem order)
        {
            _context.OrderItems.Add(order);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetOrder), new { id = order.Id }, order);
        }

        //Get: api/customer/order/
        [HttpGet("{id}")]
        public async Task<ActionResult<OrderItem>> GetOrder(int id)
        {
            var order = await _context.OrderItems.Include(o => o.Menu).FirstOrDefaultAsync(o => o.Id == id);

            if (order == null)
            {
                return NotFound();
            }

            return order;

        }
    }
}
