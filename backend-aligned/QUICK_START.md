# Quick Start Guide

Get the SmartEstate Backend API running in 5 minutes!

## Prerequisites

- Node.js 18+ installed
- PostgreSQL 14+ installed and running
- Git installed

## Step 1: Install Dependencies

```bash
cd backend-aligned
npm install
```

## Step 2: Configure Environment

```bash
cp .env.example .env
```

Edit `.env` and update the database URL:
```env
DATABASE_URL="postgresql://YOUR_USER:YOUR_PASSWORD@localhost:5432/smartestate_db"
```

## Step 3: Create Database

```bash
# Connect to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE smartestate_db;

# Exit psql
\q
```

## Step 4: Set Up Database Schema

```bash
# Generate Prisma client
npm run prisma:generate

# Run migrations
npm run prisma:migrate

# Seed with mock data
npm run prisma:seed
```

## Step 5: Start the Server

```bash
npm run dev
```

The API will be running at `http://localhost:5000`

## Step 6: Test the API

### Health Check
```bash
curl http://localhost:5000/health
```

### Login as Technician
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "mike.johnson@smartestate.com",
    "password": "Password123!",
    "role": "technician"
  }'
```

Save the `token` from the response.

### Get Jobs (with authentication)
```bash
curl http://localhost:5000/api/jobs \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## Test Credentials

After seeding, use these credentials:

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@smartestate.com | Password123! |
| Operations | operations@smartestate.com | Password123! |
| Technician 1 | mike.johnson@smartestate.com | Password123! |
| Technician 2 | sarah.williams@smartestate.com | Password123! |
| Technician 3 | david.chen@smartestate.com | Password123! |
| Tenant | john.smith@example.com | Password123! |

## Common Issues

### Port 5000 already in use
Change the PORT in `.env`:
```env
PORT=3001
```

### Database connection failed
- Check PostgreSQL is running: `pg_isready`
- Verify DATABASE_URL in `.env`
- Ensure database exists

### Prisma errors
```bash
# Regenerate Prisma client
npm run prisma:generate

# Reset database (WARNING: deletes all data)
npx prisma migrate reset
```

## Next Steps

- Read the [API Documentation](./API_DOCS.md)
- Explore the [README](./README.md) for detailed information
- Check out the [Prisma Schema](./prisma/schema.prisma)

## Development Tips

### Watch mode
The dev server uses nodemon and automatically restarts on file changes.

### View database
```bash
npx prisma studio
```
Opens a GUI at `http://localhost:5555` to view/edit database.

### Check logs
Logs are written to console and (in production) to `./logs/app.log`

### Format code
```bash
npm run format
```

### Lint code
```bash
npm run lint
```

## Production Build

```bash
# Build TypeScript
npm run build

# Start production server
npm start
```

## Need Help?

- Check the [README](./README.md)
- Review the [API Documentation](./API_DOCS.md)
- Open an issue on GitHub
