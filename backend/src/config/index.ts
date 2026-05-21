import dotenv from 'dotenv';

dotenv.config();

function requireEnv(key: string, fallback?: string): string {
  const value = process.env[key] ?? fallback;
  if (value === undefined) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
}

export const config = {
  PORT: parseInt(requireEnv('PORT', '5000'), 10),
  MONGODB_URI: requireEnv('MONGODB_URI', 'mongodb://localhost:27017/contact-manager'),
  JWT_SECRET: requireEnv('JWT_SECRET', 'dev-jwt-secret-change-in-production'),
  JWT_REFRESH_SECRET: requireEnv('JWT_REFRESH_SECRET', 'dev-refresh-secret-change-in-production'),
  FRONTEND_URL: requireEnv('FRONTEND_URL', 'http://localhost:3000'),
  REDIS_URL: process.env['REDIS_URL'] || '',
  NODE_ENV: requireEnv('NODE_ENV', 'development'),
} as const;
