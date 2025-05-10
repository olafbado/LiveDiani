# Start the project:
cd frontend
npm install --force
npm run start
cd ../backend
dotnet clean && dotnet build && dotnet run
open android emulator

# Presentation
- Register
- Login as user
- show events, details, galery
- add to favorites
- logout
- Login as admin
- show events, details, galery
- add to favorites
- show crud

## ✅ Deliverables

### 1. CRUD operations on 8 classes + professional UI

Zaimplementowano pełne operacje CRUD (Create, Read, Update, Delete) dla 8 klas:

- `Event`
- `Location`
- `EventCategory`
- `Tag`
- `User`
- `FavoriteEvent` (dodawanie/odejmowanie jako ulubione)
- `EventPhoto` (upload, usuwanie)
- `EventTag` (relacja pomocnicza many-to-many)
  
### 2. Minimum 2 classes with foreign key

Zastosowano wiele relacji z kluczem obcym (FK):

- `Event → Location`
- `Event → EventCategory` 
- `Event → User`

### 3. Minimum 1 class with many-to-many relationship

Zaimplementowano relację many-to-many między:

- `Event` ↔️ `Tag`

Poprzez klasę pośredniczącą `EventTag`.  
Użytkownik może przypisywać wiele tagów do wydarzenia i odwrotnie – wydarzenia mogą mieć wiele tagów.

### 4. Additional functionality

Projekt został rozszerzony o istotne funkcjonalności wykraczające poza minimum:

#### 🔐 Authentication & Authorization

- Rejestracja i logowanie użytkowników (JWT token)
- Role: `user` i `admin`
- Admin widzi dodatkową zakładkę Manage z dostępem do zarządzania danymi

#### 🖼️ File upload & Gallery

- Użytkownik może przesyłać zdjęcia (główne + dodatkowe)
- Szczegóły wydarzenia zawierają slider + miniatury galerii

#### ❤️ Favorites system

- Zalogowany użytkownik może dodać lub usunąć wydarzenie z ulubionych
- Osobna zakładka Favorites prezentuje zapisane wydarzenia
