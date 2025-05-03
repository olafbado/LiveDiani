using backend.Data;
using backend.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class EventTagsController : ControllerBase
{
    private readonly AppDbContext _context;

    public EventTagsController(AppDbContext context)
    {
        _context = context;
    }

    // GET: api/EventTags
    [HttpGet]
    public async Task<ActionResult<IEnumerable<EventTag>>> GetEventTags()
    {
        return await _context.EventTags
            .Include(et => et.Event)
            .Include(et => et.Tag)
            .ToListAsync();
    }

    // GET: api/EventTags/event/5
    [HttpGet("event/{eventId}")]
    public async Task<ActionResult<IEnumerable<EventTag>>> GetEventTagsByEvent(int eventId)
    {
        var eventTags = await _context.EventTags
            .Include(et => et.Tag)
            .Where(et => et.EventId == eventId)
            .ToListAsync();

        return eventTags;
    }

    // GET: api/EventTags/tag/5
    [HttpGet("tag/{tagId}")]
    public async Task<ActionResult<IEnumerable<EventTag>>> GetEventTagsByTag(int tagId)
    {
        var eventTags = await _context.EventTags
            .Include(et => et.Event)
            .Where(et => et.TagId == tagId)
            .ToListAsync();

        return eventTags;
    }

    // POST: api/EventTags
    [HttpPost]
    public async Task<ActionResult<EventTag>> AddEventTag(EventTag eventTag)
    {
        // Check if the relationship already exists
        var exists = await _context.EventTags
            .AnyAsync(et => et.EventId == eventTag.EventId && et.TagId == eventTag.TagId);

        if (exists)
        {
            return BadRequest("This tag is already associated with the event");
        }

        _context.EventTags.Add(eventTag);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetEventTagsByEvent), new { eventId = eventTag.EventId }, eventTag);
    }

    // DELETE: api/EventTags/event/5/tag/10
    [HttpDelete("event/{eventId}/tag/{tagId}")]
    public async Task<IActionResult> RemoveEventTag(int eventId, int tagId)
    {
        var eventTag = await _context.EventTags
            .FirstOrDefaultAsync(et => et.EventId == eventId && et.TagId == tagId);

        if (eventTag == null)
        {
            return NotFound();
        }

        _context.EventTags.Remove(eventTag);
        await _context.SaveChangesAsync();

        return NoContent();
    }
}