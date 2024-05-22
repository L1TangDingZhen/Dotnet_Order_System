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
    [Route("api/merchant/order")]
    public class MerchantOrderController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public MerchantOrderController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/merchant/order
        [HttpGet]
        public async Task<ActionResult<IEnumerable<OrderItem>>> GetOrders()
        {
            return await _context.OrderItems.Include(o => o.Menu).ToListAsync();
        }

        // GET: api/merchant/order/{id}
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

        // PUT: api/merchant/order/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateOrder(int id, OrderItem order)
        {
            if (id != order.Id)
            {
                return BadRequest();
            }
            _context.Entry(order).State = EntityState.Modified;
            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!_context.OrderItems.Any(e => e.Id == id))
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

        // DELETE: api/merchant/order/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteOrder(int id)
        {
            var order = await _context.OrderItems.FindAsync(id);
            if (order == null)
            {
                return NotFound();
            }
            _context.OrderItems.Remove(order);
            await _context.SaveChangesAsync();
            return NoContent();
        }

        // GET: api/merchant/order/table/{tableNumber}
        [HttpGet("table/{tableNumber}")]
        public async Task<ActionResult<IEnumerable<OrderItem>>> GetOrdersByTable(int tableNumber)
        {
            var orders = await _context.OrderItems.Include(o => o.Menu).Where(o => o.TableNumber == tableNumber && !o.IsPaid).ToListAsync();
            if (orders == null || orders.Count == 0)
            {
                return NotFound();
            }
            return orders;
        }

        // POST: api/merchant/order/settle/{tableNumber}
        [HttpPost("settle/{tableNumber}")]
        public async Task<IActionResult> SettleTable(int tableNumber)
        {
            var orders = await _context.OrderItems.Where(o => o.TableNumber == tableNumber && !o.IsPaid).ToListAsync();
            if (orders == null || orders.Count == 0)
            {
                return NotFound();
            }

            foreach (var order in orders)
            {
                order.IsPaid = true;
            }

            await _context.SaveChangesAsync();
            return NoContent();
        }

        // GET: api/merchant/order/unpaid
        [HttpGet("unpaid")]
        public async Task<ActionResult<IEnumerable<OrderItem>>> GetUnpaidOrders()
        {
            var orders = await _context.OrderItems.Include(o => o.Menu).Where(o => !o.IsPaid).ToListAsync();
            return orders;
        }

        // GET: api/merchant/order/table/unpaid/{tableNumber}
        [HttpGet("table/unpaid/{tableNumber}")]
        public async Task<ActionResult<IEnumerable<OrderItem>>> GetOrderByTable(int tableNumber)
        {
            var orders = await _context.OrderItems.Include(o => o.Menu).Where(o => o.TableNumber == tableNumber && !o.IsPaid).ToListAsync();
            if (orders == null || orders.Count == 0)
            {
                return NotFound();
            }
            return orders;
        }
    }
}
