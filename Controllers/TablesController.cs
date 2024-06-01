using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Order.Data;
using Order.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Order.Controllers
{
	[ApiController]
	[Route("api/tables")]
	public class TablesController : ControllerBase
	{
		private readonly ApplicationDbContext _context;

		public TablesController(ApplicationDbContext context)
		{
			_context = context;
		}

		// GET: api/tables
		// all tabels
		[HttpGet]
		public async Task<ActionResult<IEnumerable<Table>>> GetTables()
		{
			return await _context.Tables.ToListAsync();
		}

		// GET: api/tables/{id}
		// specific table
		[HttpGet("{id}")]
		public async Task<ActionResult<Table>> GetTable(int id)
		{
			var table = await _context.Tables.FindAsync(id);

			if (table == null)
			{
				return NotFound();
			}

			return table;
		}

		// POST: api/tables
		// create table
		[HttpPost]
		public async Task<ActionResult<Table>> CreateTable(Table table)
		{
			_context.Tables.Add(table);
			await _context.SaveChangesAsync();

			return CreatedAtAction(nameof(GetTable), new { id = table.Id }, table);
		}

        // PUT: api/tables/{id}
        // upgrate table
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateTable(int id, Table table)
        {
            if (id != table.Id)
            {
                return BadRequest();
            }

            _context.Entry(table).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!_context.Tables.Any(t => t.Id == id))
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

        [HttpGet("{id}/latest-order")]
        public async Task<ActionResult<OrderItem>> GetLatestOrder(int id)
        {
            try
            {
                var latestOrder = await _context.OrderItems
                    .Include(o => o.Menu)
                    .Where(o => o.TableId == id)
                    .OrderByDescending(o => o.OrderTime)
                    .FirstOrDefaultAsync();

                if (latestOrder == null)
                {
                    return NotFound("No orders found for this table.");
                }

                return Ok(latestOrder);
            }
            catch (Exception ex)
            {
                // Log the exception (ex)
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }





        // DELETE: api/tables/{id}
        // delete table
        [HttpDelete("{id}")]
		public async Task<IActionResult> DeleteTable(int id)
		{
			var table = await _context.Tables.FindAsync(id);
			if (table == null)
			{
				return NotFound();
			} 

			_context.Tables.Remove(table);
			await _context.SaveChangesAsync();

			return NoContent();
		}

		private bool TableExists(int id)
		{
			return _context.Tables.Any(e => e.Id == id);
		}
	}
}
