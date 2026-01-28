# SmartEstate Backend API

Backend API for the SmartEstate Technician App - Built with TypeScript, Express, Prisma, and PostgreSQL.

**IMPORTANT:** All types are aligned with the existing mock data structure from the frontend.

## 🚀 Features

- **TypeScript** with strict mode enabled
- **Express.js** REST API
- **Prisma ORM** for database management
- **PostgreSQL** database
- **JWT Authentication** with refresh tokens
- **Socket.IO** for real-time updates
- **Express Validator** for request validation
- **Winston** for logging
- **Rate Limiting** for API protection
- **Helmet** for security headers
- **CORS** enabled

## 📋 Prerequisites

- Node.js 18+ and npm
- PostgreSQL 14+
- Git

## 🛠️ Installation

1. **Clone the repository**
```bash
cd backend-aligned
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
```bash
cp .env.example .env
```

Edit `.env` and configure your database connection:
```env
DATABASE_URL="postgresql://user:password@localhost:5432/smartestate_db"
JWT_SECRET="your-secret-key"
```

4. **Set up the database**
```bash
# Generate Prisma client
npm run prisma:generate

# Run migrations
npm run prisma:migrate

# Seed database with mock data
npm run prisma:seed
```

5. **Start the development server**
```bash
npm run dev
```

The API will be available at `http://localhost:5000`

## 📁 Project Structure

```
backend-aligned/
├── prisma/
│   ├── schema.prisma          # Database schema
│   └── seed.ts                # Database seed file
├── src/
│   ├── config/
│   │   ├── database.ts        # Prisma client
│   │   ├── env.ts             # Environment config
│   │   └── constants.ts       # App constants
│   ├── controllers/
│   │   ├── auth.controller.ts
│   │   ├── job.controller.ts
│   │   ├── technician.controller.ts
│   │   ├── message.controller.ts
│   │   └── dashboard.controller.ts
│   ├── middleware/
│   │   ├── auth.middleware.ts
│   │   ├── error.middleware.ts
│   │   ├── logger.middleware.ts
│   │   ├── rateLimit.middleware.ts
│   │   └── validation.middleware.ts
│   ├── routes/
│   │   ├── auth.routes.ts
│   │   ├── job.routes.ts
│   │   ├── technician.routes.ts
│   │   ├── message.routes.ts
│   │   └── dashboard.routes.ts
│   ├── services/
│   │   ├── auth.service.ts
│   │   ├── job.service.ts
│   │   ├── technician.service.ts
│   │   ├── message.service.ts
│   │   ├── dashboard.service.ts
│   │   └── socket.service.ts
│   ├── types/
│   │   ├── database.types.ts  # Database types (aligned with mock data)
│   │   └── api.types.ts       # API request/response types
│   ├── utils/
│   │   ├── jwt.utils.ts
│   │   ├── password.utils.ts
│   │   ├── sla.utils.ts
│   │   ├── ticketId.utils.ts
│   │   ├── pagination.utils.ts
│   │   └── mockDataGenerator.ts
│   └── app.ts                 # Main application file
├── .env.example
├── package.json
├── tsconfig.json
└── README.md
```

## 🔐 Authentication

### Test Credentials

After running the seed script, you can use these credentials:

- **Admin:** `admin@smartestate.com` / `Password123!`
- **Operations:** `operations@smartestate.com` / `Password123!`
- **Technician 1:** `mike.johnson@smartestate.com` / `Password123!`
- **Technician 2:** `sarah.williams@smartestate.com` / `Password123!`
- **Technician 3:** `david.chen@smartestate.com` / `Password123!`
- **Tenant:** `john.smith@example.com` / `Password123!`

### Login Example

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "mike.johnson@smartestate.com",
    "password": "Password123!",
    "role": "technician"
  }'
```

Response:
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "...",
      "name": "Mike Johnson",
      "email": "mike.johnson@smartestate.com",
      "role": "technician"
    }
  }
}
```

## 📡 API Endpoints

### Authentication
- `POST /api/auth/login` - Login user
- `POST /api/auth/refresh` - Refresh access token
- `POST /api/auth/register` - Register new user
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/me` - Get current user

### Jobs
- `GET /api/jobs` - Get all jobs (with filters)
- `GET /api/jobs/:id` - Get job by ID
- `GET /api/jobs/ticket/:ticketId` - Get job by ticket ID
- `POST /api/jobs` - Create new job
- `PATCH /api/jobs/:id/status` - Update job status
- `PATCH /api/jobs/:id/assign` - Assign job to technician
- `PATCH /api/jobs/:id/complete` - Complete job
- `DELETE /api/jobs/:id` - Delete job

### Technicians
- `GET /api/technicians` - Get all technicians (with filters)
- `GET /api/technicians/me` - Get current technician
- `GET /api/technicians/available` - Get available technicians
- `GET /api/technicians/:id` - Get technician by ID
- `GET /api/technicians/:id/stats` - Get technician statistics
- `PATCH /api/technicians/:id/availability` - Update availability
- `PATCH /api/technicians/:id/location` - Update location

### Messages
- `GET /api/messages` - Get messages (with filters)
- `GET /api/messages/conversations` - Get conversations list
- `GET /api/messages/ticket/:ticketId` - Get messages by ticket
- `GET /api/messages/:id` - Get message by ID
- `POST /api/messages` - Send message
- `PATCH /api/messages/:id/read` - Mark message as read
- `PATCH /api/messages/conversation/:conversationId/read` - Mark conversation as read
- `DELETE /api/messages/:id` - Delete message

### Dashboard
- `GET /api/dashboard` - Get complete dashboard data
- `GET /api/dashboard/stats` - Get dashboard statistics
- `GET /api/dashboard/jobs-per-day` - Get jobs per day chart data
- `GET /api/dashboard/jobs-by-category` - Get jobs by category chart data
- `GET /api/dashboard/sla-compliance` - Get SLA compliance chart data

## 🔌 Socket.IO Events

### Client → Server
- `job:update` - Update job status
- `message:send` - Send message
- `technician:location` - Update technician location
- `typing:start` - Start typing indicator
- `typing:stop` - Stop typing indicator

### Server → Client
- `job:updated` - Job was updated
- `message:received` - New message received
- `technician:location:updated` - Technician location updated
- `user:typing` - User is typing
- `user:stopped:typing` - User stopped typing

## 📊 Database Schema

The database schema is defined in `prisma/schema.prisma` and includes:

- **User** - User accounts (tenant, technician, operations, admin)
- **Technician** - Technician profiles and stats
- **MaintenanceJob** - Maintenance tickets/jobs
- **Building** - Building information
- **ChatMessage** - Messages between users
- **AuditLog** - Audit trail of actions
- **Notification** - User notifications
- **TimeTracking** - Job time tracking
- **Material** - Materials used in jobs
- **JobAssignment** - Job assignment history
- **TechnicianSchedule** - Technician schedules

## 🧪 Testing

```bash
# Run tests
npm test

# Run tests in watch mode
npm run test:watch
```

## 📝 Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm start            # Start production server
npm run prisma:generate  # Generate Prisma client
npm run prisma:migrate   # Run database migrations
npm run prisma:seed      # Seed database with mock data
npm test             # Run tests
npm run lint         # Lint code
npm run format       # Format code with Prettier
```

## 🔒 Security Features

- JWT authentication with refresh tokens
- Password hashing with bcrypt
- Rate limiting on all API routes
- Helmet for security headers
- CORS configuration
- Input validation with express-validator
- SQL injection protection via Prisma

## 🌐 Environment Variables

See `.env.example` for all available environment variables.

Key variables:
- `DATABASE_URL` - PostgreSQL connection string
- `JWT_SECRET` - Secret key for JWT tokens
- `PORT` - Server port (default: 5000)
- `NODE_ENV` - Environment (development/production)
- `CORS_ORIGIN` - Allowed CORS origins

## 📦 Production Deployment

1. Build the application:
```bash
npm run build
```

2. Set environment variables for production

3. Run database migrations:
```bash
npm run prisma:migrate
```

4. Start the server:
```bash
npm start
```

## 🐛 Troubleshooting

### Database Connection Issues
- Ensure PostgreSQL is running
- Check DATABASE_URL in .env
- Verify database exists

### Prisma Issues
- Run `npm run prisma:generate` to regenerate client
- Run `npm run prisma:migrate` to apply migrations

### Port Already in Use
- Change PORT in .env file
- Kill process using the port

## 📄 License

MIT

## 👥 Support

For issues and questions, please open an issue on GitHub.
