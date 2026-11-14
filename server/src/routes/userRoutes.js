import express from 'express';
import { getCurrentUser, updateProfile } from '../controllers/userController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.get('/me', protect, getCurrentUser);
router.put('/update', protect, updateProfile);

export default router;
