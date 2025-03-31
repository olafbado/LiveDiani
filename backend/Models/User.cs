namespace backend.Models;

public class User
{
    public int Id { get; set; }
    public string Username { get; set; } = string.Empty;
    public string? Email { get; set; }
    public string? Role { get; set; } // "admin", "organizer", "user"

    public ICollection<Event>? CreatedEvents { get; set; }
    public ICollection<FavoriteEvent>? FavoriteEvents { get; set; }
}
