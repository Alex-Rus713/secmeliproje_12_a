# 🎮 GameVerse - Game Information & Community Platform

A full-stack web application for discovering games, reading reviews, and connecting with the gaming community. Built with Spring Boot, React, TypeScript, PostgreSQL, and Redis.
host of the project 156.67.31.85
## 🏗️ Architecture

### Backend
- **Java 21** with **Spring Boot 3+**
- **PostgreSQL** for user data (reviews, ratings, likes, favorites)
- **Redis** for caching RAWG API responses (1 hour TTL)
- **JWT** authentication
- **Flyway** for database migrations
- **MapStruct** for DTO mapping
- **Clean Architecture** principles

### Frontend
- **React 18** with **TypeScript**
- **Vite** for build tooling
- **TailwindCSS** for styling
- **React Query (TanStack Query)** for data fetching
- **React Router v6** for routing
- **Axios** for HTTP requests

## 📋 Prerequisites

- Java 21+
- Node.js 20+
- Docker & Docker Compose
- Maven 3.9+
- PostgreSQL 15+ (if running locally)
- Redis 7+ (if running locally)
- RAWG API Key ([Get one here](https://rawg.io/apidocs))

## 🚀 Quick Start with Docker

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd gmPr
   ```

2. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env and add your RAWG_API_KEY
   ```

3. **Start all services**
   ```bash
   docker-compose up -d
   ```

4. **Access the application**
   - Frontend: http://localhost:80
   - Backend API: http://localhost:8080
   - PostgreSQL: localhost:5432
   - Redis: localhost:6379

## 🛠️ Local Development Setup

### Backend Setup

1. **Navigate to backend directory**
   ```bash
   cd backend
   ```

2. **Configure database**
   - Update `src/main/resources/application.yml` with your database credentials
   - Or set environment variables:
     ```bash
     export DB_HOST=localhost
     export DB_PORT=5432
     export DB_NAME=gameverse
     export DB_USER=gameverse
     export DB_PASSWORD=gameverse
     ```

3. **Configure Redis**
   ```bash
     export REDIS_HOST=localhost
     export REDIS_PORT=6379
   ```

4. **Set RAWG API Key**
   ```bash
     export RAWG_API_KEY=your-api-key-here
   ```

5. **Set JWT Secret**
   ```bash
     export JWT_SECRET=your-super-secret-jwt-key-change-in-production-min-256-bits
   ```

6. **Run the application**
   ```bash
   mvn spring-boot:run
   ```

### Frontend Setup

1. **Navigate to frontend directory**
   ```bash
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Access the application**
   - Frontend: http://localhost:5173

## 📁 Project Structure

```
gmPr/
├── backend/
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/com/gameverse/
│   │   │   │   ├── client/          # RAWG API client
│   │   │   │   ├── config/          # Configuration classes
│   │   │   │   ├── controller/     # REST controllers
│   │   │   │   ├── dto/             # Data Transfer Objects
│   │   │   │   ├── entity/          # JPA entities
│   │   │   │   ├── exception/       # Exception handlers
│   │   │   │   ├── repository/      # Data repositories
│   │   │   │   ├── security/        # JWT & Security
│   │   │   │   └── service/         # Business logic
│   │   │   └── resources/
│   │   │       ├── db/migration/    # Flyway migrations
│   │   │       └── application.yml
│   │   └── test/                     # Tests
│   └── Dockerfile
├── frontend/
│   ├── src/
│   │   ├── components/              # Reusable components
│   │   ├── context/                 # React context
│   │   ├── pages/                   # Page components
│   │   ├── services/                # API services
│   │   ├── types/                   # TypeScript types
│   │   └── App.tsx
│   └── Dockerfile
├── nginx/                           # Nginx configuration
├── docker-compose.yml
└── README.md
```

## 🗄️ Database Schema

### Users
- `id` (SERIAL PRIMARY KEY)
- `username` (VARCHAR(50) UNIQUE)
- `email` (VARCHAR(100) UNIQUE)
- `password_hash` (VARCHAR)
- `created_at` (TIMESTAMP)

### Reviews
- `id` (SERIAL PRIMARY KEY)
- `user_id` (INT REFERENCES users)
- `game_id` (INT)
- `comment` (TEXT)
- `created_at` (TIMESTAMP)

### Ratings
- `id` (SERIAL PRIMARY KEY)
- `user_id` (INT REFERENCES users)
- `game_id` (INT)
- `rating` (INT CHECK 1-5)
- `created_at` (TIMESTAMP)
- UNIQUE(user_id, game_id)

### Likes
- `id` (SERIAL PRIMARY KEY)
- `user_id` (INT REFERENCES users)
- `game_id` (INT)
- `created_at` (TIMESTAMP)
- UNIQUE(user_id, game_id)

### Favorites
- `id` (SERIAL PRIMARY KEY)
- `user_id` (INT REFERENCES users)
- `game_id` (INT)
- `created_at` (TIMESTAMP)
- UNIQUE(user_id, game_id)

## 🔌 API Endpoints

### Authentication (Public)
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Games (Public)
- `GET /api/games` - Get popular games (paginated)
- `GET /api/games/{id}` - Get game details
- `GET /api/games/search?query=...` - Search games

### Reviews (Protected)
- `POST /api/reviews` - Create review
- `GET /api/reviews/game/{gameId}` - Get reviews for game
- `DELETE /api/reviews/{id}` - Delete review (owner only)

### Ratings (Protected)
- `POST /api/ratings` - Submit rating
- `GET /api/ratings/game/{gameId}` - Get ratings for game

### Likes (Protected)
- `POST /api/likes` - Toggle like
- `GET /api/likes/game/{gameId}` - Get like count

### Favorites (Protected)
- `POST /api/favorites` - Toggle favorite
- `GET /api/favorites/me` - Get user favorites

## 🔐 Authentication

The application uses JWT (JSON Web Tokens) for authentication. After login/register, the token is stored in localStorage and automatically included in API requests.

**Protected endpoints** require the `Authorization` header:
```
Authorization: Bearer <token>
```

## 🎨 Frontend Pages

- **/** - Home page with popular games and search
- **/games** - Games list with search and filters
- **/games/:id** - Game details page
- **/login** - Login page
- **/register** - Registration page
- **/profile** - User profile (protected)
- **/favorites** - User favorites (protected)

## 🧪 Testing

### Backend Tests
```bash
cd backend
mvn test
```

### Frontend Tests
```bash
cd frontend
npm test
```

## 📦 Building for Production

### Backend
```bash
cd backend
mvn clean package -DskipTests
```

### Frontend
```bash
cd frontend
npm run build
```

## 🐳 Docker Commands

```bash
# Build and start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop all services
docker-compose down

# Stop and remove volumes
docker-compose down -v

# Rebuild specific service
docker-compose build backend
docker-compose up -d backend
```

## 🔧 Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `RAWG_API_KEY` | RAWG API key | Required |
| `JWT_SECRET` | JWT signing secret | Required |
| `DB_HOST` | PostgreSQL host | localhost |
| `DB_PORT` | PostgreSQL port | 5432 |
| `DB_NAME` | Database name | gameverse |
| `DB_USER` | Database user | gameverse |
| `DB_PASSWORD` | Database password | gameverse |
| `REDIS_HOST` | Redis host | localhost |
| `REDIS_PORT` | Redis port | 6379 |
| `SERVER_PORT` | Backend server port | 8080 |

## 🚨 Troubleshooting

### Backend won't start
- Check PostgreSQL is running
- Check Redis is running
- Verify RAWG_API_KEY is set
- Check database migrations ran successfully

### Frontend can't connect to backend
- Verify backend is running on port 8080
- Check CORS configuration
- Verify API_BASE_URL in frontend

### Database connection errors
- Verify PostgreSQL credentials
- Check database exists
- Ensure Flyway migrations completed

## 📝 License

This project is licensed under the mine License.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📧 Support

For support, please open an issue in the repository.

---

**Built with ❤️ using Spring Boot, React, and TypeScript**

# secmeliproje_12_a.git-
# secmeliproje_12_a.git-
# secmeliproje_12_a
# secmeliproje_12_a
