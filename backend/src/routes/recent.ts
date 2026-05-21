import { Router } from 'express';
import { authenticate } from '../middleware/authenticate.js';
import { getRecent, addRecent } from '../controllers/recentController.js';

const router = Router();

router.use(authenticate);

router.get('/', getRecent);
router.post('/', addRecent);

export default router;
