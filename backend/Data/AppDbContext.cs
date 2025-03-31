using Microsoft.EntityFrameworkCore;
using backend.Models;

namespace backend.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<Event> Events => Set<Event>();
    public DbSet<EventCategory> EventCategories => Set<EventCategory>();
    public DbSet<Tag> Tags => Set<Tag>();
    public DbSet<EventTag> EventTags => Set<EventTag>();
    public DbSet<EventPhoto> EventPhotos => Set<EventPhoto>();
    public DbSet<User> Users => Set<User>();
    public DbSet<FavoriteEvent> FavoriteEvents => Set<FavoriteEvent>();
    public DbSet<Location> Locations => Set<Location>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        // EventTag (many-to-many)
        modelBuilder.Entity<EventTag>()
            .HasKey(et => new { et.EventId, et.TagId });

        modelBuilder.Entity<EventTag>()
            .HasOne(et => et.Event)
            .WithMany(e => e.EventTags)
            .HasForeignKey(et => et.EventId);

        modelBuilder.Entity<EventTag>()
            .HasOne(et => et.Tag)
            .WithMany(t => t.EventTags)
            .HasForeignKey(et => et.TagId);

        // FavoriteEvent (many-to-many)
        modelBuilder.Entity<FavoriteEvent>()
            .HasKey(fe => new { fe.UserId, fe.EventId });

        modelBuilder.Entity<FavoriteEvent>()
            .HasOne(fe => fe.User)
            .WithMany(u => u.FavoriteEvents)
            .HasForeignKey(fe => fe.UserId);

        modelBuilder.Entity<FavoriteEvent>()
            .HasOne(fe => fe.Event)
            .WithMany()
            .HasForeignKey(fe => fe.EventId);
    }
}
