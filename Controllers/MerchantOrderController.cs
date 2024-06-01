using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Order.Data;
using Order.Models;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Order.Controllers
{
    //[ApiController]
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
        public async Task<ActionResult<OrderItem>> GetOrderById(int id)
        {
            var orderItem = await _context.OrderItems.Include(o => o.Menu).FirstOrDefaultAsync(o => o.Id == id);

            if (orderItem == null)
            {
                return NotFound();
            }

            return orderItem;
        }

        // POST: api/merchant/order
        [HttpPost]
        public async Task<ActionResult<OrderItem>> Create(OrderItem orderItem)
        {
            _context.OrderItems.Add(orderItem);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetOrderById), new { id = orderItem.Id }, orderItem);
        }

        // PUT: api/merchant/order/update/{id}
        [HttpPut("update/{id}")]
        public async Task<IActionResult> Update(int id, OrderItem orderItem)
        {
            if (id != orderItem.Id)
            {
                return BadRequest();
            }

            _context.Entry(orderItem).State = EntityState.Modified;

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

        // DELETE: api/merchant/order/delete/{id}]
        [HttpDelete("delete/{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var orderItem = await _context.OrderItems.FindAsync(id);
            if (orderItem == null)
            {
                return NotFound();
            }

            _context.OrderItems.Remove(orderItem);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        // PUT: api/merchant/order/{id}/pay
        [HttpPut("{id}/pay")]
        public async Task<IActionResult> Pay(int id)
        {
            var orderItem = await _context.OrderItems.FindAsync(id);
            if (orderItem == null)
            {
                return NotFound();
            }

            orderItem.IsPaid = true;
            await _context.SaveChangesAsync();

            return NoContent();
        }

        // DELETE: api/merchant/order/cancel/{id}
        [HttpDelete("cancel/{id}")]
        public async Task<IActionResult> Cancel(int id)
        {
            var orderItem = await _context.OrderItems.FindAsync(id);
            if (orderItem == null)
            {
                return NotFound();
            }

            _context.OrderItems.Remove(orderItem);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}