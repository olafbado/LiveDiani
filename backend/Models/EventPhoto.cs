namespace backend.Models;

public class EventPhoto
{
    public int Id { get; set; }
    public string Url { get; set; } = string.Empty;

    public int EventId { get; set; }
    public Event Event { get; set; } = null!;

    public bool IsMain { get; set; }
}
