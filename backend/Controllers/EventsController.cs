// Dzięki using możesz korzystać z klas i funkcji z innych bibliotek bez pisania pełnej ścieżki.
using Microsoft.AspNetCore.Mvc;
using backend.Data;
using backend.Models;
using Microsoft.EntityFrameworkCore;

// Dzieki namespace moge organizowac klasy w inne namespacy nawet jesli maja te same nazwy,
// potem moge je zaimportowac uzywajac "using" dzieki czemu moge uzyc
// `Event newEvent =  new Event()`; zamiast `backend.Models.Event newEvent = new backend.Models.Event();`
namespace backend.Controllers;

// 🔧 Atrybut informujący, że to kontroler API (automatyczna walidacja, 400 itd.)
[ApiController]

// 📍 Routing endpointów np. api/events
[Route("api/[controller]")]
// Framework tworzy mapping: GET /api/events → EventsController.GetEvents()
public class EventsController : ControllerBase
{
    // 💾 Pole do komunikacji z bazą danych
    private readonly AppDbContext _context;

    // 🔨 Konstruktor z wstrzykiwaniem zależności (dependency injection)
    public EventsController(AppDbContext context)
    {
        _context = context;
    }

    // 📘 GET: /api/events
    // Zwraca wszystkie eventy z bazy
    [HttpGet]
    public async Task<ActionResult<IEnumerable<Event>>> GetEvents()
    {
        return await _context.Events.ToListAsync();
    }

    // 📘 GET: /api/events/{id}
    // Zwraca szczegóły konkretnego eventu po ID
    [HttpGet("{id}")]
    public async Task<ActionResult<Event>> GetEvent(int id)
    {
        var ev = await _context.Events.FindAsync(id);
        if (ev == null) return NotFound(); // 404 jeśli nie znaleziono
        return ev; // 200 OK + dane eventu
    }

    // 🟢 POST: /api/events
    // Tworzy nowy event
    [HttpPost]
    public async Task<ActionResult<Event>> CreateEvent(Event ev)
    {
        _context.Events.Add(ev); // dodajemy nowy obiekt do kontekstu
        await _context.SaveChangesAsync(); // zapisujemy do bazy
        return CreatedAtAction(nameof(GetEvent), new { id = ev.Id }, ev); // zwracamy 201 Created
    }

    // 🟡 PUT: /api/events/{id}
    // Aktualizuje istniejący event
    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateEvent(int id, Event ev)
    {
        if (id != ev.Id) return BadRequest(); // ID z URL musi się zgadzać z ID w obiekcie

        _context.Entry(ev).State = EntityState.Modified; // oznaczamy obiekt jako zmodyfikowany
        await _context.SaveChangesAsync(); // zapisujemy zmiany
        return NoContent(); // 204 No Content – operacja się powiodła, ale nic nie zwracamy
    }

    // 🔴 DELETE: /api/events/{id}
    // Usuwa event z bazy
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteEvent(int id)
    {
        var ev = await _context.Events.FindAsync(id);
        if (ev == null) return NotFound(); // jeśli nie znaleziono – 404

        _context.Events.Remove(ev); // usuwamy obiekt
        await _context.SaveChangesAsync(); // zapisujemy zmiany
        return NoContent(); // 204 No Content
    }
}
