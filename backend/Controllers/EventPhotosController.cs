using backend.Data;
using backend.Models;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class EventPhotosController : ControllerBase
{
    private readonly AppDbContext _context;
    private readonly IWebHostEnvironment _env;

    public EventPhotosController(AppDbContext context, IWebHostEnvironment env)
    {
        _context = context;
        _env = env;
    }

    [HttpPost("upload")]
    public async Task<IActionResult> UploadPhoto(
        [FromForm] IFormFile image,
        [FromForm] int eventId,
        [FromForm] bool isMain = false
    )
    {
        Console.WriteLine(
            $"Received file: {image?.FileName}, size: {image?.Length}, isMain: {isMain}, eventId: {eventId}"
        );
        if (image == null || image.Length == 0)
        {
            return BadRequest("No image file uploaded.");
        }

        var uploadsPath = Path.Combine(_env.WebRootPath, "uploads");

        if (!Directory.Exists(uploadsPath))
        {
            Directory.CreateDirectory(uploadsPath);
        }

        var fileName = $"{Guid.NewGuid()}{Path.GetExtension(image.FileName)}";
        var fullPath = Path.Combine(uploadsPath, fileName);
        var relativePath = $"/uploads/{fileName}";

        // Save file
        using (var stream = new FileStream(fullPath, FileMode.Create))
        {
            await image.CopyToAsync(stream);
        }

        // Create DB entry
        var photo = new EventPhoto
        {
            EventId = eventId,
            Url = relativePath,
            IsMain = isMain,
        };

        _context.EventPhotos.Add(photo);
        await _context.SaveChangesAsync();

        return Ok(photo);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeletePhoto(int id)
    {
        var photo = await _context.EventPhotos.FindAsync(id);
        if (photo == null)
            return NotFound();

        // Usuń fizyczny plik
        var fullPath = Path.Combine(_env.WebRootPath, photo.Url.TrimStart('/'));
        if (System.IO.File.Exists(fullPath))
            System.IO.File.Delete(fullPath);

        _context.EventPhotos.Remove(photo);
        await _context.SaveChangesAsync();

        return NoContent();
    }
}
