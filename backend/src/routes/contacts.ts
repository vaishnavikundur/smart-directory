import { Router } from 'express';
import multer from 'multer';
import { authenticate } from '../middleware/authenticate.js';
import {
  getContacts,
  getContact,
  createContact,
  updateContact,
  deleteContact,
  checkDuplicate,
  autocomplete,
  importContacts,
  exportContacts,
} from '../controllers/contactController.js';

const router = Router();

// Multer configured for memory storage (file kept in buffer)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max
  fileFilter: (_req, file, cb) => {
    if (file.mimetype === 'application/json' || file.originalname.endsWith('.json')) {
      cb(null, true);
    } else {
      cb(new Error('Only JSON files are allowed.'));
    }
  },
});

// All routes require authentication
router.use(authenticate);

// These specific routes MUST come before /:id to avoid route conflicts
router.get('/autocomplete', autocomplete);
router.get('/check-duplicate', checkDuplicate);
router.get('/export', exportContacts);
router.post('/import', upload.single('file'), importContacts);

// Standard CRUD routes
router.get('/', getContacts);
router.get('/:id', getContact);
router.post('/', createContact);
router.patch('/:id', updateContact);
router.delete('/:id', deleteContact);

export default router;
