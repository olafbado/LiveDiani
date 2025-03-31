namespace backend.Models;

public class Tag
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;

    public ICollection<EventTag>? EventTags { get; set; }
}
