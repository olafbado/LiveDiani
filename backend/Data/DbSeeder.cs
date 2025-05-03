using backend.Models;

namespace backend.Data;

public static class DbSeeder
{
    public static void Seed(AppDbContext context)
    {
        // Wyczyszczenie bazy (opcjonalnie: tylko przy development!)
        context.FavoriteEvents.RemoveRange(context.FavoriteEvents);
        context.EventTags.RemoveRange(context.EventTags);
        context.EventPhotos.RemoveRange(context.EventPhotos);
        context.Events.RemoveRange(context.Events);
        context.Tags.RemoveRange(context.Tags);
        context.EventCategories.RemoveRange(context.EventCategories);
        context.Locations.RemoveRange(context.Locations);
        context.Users.RemoveRange(context.Users);
        context.SaveChanges();

        // Użytkownicy
        var users = new List<User>
        {
            new()
            {
                Username = "admin",
                Email = "admin@diani.com",
                Role = "admin",
            },
            new()
            {
                Username = "organizer1",
                Email = "org1@diani.com",
                Role = "organizer",
            },
            new()
            {
                Username = "user1",
                Email = "user1@diani.com",
                Role = "user",
            },
        };
        context.Users.AddRange(users);
        context.SaveChanges();

        // Kategorie
        var categories = new List<EventCategory>
        {
            new() { Name = "Beach Party" },
            new() { Name = "Yoga" },
            new() { Name = "Water Sports" },
        };
        context.EventCategories.AddRange(categories);
        context.SaveChanges();

        // Tagi
        var tags = new List<Tag>
        {
            new() { Name = "Free" },
            new() { Name = "Live Music" },
            new() { Name = "Outdoor" },
        };
        context.Tags.AddRange(tags);
        context.SaveChanges();

        // Lokalizacje
        var locations = new List<Location>
        {
            new() { Name = "Diani Beach Bar", Address = "Main Coastal Road" },
            new() { Name = "Oceanfront Yoga Deck", Address = "Sunset Point" },
            new() { Name = "Lagoon Surf Spot", Address = "Kite Bay" },
        };
        context.Locations.AddRange(locations);
        context.SaveChanges();

        var today = DateTime.UtcNow.Date;
        var startOfWeek = today.AddDays(-(int)today.DayOfWeek + 1); // Monday

        // Eventy
        var beachEvent = new Event
        {
            Title = "Beach Bar Chillout",
            Description = "Afternoon beach bar session with chilled drinks and music.",
            Date = startOfWeek.AddDays(5).AddHours(14), // Saturday 14:00
            LocationId = locations[0].Id,
            CategoryId = categories.First(c => c.Name == "Beach Party").Id,
            CreatedByUserId = users[0].Id,
        };

        var yogaEvent = new Event
        {
            Title = "Sunset Yoga on the Beach",
            Description = "Join us for a peaceful yoga flow at golden hour.",
            Date = startOfWeek.AddDays(6).AddHours(18), // Sunday 18:00
            LocationId = locations[1].Id,
            CategoryId = categories.First(c => c.Name == "Yoga").Id,
            CreatedByUserId = users[1].Id,
        };

        var kiteEvent = new Event
        {
            Title = "Kitesurfing Showcase",
            Description = "Watch or join the local surfers flying across the waves.",
            Date = startOfWeek.AddDays(2).AddHours(15), // Wednesday 15:00
            LocationId = locations[2].Id,
            CategoryId = categories.First(c => c.Name == "Water Sports").Id,
            CreatedByUserId = users[2].Id,
        };

        context.Events.AddRange(beachEvent, yogaEvent, kiteEvent);
        context.SaveChanges();

        // Tagi do eventów
        context.EventTags.AddRange(
            new EventTag { EventId = beachEvent.Id, TagId = tags[0].Id }, // Free
            new EventTag { EventId = beachEvent.Id, TagId = tags[1].Id }, // Live Music
            new EventTag { EventId = yogaEvent.Id, TagId = tags[2].Id }, // Outdoor
            new EventTag { EventId = kiteEvent.Id, TagId = tags[0].Id }, // Free
            new EventTag { EventId = kiteEvent.Id, TagId = tags[2].Id } // Outdoor
        );

        // Zdjęcia do eventów
        context.EventPhotos.AddRange(
            new EventPhoto
            {
                EventId = beachEvent.Id,
                Url = "/uploads/beach_bar_1.png",
                IsMain = true,
            },
            new EventPhoto
            {
                EventId = beachEvent.Id,
                Url = "/uploads/beach_bar_2.png",
                IsMain = false,
            },
            new EventPhoto
            {
                EventId = yogaEvent.Id,
                Url = "/uploads/yoga_sunset_1.png",
                IsMain = true,
            },
            new EventPhoto
            {
                EventId = yogaEvent.Id,
                Url = "/uploads/yoga_sunset_2.png",
                IsMain = false,
            },
            new EventPhoto
            {
                EventId = kiteEvent.Id,
                Url = "/uploads/kitesurf_1.png",
                IsMain = true,
            },
            new EventPhoto
            {
                EventId = kiteEvent.Id,
                Url = "/uploads/kitesurf_2.png",
                IsMain = false,
            },
            new EventPhoto
            {
                EventId = kiteEvent.Id,
                Url = "/uploads/kitesurf_2.png",
                IsMain = false,
            },
            new EventPhoto
            {
                EventId = kiteEvent.Id,
                Url = "/uploads/kitesurf_2.png",
                IsMain = false,
            }
        );

        context.SaveChanges();
    }
}
