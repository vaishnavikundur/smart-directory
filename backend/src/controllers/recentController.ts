import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import RecentSearch from '../models/RecentSearch.js';
import Contact from '../models/Contact.js';
import { cacheService } from '../services/cacheService.js';

const MAX_RECENT = 10;
const CACHE_TTL = 120; // 2 minutes

export async function addRecent(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const userId = req.userId!;
    const { contactId } = req.body as { contactId: string };

    if (!contactId) {
      res.status(400).json({ error: 'contactId is required.' });
      return;
    }

    // Verify the contact exists and belongs to the user
    const contactExists = await Contact.exists({
      _id: contactId,
      userId,
    });

    if (!contactExists) {
      res.status(404).json({ error: 'Contact not found.' });
      return;
    }

    // Upsert: remove existing entry for this contact, then insert new one
    await RecentSearch.deleteMany({
      userId: new mongoose.Types.ObjectId(userId),
      contactId: new mongoose.Types.ObjectId(contactId),
    });

    await RecentSearch.create({
      userId: new mongoose.Types.ObjectId(userId),
      contactId: new mongoose.Types.ObjectId(contactId),
    });

    // Enforce max limit: keep only the most recent MAX_RECENT entries
    const recentEntries = await RecentSearch.find({
      userId: new mongoose.Types.ObjectId(userId),
    })
      .sort({ createdAt: -1 })
      .skip(MAX_RECENT)
      .select('_id');

    if (recentEntries.length > 0) {
      await RecentSearch.deleteMany({
        _id: { $in: recentEntries.map((r) => r._id) },
      });
    }

    // Invalidate cache
    cacheService.delete(`recent:${userId}`);

    res.status(201).json({ message: 'Recent search recorded.' });
  } catch (error) {
    next(error);
  }
}

export async function getRecent(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const userId = req.userId!;
    const cacheKey = `recent:${userId}`;

    // Check cache first
    const cached = cacheService.get<unknown[]>(cacheKey);
    if (cached) {
      res.json({ recent: cached });
      return;
    }

    const recentSearches = await RecentSearch.find({
      userId: new mongoose.Types.ObjectId(userId),
    })
      .sort({ createdAt: -1 })
      .limit(MAX_RECENT)
      .populate({
        path: 'contactId',
        select: 'name phone email company isFavorite tags',
      })
      .lean();

    // Filter out entries where the contact was deleted and map _id to id
    const validResults = recentSearches
      .filter((r) => r.contactId !== null)
      .map((r: any) => ({
        ...r,
        id: r._id.toString(),
        contactId: {
          ...r.contactId,
          id: r.contactId._id.toString()
        }
      }));

    // Cache the results
    cacheService.set(cacheKey, validResults, CACHE_TTL);

    res.json({ recent: validResults });
  } catch (error) {
    next(error);
  }
}
