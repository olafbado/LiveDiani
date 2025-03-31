using backend.Models;

namespace backend.Data;

public static class DbSeeder
{
    public static void Seed(AppDbContext context)
    {
        if (!context.Users.Any())
        {
            var users = new List<User>
            {
                new() { Username = "admin", Email = "admin@diani.com", Role = "admin" },
                new() { Username = "organizer1", Email = "org1@diani.com", Role = "organizer" },
                new() { Username = "user1", Email = "user1@diani.com", Role = "user" },
            };
            context.Users.AddRange(users);
            context.SaveChanges();
        }

        if (!context.EventCategories.Any())
        {
            var categories = new List<EventCategory>
            {
                new() { Name = "Beach Party" },
                new() { Name = "Yoga" },
                new() { Name = "Networking" }
            };
            context.EventCategories.AddRange(categories);
            context.SaveChanges();
        }

        if (!context.Tags.Any())
        {
            var tags = new List<Tag>
            {
                new() { Name = "Free" },
                new() { Name = "Live Music" },
                new() { Name = "Outdoor" }
            };
            context.Tags.AddRange(tags);
            context.SaveChanges();
        }

        if (!context.Locations.Any())
        {
            var locations = new List<Location>
            {
                new() { Name = "Diani Beach Club", Address = "Main Road" },
                new() { Name = "Yoga Garden", Address = "Forest Trail" },
                new() { Name = "Seafront Café", Address = "Ocean Drive" }
            };
            context.Locations.AddRange(locations);
            context.SaveChanges();
        }

        if (!context.Events.Any())
        {
            var location1 = context.Locations.First();
var location2 = context.Locations.Skip(1).First();
var location3 = context.Locations.Skip(2).First();

var event1 = new Event
{
    Title = "Sunset Beach Party",
    Description = "Live DJ and cocktails on the beach!",
    Date = DateTime.UtcNow.AddDays(1),
    LocationId = location1.Id,
    CategoryId = context.EventCategories.First().Id,
    CreatedByUserId = context.Users.First().Id
};

var event2 = new Event
{
    Title = "Morning Yoga",
    Description = "Start your day with peaceful yoga in the garden.",
    Date = DateTime.UtcNow.AddDays(2),
    LocationId = location2.Id,
    CategoryId = context.EventCategories.Skip(1).First().Id,
    CreatedByUserId = context.Users.Skip(1).First().Id
};

var event3 = new Event
{
    Title = "Business Mixer",
    Description = "Meet local entrepreneurs and expats.",
    Date = DateTime.UtcNow.AddDays(3),
    LocationId = location3.Id,
    CategoryId = context.EventCategories.Skip(2).First().Id,
    CreatedByUserId = context.Users.Skip(2).First().Id
};


            context.Events.AddRange(event1, event2, event3);
            context.SaveChanges();

            // Tagowanie eventów
            var tag1 = context.Tags.First();
            var tag2 = context.Tags.Skip(1).First();
            var tag3 = context.Tags.Skip(2).First();

            context.EventTags.AddRange(
                new EventTag { EventId = event1.Id, TagId = tag2.Id },
                new EventTag { EventId = event2.Id, TagId = tag3.Id },
                new EventTag { EventId = event3.Id, TagId = tag1.Id }
            );

            // Dodanie zdjęć
            context.EventPhotos.AddRange(
                new EventPhoto { EventId = event1.Id, Url = "https://example.com/beach.jpg" },
                new EventPhoto { EventId = event2.Id, Url = "https://example.com/yoga.jpg" },
                new EventPhoto { EventId = event3.Id, Url = "https://example.com/mixer.jpg" }
            );

            // Ulubione eventy
            var user1 = context.Users.First();
            context.FavoriteEvents.AddRange(
                new FavoriteEvent { UserId = user1.Id, EventId = event1.Id },
                new FavoriteEvent { UserId = user1.Id, EventId = event2.Id }
            );

            context.SaveChanges();
        }
    }
}
