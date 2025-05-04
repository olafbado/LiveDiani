namespace backend.Models;

public class User
{
    public int Id { get; set; }
    public string Username { get; set; }
    public string Email { get; set; }
    public string PasswordHash { get; set; }
    public string Role { get; set; } = "user";

    public ICollection<Event>? CreatedEvents { get; set; }
    public ICollection<FavoriteEvent>? FavoriteEvents { get; set; }
}
