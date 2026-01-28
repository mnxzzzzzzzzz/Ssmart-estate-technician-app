// Environment Configuration

export const config = {
  // Server
  nodeEnv: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT || '5000', 10),
  apiBaseUrl: process.env.API_BASE_URL || 'http://localhost:5000/api',
  clientBaseUrl: process.env.CLIENT_BASE_URL || 'http://localhost:3000',

  // Database
  databaseUrl: process.env.DATABASE_URL || '',

  // JWT
  jwtSecret: process.env.JWT_SECRET || 'smartestate-secret-key-2025',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '24h',
  refreshTokenSecret: process.env.REFRESH_TOKEN_SECRET || 'smartestate-refresh-secret',
  refreshTokenExpiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN || '7d',

  // CORS
  corsOrigin: process.env.CORS_ORIGIN?.split(',') || ['http://localhost:3000'],

  // File Upload
  maxFileSize: parseInt(process.env.MAX_FILE_SIZE || '5242880', 10), // 5MB
  allowedFileTypes: process.env.ALLOWED_FILE_TYPES?.split(',') || [
    'image/jpeg',
    'image/png',
    'image/gif',
    'application/pdf',
  ],

  // Features
  enableMockData: process.env.ENABLE_MOCK_DATA === 'true',
  enableSocketIO: process.env.ENABLE_SOCKET_IO === 'true',
  enablePushNotifications: process.env.ENABLE_PUSH_NOTIFICATIONS === 'true',

  // Rate Limiting
  rateLimitWindowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000', 10), // 15 min
  rateLimitMaxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100', 10),

  // Logging
  logLevel: process.env.LOG_LEVEL || 'info',
  logFile: process.env.LOG_FILE || './logs/app.log',
};

export default config;
