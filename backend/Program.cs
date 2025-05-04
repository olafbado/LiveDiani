using System.Text;
using backend.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;

// 🔧 Tworzymy builder aplikacji ASP.NET Core
var builder = WebApplication.CreateBuilder(args);
var config = builder.Configuration;
var secretKey = config["JwtSettings:SecretKey"];

// ✅ Dodajemy usługi do kontenera DI (Dependency Injection)

// 📘 Swagger – dokumentacja API dostępna pod /swagger
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// 🌍 CORS – pozwala łączyć się z frontendem (np. Expo)
builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        policy.AllowAnyOrigin().AllowAnyHeader().AllowAnyMethod();
    });
});

builder.Logging.ClearProviders();
builder.Logging.AddConsole();

// 📦 Rejestrujemy kontrolery (np. EventsController, UsersController)
builder
    .Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.ReferenceHandler = System
            .Text
            .Json
            .Serialization
            .ReferenceHandler
            .IgnoreCycles;
        options.JsonSerializerOptions.WriteIndented = true;
    });

// 🔗 Pobieramy connection string do bazy danych z appsettings.json
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");

// 🗄️ Rejestrujemy DbContext z PostgreSQL jako providerem
builder.Services.AddDbContext<AppDbContext>(options => options.UseNpgsql(connectionString));

builder
    .Services.AddAuthentication("Bearer")
    .AddJwtBearer(
        "Bearer",
        options =>
        {
            options.TokenValidationParameters = new TokenValidationParameters
            {
                ValidateIssuer = true,
                ValidateAudience = true,
                ValidateLifetime = true,
                ValidateIssuerSigningKey = true,
                ValidIssuer = builder.Configuration["Jwt:Issuer"],
                ValidAudience = builder.Configuration["Jwt:Audience"],
                IssuerSigningKey = new SymmetricSecurityKey(
                    Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"]!)
                ),
            };
        }
    );
builder.Services.AddAuthorization();

// 🏗️ Budujemy aplikację na podstawie skonfigurowanego buildera
var app = builder.Build();

app.UseAuthentication();
app.UseAuthorization();

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
    DbSeeder.Seed(db); // zasiewanie bazy danymi testowymi
}

// ▶️ Startujemy aplikację – nasłuch na domyślnym porcie
app.UseStaticFiles();
app.MapControllers();
app.Run();
