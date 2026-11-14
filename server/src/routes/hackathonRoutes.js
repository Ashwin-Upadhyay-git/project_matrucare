import express from 'express';
import rateLimit from 'express-rate-limit';
import { registerEntry, getMyEntry, deleteEntry } from '../controllers/hackathonController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

const registrationLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many registration attempts. Please try later.' }
});

router.post('/register', protect, registrationLimiter, registerEntry);
router.get('/my-entry', protect, getMyEntry);
router.delete('/', protect, deleteEntry);

export default router;
