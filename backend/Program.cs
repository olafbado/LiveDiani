using backend.Data;
using Microsoft.EntityFrameworkCore;

// 🔧 Tworzymy builder aplikacji ASP.NET Core
var builder = WebApplication.CreateBuilder(args);

// ✅ Dodajemy usługi do kontenera DI (Dependency Injection)

// 📘 Swagger – dokumentacja API dostępna pod /swagger
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// 🌍 CORS – pozwala łączyć się z frontendem (np. Expo)
builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

// 📦 Rejestrujemy kontrolery (np. EventsController, UsersController)
builder.Services.AddControllers();

// 🔗 Pobieramy connection string do bazy danych z appsettings.json
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");

// 🗄️ Rejestrujemy DbContext z PostgreSQL jako providerem
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(connectionString));

// 🏗️ Budujemy aplikację na podstawie skonfigurowanego buildera
var app = builder.Build();

// 🔓 Włączamy CORS
app.UseCors();

// 🧪 W środowisku developerskim włączamy Swagger UI
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// 🔄 Przekierowanie na HTTPS – obecnie zakomentowane (opcjonalne)
// app.UseHttpsRedirection();

// 📍 Mapujemy endpointy do kontrolerów API
app.MapControllers();

// 🌱 Seedy – uruchamiane przy starcie aplikacji
// - Tworzą bazę danych (migracje)
// - Dodają przykładowe dane (jeśli nie istnieją)
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    db.Database.Migrate(); // automatyczna migracja EF Core
    DbSeeder.Seed(db);     // zasiewanie bazy danymi testowymi
}

// ▶️ Startujemy aplikację – nasłuch na domyślnym porcie
app.Run();
