using Microsoft.AspNetCore.Mvc;
using backend.Data;
using backend.Models;
using Microsoft.EntityFrameworkCore;

namespace backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class TagsController : ControllerBase
{
    private readonly AppDbContext _context;

    public TagsController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<Tag>>> GetTags()
    {
        return await _context.Tags.ToListAsync();
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<Tag>> GetTag(int id)
    {
        var tag = await _context.Tags.FindAsync(id);
        if (tag == null) return NotFound();
        return tag;
    }

    [HttpPost]
    public async Task<ActionResult<Tag>> CreateTag(Tag tag)
    {
        _context.Tags.Add(tag);
        await _context.SaveChangesAsync();
        return CreatedAtAction(nameof(GetTag), new { id = tag.Id }, tag);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateTag(int id, Tag tag)
    {
        if (id != tag.Id) return BadRequest();
        _context.Entry(tag).State = EntityState.Modified;
        await _context.SaveChangesAsync();
        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteTag(int id)
    {
        Console.WriteLine($"Deleting tag with ID: {id}");
        var tag = await _context.Tags.FindAsync(id);
        if (tag == null) return NotFound();

        _context.Tags.Remove(tag);
        await _context.SaveChangesAsync();
        return NoContent();
    }
}
