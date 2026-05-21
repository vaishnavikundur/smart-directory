import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import mongoose from 'mongoose';

interface AppError extends Error {
  statusCode?: number;
  code?: number;
}

export function errorHandler(
  err: AppError,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  console.error('Error:', err.message);

  // Zod validation errors
  if (err instanceof ZodError) {
    const errors = err.errors.map((e) => ({
      field: e.path.join('.'),
      message: e.message,
    }));
    res.status(400).json({
      error: 'Validation failed',
      details: errors,
    });
    return;
  }

  // Mongoose validation errors
  if (err instanceof mongoose.Error.ValidationError) {
    const errors = Object.entries(err.errors).map(([field, e]) => ({
      field,
      message: e.message,
    }));
    res.status(400).json({
      error: 'Validation failed',
      details: errors,
    });
    return;
  }

  // Mongoose cast errors (invalid ObjectId, etc.)
  if (err instanceof mongoose.Error.CastError) {
    res.status(400).json({
      error: `Invalid ${err.path}: ${String(err.value)}`,
    });
    return;
  }

  // MongoDB duplicate key error
  if (err.code === 11000) {
    res.status(409).json({
      error: 'Duplicate entry. A record with this value already exists.',
    });
    return;
  }

  // JWT errors (fallback - most handled in authenticate middleware)
  if (err.name === 'JsonWebTokenError') {
    res.status(401).json({ error: 'Invalid token.' });
    return;
  }
  if (err.name === 'TokenExpiredError') {
    res.status(401).json({ error: 'Token has expired.' });
    return;
  }

  // Custom errors with statusCode
  if (err.statusCode) {
    res.status(err.statusCode).json({ error: err.message });
    return;
  }

  // Generic server error
  res.status(500).json({
    error:
      process.env['NODE_ENV'] === 'production'
        ? 'Internal server error'
        : err.message || 'Internal server error',
  });
}
