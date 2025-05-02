using Microsoft.AspNetCore.Mvc;
using backend.Data;
using backend.Models;
using Microsoft.EntityFrameworkCore;

namespace backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class LocationsController : ControllerBase
{
    private readonly AppDbContext _context;

    public LocationsController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<Location>>> GetLocations()
    {
        return await _context.Locations.ToListAsync();
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<Location>> GetLocation(int id)
    {
        var loc = await _context.Locations.FindAsync(id);
        if (loc == null) return NotFound();
        return loc;
    }

    [HttpPost]
    public async Task<ActionResult<Location>> CreateLocation(Location loc)
    {
        _context.Locations.Add(loc);
        await _context.SaveChangesAsync();
        return CreatedAtAction(nameof(GetLocation), new { id = loc.Id }, loc);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateLocation(int id, Location loc)
    {
        if (id != loc.Id) return BadRequest();
        _context.Entry(loc).State = EntityState.Modified;
        await _context.SaveChangesAsync();
        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteLocation(int id)
    {
        var loc = await _context.Locations.FindAsync(id);
        if (loc == null) return NotFound();
        _context.Locations.Remove(loc);
        await _context.SaveChangesAsync();
        return NoContent();
    }
}
