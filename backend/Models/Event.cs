namespace backend.Models;

public class Event
{
    public int Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public DateTime Date { get; set; }
    
    public int LocationId { get; set; }
    public Location? Location { get; set; }

    public int CategoryId { get; set; }
    public EventCategory? Category { get; set; }

    public ICollection<EventTag>? EventTags { get; set; }
    public ICollection<EventPhoto>? Photos { get; set; }

    public int? CreatedByUserId { get; set; }
    public User? CreatedByUser { get; set; }
}
