import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import path from 'path';
import { fileURLToPath } from 'url';
import { config } from './config/index.js';
import { connectDB } from './config/database.js';
import { errorHandler } from './middleware/errorHandler.js';
import authRoutes from './routes/auth.js';
import contactRoutes from './routes/contacts.js';
import recentRoutes from './routes/recent.js';
import User from './models/User.js';
import { searchIndexService } from './services/searchIndex.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Middleware setup
app.use(
  helmet({
    contentSecurityPolicy: false, // Prevents CSP from blocking dynamically bundled frontend scripts and remote fonts (e.g. Google Fonts)
  })
);
app.use(
  cors({
    origin: config.FRONTEND_URL,
    credentials: true,
  })
);
app.use(morgan(config.NODE_ENV === 'development' ? 'dev' : 'combined'));
app.use(express.json());
app.use(cookieParser());

// Healthcheck Route
app.get('/api/health', (_req, res) => {
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    env: config.NODE_ENV,
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/contacts', contactRoutes);
app.use('/api/recent', recentRoutes);

// Serve static assets in production
if (config.NODE_ENV === 'production') {
  const distPath = path.resolve(__dirname, '../../frontend/dist');
  app.use(express.static(distPath));

  // Catch-all route to serve the React index.html for SPA routing
  app.get('*', (req, res, next) => {
    // Avoid intercepting API requests
    if (req.path.startsWith('/api/')) {
      return next();
    }
    res.sendFile(path.join(distPath, 'index.html'));
  });
}

// Global Error Handler
app.use(errorHandler);

// Connect to Database and start server
async function startServer() {
  try {
    await connectDB();

    // Rebuild Search Indexes for all users in the system on startup asynchronously
    const users = await User.find({}, '_id').lean();
    console.log(`🔍 Building search indexes for ${users.length} users...`);
    
    // We build them concurrently in the background so it doesn't block server startup
    Promise.all(
      users.map(async (u) => {
        try {
          const userId = String(u._id);
          await searchIndexService.buildForUser(userId);
          console.log(`✅ Index built successfully for user: ${userId}`);
        } catch (err) {
          console.error(`❌ Failed to build search index for user ${u._id}:`, err);
        }
      })
    ).then(() => {
      console.log('✨ All search indexes loaded into memory successfully.');
    });

    app.listen(config.PORT, () => {
      console.log(`🚀 Server running in ${config.NODE_ENV} mode on http://localhost:${config.PORT}`);
    });
  } catch (err) {
    console.error('Fatal server startup error:', err);
    process.exit(1);
  }
}

startServer();
