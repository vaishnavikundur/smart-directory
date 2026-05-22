import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import User from '../models/User.js';
import { config } from '../config/index.js';
import type { RegisterInput, LoginInput } from '../validators/auth.js';

interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

function generateTokens(userId: string): TokenPair {
  const accessToken = jwt.sign({ userId }, config.JWT_SECRET, {
    expiresIn: '15m',
  });
  const refreshToken = jwt.sign({ userId }, config.JWT_REFRESH_SECRET, {
    expiresIn: '7d',
  });
  return { accessToken, refreshToken };
}

function hashToken(token: string): string {
  return crypto.createHash('sha256').update(token).digest('hex');
}

export async function register(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { email, password, name } = req.body as RegisterInput;

    // Check for duplicate email
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(409).json({ error: 'An account with this email already exists.' });
      return;
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 12);

    // Create user
    const user = await User.create({ email, passwordHash, name });

    // Generate tokens
    const { accessToken, refreshToken } = generateTokens(String(user._id));

    // Store hashed refresh token
    user.refreshTokenHash = hashToken(refreshToken);
    await user.save();

    // Set refresh token as httpOnly cookie
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: config.NODE_ENV === 'production',
      sameSite: config.NODE_ENV === 'production' ? 'none' : 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      path: '/',
    });

    res.status(201).json({
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        preferences: user.preferences,
      },
      accessToken,
    });
  } catch (error) {
    console.error('Registration backend error:', error);
    next(error);
  }
}

export async function login(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { email, password } = req.body as LoginInput;

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      res.status(401).json({ error: 'Invalid email or password.' });
      return;
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      res.status(401).json({ error: 'Invalid email or password.' });
      return;
    }

    // Generate tokens
    const { accessToken, refreshToken } = generateTokens(String(user._id));

    // Store hashed refresh token
    user.refreshTokenHash = hashToken(refreshToken);
    await user.save();

    // Set refresh token cookie
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: config.NODE_ENV === 'production',
      sameSite: config.NODE_ENV === 'production' ? 'none' : 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: '/',
    });

    res.json({
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        preferences: user.preferences,
      },
      accessToken,
    });
  } catch (error) {
    console.error('Login backend error:', error);
    next(error);
  }
}

export async function refresh(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const refreshToken = req.cookies?.refreshToken as string | undefined;

    if (!refreshToken) {
      res.status(401).json({ error: 'Refresh token not found.' });
      return;
    }

    // Verify the refresh token
    let decoded: { userId: string };
    try {
      decoded = jwt.verify(refreshToken, config.JWT_REFRESH_SECRET) as { userId: string };
    } catch {
      res.status(401).json({ error: 'Invalid or expired refresh token.' });
      return;
    }

    // Find user and verify the stored hash matches
    const user = await User.findById(decoded.userId);
    if (!user || !user.refreshTokenHash) {
      res.status(401).json({ error: 'Invalid refresh token.' });
      return;
    }

    const tokenHash = hashToken(refreshToken);
    if (tokenHash !== user.refreshTokenHash) {
      // Possible token reuse attack — clear all tokens
      user.refreshTokenHash = undefined;
      await user.save();
      res.status(401).json({ error: 'Refresh token has been revoked.' });
      return;
    }

    // Generate new tokens (token rotation)
    const tokens = generateTokens(String(user._id));

    // Update stored hash
    user.refreshTokenHash = hashToken(tokens.refreshToken);
    await user.save();

    // Set new refresh token cookie
    res.cookie('refreshToken', tokens.refreshToken, {
      httpOnly: true,
      secure: config.NODE_ENV === 'production',
      sameSite: config.NODE_ENV === 'production' ? 'none' : 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: '/',
    });

    res.json({
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        preferences: user.preferences,
      },
      accessToken: tokens.accessToken
    });
  } catch (error) {
    next(error);
  }
}

export async function logout(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    // Clear refresh token hash in DB
    if (req.userId) {
      await User.findByIdAndUpdate(req.userId, { $unset: { refreshTokenHash: 1 } });
    }

    // Clear the cookie
    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: config.NODE_ENV === 'production',
      sameSite: config.NODE_ENV === 'production' ? 'none' : 'lax',
      path: '/',
    });

    res.json({ message: 'Logged out successfully.' });
  } catch (error) {
    next(error);
  }
}

export async function updatePreferences(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { theme } = req.body as { theme?: 'dark' | 'light' };

    if (theme && !['dark', 'light'].includes(theme)) {
      res.status(400).json({ error: 'Theme must be "dark" or "light".' });
      return;
    }

    const updateData: Record<string, unknown> = {};
    if (theme) updateData['preferences.theme'] = theme;

    const user = await User.findByIdAndUpdate(req.userId, { $set: updateData }, { new: true });

    if (!user) {
      res.status(404).json({ error: 'User not found.' });
      return;
    }

    res.json({
      preferences: user.preferences,
    });
  } catch (error) {
    next(error);
  }
}
