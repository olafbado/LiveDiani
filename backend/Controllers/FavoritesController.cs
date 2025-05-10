using System.Security.Claims;
using backend.Data;
using backend.Dtos;
using backend.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class FavoritesController : ControllerBase
{
    private readonly AppDbContext _context;

    public FavoritesController(AppDbContext context)
    {
        _context = context;
    }

    private int GetUserId()
    {
        return int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<EventDto>>> GetFavorites()
    {
        var userId = GetUserId();

        var favorites = await _context
            .FavoriteEvents.Where(f => f.UserId == userId)
            .Include(f => f.Event)!
            .ThenInclude(e => e.Location)
            .Include(f => f.Event)!
            .ThenInclude(e => e.Category)
            .Include(f => f.Event)!
            .ThenInclude(e => e.EventTags!)
            .ThenInclude(et => et.Tag)
            .Include(f => f.Event)!
            .ThenInclude(e => e.Photos)
            .Select(f => f.Event)
            .ToListAsync();

        var favoriteDtos = favorites.Select(e => new EventDto
        {
            Id = e.Id,
            Title = e.Title,
            Description = e.Description,
            Date = e.Date,
            LocationId = e.LocationId,
            CategoryId = e.CategoryId,
            TagIds = e.EventTags!.Select(et => et.TagId).ToList(),
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
                    .ToList() ?? new(),
        });

        return Ok(favoriteDtos);
    }

    [HttpPost("{eventId}")]
    public async Task<IActionResult> AddFavorite(int eventId)
    {
        var userId = GetUserId();

        if (await _context.FavoriteEvents.AnyAsync(f => f.UserId == userId && f.EventId == eventId))
            return BadRequest("Already favorited.");

        var favorite = new FavoriteEvent { UserId = userId, EventId = eventId };

        _context.FavoriteEvents.Add(favorite);
        await _context.SaveChangesAsync();

        return Ok(new { message = "Added to favorites." });
    }

    [HttpDelete("{eventId}")]
    public async Task<IActionResult> RemoveFavorite(int eventId)
    {
        var userId = GetUserId();

        var fav = await _context.FavoriteEvents.FirstOrDefaultAsync(f =>
            f.UserId == userId && f.EventId == eventId
        );

        if (fav == null)
            return NotFound();

        _context.FavoriteEvents.Remove(fav);
        await _context.SaveChangesAsync();

        return Ok(new { message = "Removed from favorites." });
    }

    [HttpGet("check/{eventId}")]
    public async Task<IActionResult> IsFavorite(int eventId)
    {
        var userId = GetUserId();
        var exists = await _context.FavoriteEvents.AnyAsync(f =>
            f.UserId == userId && f.EventId == eventId
        );
        return Ok(new { isFavorite = exists });
    }
}
