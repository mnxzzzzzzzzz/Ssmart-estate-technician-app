# API Documentation

Complete API reference for the SmartEstate Backend.

## Base URL

```
http://localhost:5000/api
```

## Authentication

Most endpoints require authentication. Include the JWT token in the Authorization header:

```
Authorization: Bearer YOUR_TOKEN_HERE
```

## Response Format

All responses follow this format:

```typescript
{
  success: boolean;
  data?: any;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
    hasMore?: boolean;
  };
}
```

## Authentication Endpoints

### POST /auth/login

Login user and get JWT tokens.

**Request:**
```json
{
  "email": "mike.johnson@smartestate.com",
  "password": "Password123!",
  "role": "technician"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "user-id",
      "name": "Mike Johnson",
      "email": "mike.johnson@smartestate.com",
      "role": "technician"
    }
  }
}
```

### POST /auth/refresh

Refresh access token using refresh token.

**Request:**
```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### GET /auth/me

Get current authenticated user.

**Headers:** `Authorization: Bearer TOKEN`

**Response:**
```json
{
  "success": true,
  "data": {
    "userId": "user-id",
    "email": "mike.johnson@smartestate.com",
    "role": "technician"
  }
}
```

## Job Endpoints

### GET /jobs

Get all jobs with optional filters.

**Headers:** `Authorization: Bearer TOKEN`

**Query Parameters:**
- `status` - Filter by status (pending, assigned, in-progress, completed, escalated)
- `priority` - Filter by priority (low, medium, high, urgent)
- `building` - Filter by building name
- `technicianId` - Filter by technician ID
- `tenantId` - Filter by tenant ID
- `dateFrom` - Filter by start date (ISO 8601)
- `dateTo` - Filter by end date (ISO 8601)
- `search` - Search in ticket ID, description, category
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 20, max: 100)

**Example:**
```
GET /jobs?status=assigned&priority=high&page=1&limit=10
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "job-id",
      "ticketId": "TKT-2024-001",
      "issueCategory": "Plumbing",
      "aiConfidence": 0.95,
      "priority": "high",
      "building": "Tower A",
      "unit": "12B",
      "tenant": "John Smith",
      "assignedTechnician": "Mike Johnson",
      "technicianId": "tech-id",
      "slaDeadline": "2024-01-25T10:00:00Z",
      "status": "assigned",
      "description": "Toilet flush not working",
      "createdAt": "2024-01-24T08:00:00Z",
      "updatedAt": "2024-01-24T08:30:00Z"
    }
  ],
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 25,
    "hasMore": true
  }
}
```

### GET /jobs/:id

Get job by ID.

**Headers:** `Authorization: Bearer TOKEN`

**Response:** Single job object

### GET /jobs/ticket/:ticketId

Get job by ticket ID (e.g., TKT-2024-001).

**Headers:** `Authorization: Bearer TOKEN`

**Response:** Single job object

### POST /jobs

Create new job (Operations/Admin only).

**Headers:** `Authorization: Bearer TOKEN`

**Request:**
```json
{
  "issueCategory": "Plumbing",
  "priority": "high",
  "building": "Tower A",
  "unit": "12B",
  "tenant": "John Smith",
  "tenantId": "tenant-id",
  "description": "Toilet flush not working",
  "estimatedDuration": 60,
  "images": ["url1", "url2"]
}
```

**Response:** Created job object

### PATCH /jobs/:id/status

Update job status.

**Headers:** `Authorization: Bearer TOKEN`

**Request:**
```json
{
  "status": "in-progress",
  "notes": "Started working on the issue"
}
```

**Response:** Updated job object

### PATCH /jobs/:id/assign

Assign job to technician (Operations/Admin only).

**Headers:** `Authorization: Bearer TOKEN`

**Request:**
```json
{
  "technicianId": "tech-id",
  "notes": "Best match for this job"
}
```

**Response:** Updated job object

### PATCH /jobs/:id/complete

Complete job.

**Headers:** `Authorization: Bearer TOKEN`

**Request:**
```json
{
  "actualDuration": 75,
  "actualCost": 150.00,
  "notes": "Fixed the flush mechanism",
  "images": ["after-url1", "after-url2"]
}
```

**Response:** Updated job object

### DELETE /jobs/:id

Delete job (Operations/Admin only).

**Headers:** `Authorization: Bearer TOKEN`

**Response:**
```json
{
  "success": true,
  "data": {
    "message": "Job deleted successfully"
  }
}
```

## Technician Endpoints

### GET /technicians

Get all technicians with optional filters.

**Headers:** `Authorization: Bearer TOKEN`

**Query Parameters:**
- `availability` - Filter by availability (available, busy, offline)
- `building` - Filter by assigned building
- `skills` - Filter by skills (comma-separated)
- `minRating` - Filter by minimum rating
- `page` - Page number
- `limit` - Items per page

**Response:** Array of technician objects with pagination meta

### GET /technicians/me

Get current technician profile (Technician role only).

**Headers:** `Authorization: Bearer TOKEN`

**Response:** Technician object

### GET /technicians/:id

Get technician by ID.

**Headers:** `Authorization: Bearer TOKEN`

**Response:** Technician object

### GET /technicians/:id/stats

Get technician statistics.

**Headers:** `Authorization: Bearer TOKEN`

**Response:**
```json
{
  "success": true,
  "data": {
    "totalJobs": 247,
    "completedJobs": 235,
    "activeJobs": 3,
    "averageRating": 4.8,
    "onTimePercentage": 94.5,
    "slaCompliance": 96.2,
    "totalHoursWorked": 1240,
    "jobsByCategory": {
      "Plumbing": 120,
      "HVAC": 80,
      "Electrical": 47
    },
    "jobsByPriority": {
      "urgent": 15,
      "high": 45,
      "medium": 120,
      "low": 55
    }
  }
}
```

### PATCH /technicians/:id/availability

Update technician availability.

**Headers:** `Authorization: Bearer TOKEN`

**Request:**
```json
{
  "availability": "available"
}
```

**Response:** Updated technician object

### PATCH /technicians/:id/location

Update technician location.

**Headers:** `Authorization: Bearer TOKEN`

**Request:**
```json
{
  "latitude": 40.7128,
  "longitude": -74.0060
}
```

**Response:** Updated technician object

## Message Endpoints

### GET /messages

Get messages with filters.

**Headers:** `Authorization: Bearer TOKEN`

**Query Parameters:**
- `conversationId` - Filter by conversation
- `ticketId` - Filter by ticket
- `unreadOnly` - Show only unread messages (true/false)
- `page` - Page number
- `limit` - Items per page

**Response:** Array of message objects with pagination meta

### GET /messages/conversations

Get list of conversations for current user.

**Headers:** `Authorization: Bearer TOKEN`

**Response:**
```json
{
  "success": true,
  "data": {
    "conversations": [
      {
        "id": "conv-id",
        "participants": [...],
        "lastMessage": {...},
        "unreadCount": 3,
        "ticketId": "TKT-2024-001"
      }
    ]
  }
}
```

### GET /messages/ticket/:ticketId

Get all messages for a ticket.

**Headers:** `Authorization: Bearer TOKEN`

**Response:** Array of message objects

### POST /messages

Send a message.

**Headers:** `Authorization: Bearer TOKEN`

**Request:**
```json
{
  "conversationId": "conv-id",
  "receiverId": "user-id",
  "ticketId": "TKT-2024-001",
  "message": "I'm on my way",
  "type": "text"
}
```

**Response:** Created message object

### PATCH /messages/:id/read

Mark message as read.

**Headers:** `Authorization: Bearer TOKEN`

**Response:** Updated message object

## Dashboard Endpoints

### GET /dashboard

Get complete dashboard data (Operations/Admin only).

**Headers:** `Authorization: Bearer TOKEN`

**Query Parameters:**
- `dateFrom` - Start date filter
- `dateTo` - End date filter
- `building` - Building filter

**Response:**
```json
{
  "success": true,
  "data": {
    "stats": {
      "totalActiveJobs": 25,
      "jobsDueToday": 8,
      "slaBreaches": 2,
      "availableTechnicians": 12,
      "totalTicketsAllTime": 1247,
      "avgResponseTime": "2.5 hrs",
      "avgResolutionTime": "4.2 hrs",
      "overallSlaCompliance": 94.8
    },
    "jobsPerDay": [...],
    "jobsByCategory": [...],
    "slaCompliance": [...],
    "recentJobs": [...],
    "activeTechnicians": [...]
  }
}
```

### GET /dashboard/stats

Get dashboard statistics only.

### GET /dashboard/jobs-per-day

Get jobs per day chart data.

### GET /dashboard/jobs-by-category

Get jobs by category chart data.

### GET /dashboard/sla-compliance

Get SLA compliance chart data.

## Error Codes

| Code | Description |
|------|-------------|
| VALIDATION_ERROR | Request validation failed |
| UNAUTHORIZED | Authentication required |
| INVALID_TOKEN | Invalid or expired token |
| FORBIDDEN | Insufficient permissions |
| NOT_FOUND | Resource not found |
| JOB_NOT_FOUND | Job not found |
| TECHNICIAN_NOT_FOUND | Technician not found |
| MESSAGE_NOT_FOUND | Message not found |
| INVALID_CREDENTIALS | Invalid email or password |
| ACCOUNT_INACTIVE | User account is inactive |
| RATE_LIMIT_EXCEEDED | Too many requests |
| DATABASE_ERROR | Database operation failed |
| INTERNAL_ERROR | Internal server error |

## Rate Limiting

- General API: 100 requests per 15 minutes
- Auth endpoints: 5 requests per 15 minutes
- File uploads: 50 requests per hour

## Pagination

Default pagination:
- Page: 1
- Limit: 20
- Max limit: 100

## Date Formats

All dates use ISO 8601 format:
```
2024-01-24T08:00:00Z
```

## Socket.IO

Connect to Socket.IO for real-time updates:

```javascript
import io from 'socket.io-client';

const socket = io('http://localhost:5000', {
  auth: {
    token: 'YOUR_JWT_TOKEN'
  }
});

// Listen for events
socket.on('job:updated', (data) => {
  console.log('Job updated:', data);
});

// Emit events
socket.emit('technician:location', {
  latitude: 40.7128,
  longitude: -74.0060
});
```

## Testing with cURL

### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"mike.johnson@smartestate.com","password":"Password123!","role":"technician"}'
```

### Get Jobs
```bash
curl http://localhost:5000/api/jobs \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Update Job Status
```bash
curl -X PATCH http://localhost:5000/api/jobs/JOB_ID/status \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"status":"in-progress"}'
```

## Testing with Postman

Import the API into Postman:
1. Create a new collection
2. Add environment variables for `baseUrl` and `token`
3. Use `{{baseUrl}}/api/jobs` in requests
4. Set Authorization header to `Bearer {{token}}`
