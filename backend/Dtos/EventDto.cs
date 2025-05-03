// DTO = Data Transfer Object
// Klasa pomocnicza służąca do odbierania i przekazywania danych przez API,
// oddzielona od wewnętrznego modelu bazy danych (Event).
//
// Zalety używania DTO:
// ✅ Chroni model przed przypadkową modyfikacją (np. relacji)
// ✅ Pozwala kontrolować, które dane przyjmujemy z zewnątrz
// ✅ Ułatwia walidację i modyfikację danych bez zmieniania modelu bazy
// ✅ Uniezależnia strukturę API od struktury bazy danych

using backend.Models;

namespace backend.Dtos;

public class EventDto
{
    public int Id { get; set; }
    public string Title { get; set; } = "";
    public string Description { get; set; } = "";
    public DateTime Date { get; set; }
    public int LocationId { get; set; }
    public Location? Location { get; set; }
    public int CategoryId { get; set; }
    public int? CreatedByUserId { get; set; }
    public List<int> TagIds { get; set; } = new();
    public List<Tag> Tags { get; set; } = new();

    public EventPhotoDto? MainPhoto { get; set; }

    public List<EventPhotoDto> AdditionalPhotos { get; set; } = new();
}

public class EventPhotoDto
{
    public int Id { get; set; }
    public string Url { get; set; } = string.Empty;
}
