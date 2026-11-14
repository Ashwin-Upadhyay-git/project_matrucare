import express from 'express';
import rateLimit from 'express-rate-limit';
import { submitContact } from '../controllers/contactController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

const contactLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many contact messages. Please try later.' }
});

router.post('/', protect, contactLimiter, submitContact);

export default router;
