using backend.Data;
using backend.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class FavoriteEventsController : ControllerBase
{
    private readonly AppDbContext _context;

    public FavoriteEventsController(AppDbContext context)
    {
        _context = context;
    }

    // GET: api/FavoriteEvents
    [HttpGet]
    public async Task<ActionResult<IEnumerable<FavoriteEvent>>> GetFavoriteEvents()
    {
        return await _context.FavoriteEvents
            .Include(fe => fe.User)
            .Include(fe => fe.Event)
            .ToListAsync();
    }

    // GET: api/FavoriteEvents/user/5
    [HttpGet("user/{userId}")]
    public async Task<ActionResult<IEnumerable<FavoriteEvent>>> GetUserFavorites(int userId)
    {
        var favorites = await _context.FavoriteEvents
            .Include(fe => fe.Event)
            .ThenInclude(e => e.Location)
            .Include(fe => fe.Event)
            .ThenInclude(e => e.Category)
            .Include(fe => fe.Event)
            .ThenInclude(e => e.Photos)
            .Where(fe => fe.UserId == userId)
            .ToListAsync();

        return favorites;
    }

    // POST: api/FavoriteEvents
    [HttpPost]
    public async Task<ActionResult<FavoriteEvent>> AddFavorite(FavoriteEvent favoriteEvent)
    {
        // Check if the favorite already exists
        var exists = await _context.FavoriteEvents
            .AnyAsync(fe => fe.UserId == favoriteEvent.UserId && fe.EventId == favoriteEvent.EventId);

        if (exists)
        {
            return BadRequest("This event is already in favorites");
        }

        _context.FavoriteEvents.Add(favoriteEvent);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetUserFavorites), new { userId = favoriteEvent.UserId }, favoriteEvent);
    }

    // DELETE: api/FavoriteEvents/user/5/event/10
    [HttpDelete("user/{userId}/event/{eventId}")]
    public async Task<IActionResult> RemoveFavorite(int userId, int eventId)
    {
        var favoriteEvent = await _context.FavoriteEvents
            .FirstOrDefaultAsync(fe => fe.UserId == userId && fe.EventId == eventId);

        if (favoriteEvent == null)
        {
            return NotFound();
        }

        _context.FavoriteEvents.Remove(favoriteEvent);
        await _context.SaveChangesAsync();

        return NoContent();
    }

    // Check if an event is favorited by a user
    [HttpGet("user/{userId}/event/{eventId}")]
    public async Task<ActionResult<bool>> IsFavorite(int userId, int eventId)
    {
        var exists = await _context.FavoriteEvents
            .AnyAsync(fe => fe.UserId == userId && fe.EventId == eventId);

        return exists;
    }
}