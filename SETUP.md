# GameVerse Setup Guide

## Quick Start

1. **Get RAWG API Key**
   - Visit https://rawg.io/apidocs
   - Sign up and get your free API key

2. **Set Environment Variables**
   ```bash
   export RAWG_API_KEY=your-api-key-here
   export JWT_SECRET=your-super-secret-jwt-key-min-256-bits
   ```

3. **Start with Docker**
   ```bash
   docker-compose up -d
   ```

4. **Access Application**
   - Frontend: http://localhost:80
   - Backend API: http://localhost:8080

## Manual Setup

### Backend

```bash
cd backend
mvn clean install
mvn spring-boot:run
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

## Database Migrations

Flyway will automatically run migrations on startup. To manually run:

```bash
cd backend
mvn flyway:migrate
```

## Testing

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

## Troubleshooting

### Port Already in Use
- Change ports in `docker-compose.yml` or `application.yml`

### Database Connection Failed
- Ensure PostgreSQL is running
- Check credentials in `.env` or `application.yml`

### RAWG API Errors
- Verify API key is correct
- Check API rate limits (100 requests/day on free tier)

### Redis Connection Failed
- Ensure Redis is running
- Check Redis host/port configuration

## Production Deployment

1. Set strong JWT_SECRET (min 256 bits)
2. Use environment variables for all secrets
3. Enable HTTPS
4. Configure proper CORS origins
5. Set up database backups
6. Monitor Redis memory usage
7. Configure rate limiting

