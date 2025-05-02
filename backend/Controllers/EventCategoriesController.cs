using Microsoft.AspNetCore.Mvc;
using backend.Data;
using backend.Models;
using Microsoft.EntityFrameworkCore;

namespace backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class EventCategoriesController : ControllerBase
{
    private readonly AppDbContext _context;

    public EventCategoriesController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<EventCategory>>> GetCategories()
    {
        return await _context.EventCategories.ToListAsync();
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<EventCategory>> GetCategory(int id)
    {
        var category = await _context.EventCategories.FindAsync(id);
        if (category == null) return NotFound();
        return category;
    }

    [HttpPost]
    public async Task<ActionResult<EventCategory>> CreateCategory(EventCategory category)
    {
        _context.EventCategories.Add(category);
        await _context.SaveChangesAsync();
        return CreatedAtAction(nameof(GetCategory), new { id = category.Id }, category);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateCategory(int id, EventCategory category)
    {
        if (id != category.Id) return BadRequest();
        _context.Entry(category).State = EntityState.Modified;
        await _context.SaveChangesAsync();
        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteCategory(int id)
    {
        var category = await _context.EventCategories.FindAsync(id);
        if (category == null) return NotFound();
        _context.EventCategories.Remove(category);
        await _context.SaveChangesAsync();
        return NoContent();
    }
}
