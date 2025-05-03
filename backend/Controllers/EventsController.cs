using backend.Data;
using backend.Dtos;
using backend.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class EventsController : ControllerBase
{
    private readonly AppDbContext _context;

    public EventsController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    [HttpGet]
    public async Task<ActionResult<IEnumerable<EventDto>>> GetEvents()
    {
        var events = await _context
            .Events.Include(e => e.EventTags!)
            .ThenInclude(et => et.Tag)
            .Include(e => e.Location)
            .Include(e => e.Category)
            .Include(e => e.Photos)
            .ToListAsync();

        var eventDtos = events.Select(e => new EventDto
        {
            Id = e.Id,
            Title = e.Title,
            Date = e.Date,
            Description = e.Description,
            LocationId = e.LocationId,
            CategoryId = e.CategoryId,
            TagIds = e.EventTags?.Select(et => et.TagId).ToList() ?? new List<int>(),
            MainPhoto =
                e.Photos?.FirstOrDefault(p => p.IsMain) != null
                    ? new EventPhotoDto
                    {
                        Id = e.Photos.FirstOrDefault(p => p.IsMain)!.Id,
                        Url = e.Photos.FirstOrDefault(p => p.IsMain)!.Url,
                    }
                    : null,
            AdditionalPhotos =
                e.Photos?.Where(p => !p.IsMain)
                    .Select(p => new EventPhotoDto { Id = p.Id, Url = p.Url })
                    .ToList() ?? new List<EventPhotoDto>(),
            // MainPhotoUrl = e.Photos?.FirstOrDefault(p => p.IsMain)?.Url,
            // AdditionalPhotoUrls =
            //     e.Photos?.Where(p => !p.IsMain).Select(p => p.Url).ToList() ?? new(),
        });

        return Ok(eventDtos);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<Event>> GetEvent(int id)
    {
        var ev = await _context
            .Events.Include(e => e.EventTags)
            .FirstOrDefaultAsync(e => e.Id == id);

        if (ev == null)
            return NotFound();
        return ev;
    }

    [HttpPost]
    public async Task<ActionResult<Event>> CreateEvent(EventDto dto)
    {
        Console.WriteLine("Received tagIds: " + string.Join(", ", dto.TagIds));
        var ev = new Event
        {
            Title = dto.Title,
            Description = dto.Description,
            Date = dto.Date,
            LocationId = dto.LocationId,
            CategoryId = dto.CategoryId,
            CreatedByUserId = dto.CreatedByUserId,
            EventTags = new List<EventTag>(), // dodaj pustą listę i ręcznie powiąż tagi
        };

        foreach (var tagId in dto.TagIds)
        {
            ev.EventTags.Add(
                new EventTag
                {
                    TagId = tagId,
                    Event = ev, // <== to jest KLUCZOWE, żeby EF wiedział o relacji
                }
            );
        }

        _context.Events.Add(ev);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetEvent), new { id = ev.Id }, ev);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateEvent(int id, EventDto dto)
    {
        if (id != dto.Id)
            return BadRequest("ID mismatch");

        var ev = await _context
            .Events.Include(e => e.EventTags)
            .FirstOrDefaultAsync(e => e.Id == id);

        if (ev == null)
            return NotFound();

        ev.Title = dto.Title;
        ev.Description = dto.Description;
        ev.Date = dto.Date;
        ev.LocationId = dto.LocationId;
        ev.CategoryId = dto.CategoryId;
        ev.CreatedByUserId = dto.CreatedByUserId;

        // Usuń stare tagi
        _context.EventTags.RemoveRange(ev.EventTags ?? Enumerable.Empty<EventTag>());

        // Dodaj nowe tagi
        ev.EventTags = dto
            .TagIds.Select(tagId => new EventTag { TagId = tagId, EventId = id })
            .ToList();

        await _context.SaveChangesAsync();
        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteEvent(int id)
    {
        var ev = await _context
            .Events.Include(e => e.EventTags)
            .FirstOrDefaultAsync(e => e.Id == id);

        if (ev == null)
            return NotFound();

        _context.EventTags.RemoveRange(ev.EventTags ?? Enumerable.Empty<EventTag>());
        _context.Events.Remove(ev);
        await _context.SaveChangesAsync();
        return NoContent();
    }
}
